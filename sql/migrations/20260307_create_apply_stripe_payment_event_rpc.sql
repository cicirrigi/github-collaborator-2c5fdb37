-- Wave 1B: Stripe Payment Event Processing RPC
-- Atomically processes Stripe webhook events for payment_intent.*
-- Handles idempotency, defensive status transitions, and audit logging

CREATE OR REPLACE FUNCTION apply_stripe_payment_event(
  p_stripe_event_id TEXT,
  p_event_type TEXT,
  p_stripe_payment_intent_id TEXT,
  p_livemode BOOLEAN,
  p_event_created_at TIMESTAMPTZ,
  p_payload JSONB,
  p_api_version TEXT DEFAULT NULL,
  p_booking_id UUID DEFAULT NULL,
  p_charge_id TEXT DEFAULT NULL,
  p_last_error TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  v_event_db_id UUID;
  v_existing_event RECORD;
  v_payment_record RECORD;
  v_booking_record RECORD;
  v_booking_id UUID;
  v_warning_code TEXT;
  v_warning_message TEXT;
  v_booking_status_before TEXT;
  v_payment_status_before TEXT;
  v_booking_status_after TEXT;
  v_payment_status_after TEXT;
BEGIN
  -- ============================================
  -- STEP 1: INPUT VALIDATION
  -- ============================================
  
  IF p_stripe_event_id IS NULL OR p_stripe_event_id = '' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error_code', 'invalid_stripe_event_id',
      'error_message', 'Stripe event ID is required and cannot be empty'
    );
  END IF;

  IF p_event_type IS NULL OR p_event_type = '' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error_code', 'invalid_event_type',
      'error_message', 'Event type is required and cannot be empty'
    );
  END IF;

  IF p_stripe_payment_intent_id IS NULL OR p_stripe_payment_intent_id = '' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error_code', 'invalid_payment_intent_id',
      'error_message', 'Stripe payment intent ID is required and cannot be empty'
    );
  END IF;

  IF p_payload IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error_code', 'invalid_payload',
      'error_message', 'Event payload is required'
    );
  END IF;

  -- Check if event type is supported in this RPC
  IF p_event_type NOT IN (
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
    'payment_intent.canceled'
  ) THEN
    RETURN jsonb_build_object(
      'success', true,
      'result', 'ignored',
      'event_processing_state', 'ignored',
      'warning_message', format('Event type %s not supported in RPC - handle in old flow', p_event_type)
    );
  END IF;

  -- ============================================
  -- STEP 2: CLAIM EVENT (IDEMPOTENCY)
  -- ============================================
  
  -- Attempt to claim event by inserting
  INSERT INTO stripe_events (
    stripe_event_id,
    event_type,
    livemode,
    api_version,
    payload,
    received_at
  ) VALUES (
    p_stripe_event_id,
    p_event_type,
    p_livemode,
    p_api_version,
    p_payload,
    now()
  )
  ON CONFLICT (stripe_event_id) DO NOTHING
  RETURNING id INTO v_event_db_id;

  -- If insert failed, event already exists
  IF v_event_db_id IS NULL THEN
    -- Fetch existing event details
    SELECT 
      id, 
      processed_at, 
      booking_payment_id,
      booking_id,
      metadata
    INTO v_existing_event
    FROM stripe_events
    WHERE stripe_event_id = p_stripe_event_id;
    
    -- Check if fully processed
    IF v_existing_event.processed_at IS NOT NULL THEN
      -- Event already processed successfully
      RETURN jsonb_build_object(
        'success', true,
        'result', 'already_processed',
        'event_processing_state', 'completed',
        'event_id', v_existing_event.id,
        'booking_id', v_existing_event.booking_id,
        'payment_id', v_existing_event.booking_payment_id,
        'processed_at', v_existing_event.processed_at
      );
    ELSE
      -- Event claimed but not finished (crash/timeout scenario)
      RETURN jsonb_build_object(
        'success', false,
        'error_code', 'event_claimed_but_unfinished',
        'error_message', 'Event was claimed but processing did not complete. Manual investigation required.',
        'event_id', v_existing_event.id,
        'warning_code', 'requires_manual_review'
      );
    END IF;
  END IF;

  -- Event successfully claimed, proceed with processing

  -- ============================================
  -- STEP 3: FETCH PAYMENT RECORD
  -- ============================================
  
  SELECT 
    id,
    booking_id,
    status,
    organization_id,
    attempt_no
  INTO v_payment_record
  FROM booking_payments
  WHERE stripe_payment_intent_id = p_stripe_payment_intent_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error_code', 'payment_record_not_found',
      'error_message', format('No payment record found for payment intent %s', p_stripe_payment_intent_id),
      'stripe_payment_intent_id', p_stripe_payment_intent_id
    );
  END IF;

  -- Use booking_id from payment record as source of truth
  v_booking_id := v_payment_record.booking_id;
  v_payment_status_before := v_payment_record.status;

  -- OPTIONAL: Verify p_booking_id if provided (sanity check)
  IF p_booking_id IS NOT NULL AND p_booking_id != v_booking_id THEN
    RETURN jsonb_build_object(
      'success', false,
      'error_code', 'booking_id_mismatch',
      'error_message', format(
        'Provided booking_id %s does not match payment record booking_id %s',
        p_booking_id,
        v_booking_id
      ),
      'warning_code', 'booking_mapping_error'
    );
  END IF;

  -- ============================================
  -- STEP 4: FETCH BOOKING
  -- ============================================
  
  SELECT 
    id,
    status,
    organization_id
  INTO v_booking_record
  FROM bookings
  WHERE id = v_booking_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error_code', 'booking_not_found',
      'error_message', format('Booking %s not found', v_booking_id),
      'booking_id', v_booking_id
    );
  END IF;

  v_booking_status_before := v_booking_record.status;

  -- ============================================
  -- STEP 5: APPLY STATUS TRANSITIONS (DEFENSIVE)
  -- ============================================

  CASE p_event_type
    -- ========================================
    -- PAYMENT SUCCEEDED
    -- ========================================
    WHEN 'payment_intent.succeeded' THEN
      
      -- Update payment record (defensive)
      IF v_payment_record.status = 'succeeded' THEN
        -- Already succeeded, idempotent
        v_warning_message := 'Payment already marked as succeeded';
        
      ELSIF v_payment_record.status IN ('failed', 'canceled', 'refunded') THEN
        -- Don't upgrade from terminal failure states
        RETURN jsonb_build_object(
          'success', false,
          'error_code', 'invalid_payment_status_transition',
          'error_message', format(
            'Cannot mark payment as succeeded: current status is %s',
            v_payment_record.status
          ),
          'payment_status', v_payment_record.status,
          'warning_code', 'payment_status_conflict'
        );
        
      ELSE
        -- Safe to mark as succeeded
        UPDATE booking_payments
        SET 
          status = 'succeeded',
          captured_at = p_event_created_at,
          stripe_charge_id = p_charge_id,
          livemode = p_livemode,
          updated_at = now()
        WHERE id = v_payment_record.id;
      END IF;

      -- Update booking status (defensive)
      IF v_booking_record.status = 'CONFIRMED' THEN
        -- Already confirmed, idempotent
        IF v_warning_message IS NOT NULL THEN
          v_warning_message := v_warning_message || '; Booking already confirmed';
        ELSE
          v_warning_message := 'Booking already confirmed';
        END IF;
        
      ELSIF v_booking_record.status IN ('COMPLETED', 'CANCELLED') THEN
        -- Don't touch terminal booking states
        v_warning_code := 'booking_in_terminal_state';
        IF v_warning_message IS NOT NULL THEN
          v_warning_message := v_warning_message || '; ' || 
            format('Booking is %s, not updating to CONFIRMED', v_booking_record.status);
        ELSE
          v_warning_message := format('Booking is %s, not updating to CONFIRMED', v_booking_record.status);
        END IF;
        
      ELSIF v_booking_record.status IN ('PENDING_PAYMENT', 'PAYMENT_FAILED', 'NEW') THEN
        -- Safe to confirm
        UPDATE bookings
        SET 
          status = 'CONFIRMED',
          updated_at = now()
        WHERE id = v_booking_id;
      END IF;

    -- ========================================
    -- PAYMENT FAILED
    -- ========================================
    WHEN 'payment_intent.payment_failed' THEN
      
      -- Update payment record (defensive)
      IF v_payment_record.status = 'succeeded' THEN
        -- Don't downgrade succeeded payments
        RETURN jsonb_build_object(
          'success', false,
          'error_code', 'cannot_downgrade_payment',
          'error_message', 'Cannot mark succeeded payment as failed',
          'payment_status', 'succeeded',
          'warning_code', 'payment_status_protected'
        );
        
      ELSIF v_payment_record.status = 'failed' THEN
        -- Already failed, update error message if provided
        UPDATE booking_payments
        SET 
          last_error = COALESCE(p_last_error, last_error),
          failed_at = p_event_created_at,
          livemode = p_livemode,
          updated_at = now()
        WHERE id = v_payment_record.id;
        
        v_warning_message := 'Payment already marked as failed, updated error message';
        
      ELSE
        -- Mark as failed
        UPDATE booking_payments
        SET 
          status = 'failed',
          failed_at = p_event_created_at,
          last_error = p_last_error,
          livemode = p_livemode,
          updated_at = now()
        WHERE id = v_payment_record.id;
      END IF;

      -- Update booking status (defensive)
      IF v_booking_record.status = 'CONFIRMED' THEN
        -- Don't downgrade confirmed bookings
        v_warning_code := 'booking_already_confirmed';
        IF v_warning_message IS NOT NULL THEN
          v_warning_message := v_warning_message || '; Booking is CONFIRMED, not downgrading to PAYMENT_FAILED';
        ELSE
          v_warning_message := 'Booking is CONFIRMED, not downgrading to PAYMENT_FAILED';
        END IF;
        
      ELSIF v_booking_record.status IN ('COMPLETED', 'CANCELLED') THEN
        -- Don't touch terminal states
        v_warning_code := 'booking_in_terminal_state';
        IF v_warning_message IS NOT NULL THEN
          v_warning_message := v_warning_message || '; ' || 
            format('Booking is %s, not updating', v_booking_record.status);
        ELSE
          v_warning_message := format('Booking is %s, not updating', v_booking_record.status);
        END IF;
        
      ELSIF v_booking_record.status IN ('PENDING_PAYMENT', 'NEW') THEN
        -- Safe to mark as failed
        UPDATE bookings
        SET 
          status = 'PAYMENT_FAILED',
          updated_at = now()
        WHERE id = v_booking_id;
      END IF;

    -- ========================================
    -- PAYMENT CANCELED
    -- ========================================
    WHEN 'payment_intent.canceled' THEN
      
      -- Update payment record (defensive)
      IF v_payment_record.status = 'succeeded' THEN
        -- Don't downgrade succeeded payments
        RETURN jsonb_build_object(
          'success', false,
          'error_code', 'cannot_downgrade_payment',
          'error_message', 'Cannot mark succeeded payment as canceled',
          'payment_status', 'succeeded',
          'warning_code', 'payment_status_protected'
        );
        
      ELSIF v_payment_record.status = 'canceled' THEN
        -- Already canceled, idempotent
        v_warning_message := 'Payment already marked as canceled';
        
      ELSE
        -- Mark as canceled
        UPDATE booking_payments
        SET 
          status = 'canceled',
          canceled_at = p_event_created_at,
          livemode = p_livemode,
          updated_at = now()
        WHERE id = v_payment_record.id;
      END IF;

      -- Update booking status (defensive - same logic as failed)
      IF v_booking_record.status = 'CONFIRMED' THEN
        v_warning_code := 'booking_already_confirmed';
        IF v_warning_message IS NOT NULL THEN
          v_warning_message := v_warning_message || '; Booking is CONFIRMED, not downgrading to PAYMENT_FAILED';
        ELSE
          v_warning_message := 'Booking is CONFIRMED, not downgrading to PAYMENT_FAILED';
        END IF;
        
      ELSIF v_booking_record.status IN ('COMPLETED', 'CANCELLED') THEN
        v_warning_code := 'booking_in_terminal_state';
        IF v_warning_message IS NOT NULL THEN
          v_warning_message := v_warning_message || '; ' || 
            format('Booking is %s, not updating', v_booking_record.status);
        ELSE
          v_warning_message := format('Booking is %s, not updating', v_booking_record.status);
        END IF;
        
      ELSIF v_booking_record.status IN ('PENDING_PAYMENT', 'NEW', 'PAYMENT_FAILED') THEN
        -- Safe to mark as failed (allow retry)
        UPDATE bookings
        SET 
          status = 'PAYMENT_FAILED',
          updated_at = now()
        WHERE id = v_booking_id;
      END IF;

  END CASE;

  -- Get final statuses after updates
  SELECT status INTO v_payment_status_after
  FROM booking_payments
  WHERE id = v_payment_record.id;

  SELECT status INTO v_booking_status_after
  FROM bookings
  WHERE id = v_booking_id;

  -- ============================================
  -- STEP 6: UPDATE STRIPE_EVENTS METADATA
  -- ============================================
  
  UPDATE stripe_events
  SET 
    booking_id = v_booking_id,
    booking_payment_id = v_payment_record.id,
    organization_id = v_payment_record.organization_id,
    metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object(
      'event_type', p_event_type,
      'stripe_payment_intent_id', p_stripe_payment_intent_id,
      'warning_code', v_warning_code,
      'warning_message', v_warning_message,
      'booking_status_before', v_booking_status_before,
      'booking_status_after', v_booking_status_after,
      'payment_status_before', v_payment_status_before,
      'payment_status_after', v_payment_status_after,
      'event_created_at', p_event_created_at,
      'processed_by', 'apply_stripe_payment_event'
    )
  WHERE id = v_event_db_id;

  -- ============================================
  -- STEP 7: MARK EVENT AS PROCESSED
  -- ============================================
  
  -- CRITICAL: Set processed_at ONLY after all updates succeed
  UPDATE stripe_events
  SET processed_at = now()
  WHERE id = v_event_db_id;

  -- ============================================
  -- STEP 8: RETURN STRUCTURED RESULT
  -- ============================================
  
  RETURN jsonb_build_object(
    'success', true,
    'result', 'processed',
    'event_processing_state', 'completed',
    'warning_code', v_warning_code,
    'warning_message', v_warning_message,
    'event_id', v_event_db_id,
    'booking_id', v_booking_id,
    'booking_status', v_booking_status_after,
    'payment_id', v_payment_record.id,
    'payment_status', v_payment_status_after,
    'processed_at', now(),
    'transitions', jsonb_build_object(
      'booking', jsonb_build_object(
        'before', v_booking_status_before,
        'after', v_booking_status_after
      ),
      'payment', jsonb_build_object(
        'before', v_payment_status_before,
        'after', v_payment_status_after
      )
    )
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error_code', 'internal_error',
      'error_message', SQLERRM,
      'error_detail', SQLSTATE
    );
END;
$$;

-- Add comment for documentation
COMMENT ON FUNCTION apply_stripe_payment_event IS 
'Wave 1B: Atomically processes Stripe payment_intent.* webhook events.
Handles idempotency via stripe_events.stripe_event_id unique constraint.
Applies defensive status transitions (no downgrade of succeeded/confirmed).
Returns structured JSONB with success/error codes and audit trail.
Supported events: payment_intent.succeeded, payment_intent.payment_failed, payment_intent.canceled';
