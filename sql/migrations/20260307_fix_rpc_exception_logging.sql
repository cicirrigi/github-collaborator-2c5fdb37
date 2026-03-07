-- Wave 1B Hardening: Add exception logging to stripe_events table
-- This ensures audit trail even when RPC crashes with unexpected errors

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
  v_error_message TEXT;
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
      'error_message', 'Payment intent ID is required and cannot be empty'
    );
  END IF;

  -- ============================================
  -- STEP 2: IDEMPOTENCY CHECK + EVENT INSERT
  -- ============================================
  
  -- Try to insert the event (will fail if duplicate due to unique constraint)
  BEGIN
    INSERT INTO stripe_events (
      stripe_event_id,
      event_type,
      livemode,
      api_version,
      payload,
      booking_id,
      booking_payment_id,
      organization_id,
      received_at
    ) VALUES (
      p_stripe_event_id,
      p_event_type,
      p_livemode,
      p_api_version,
      p_payload,
      p_booking_id,
      NULL,
      NULL,
      COALESCE(p_event_created_at, now())
    )
    RETURNING id INTO v_event_db_id;

  EXCEPTION
    WHEN unique_violation THEN
      -- Event already exists, check if it was processed
      SELECT * INTO v_existing_event 
      FROM stripe_events 
      WHERE stripe_event_id = p_stripe_event_id;

      IF v_existing_event.processed_at IS NOT NULL THEN
        -- Already processed successfully
        RETURN jsonb_build_object(
          'success', true,
          'result', 'already_processed',
          'processed_at', v_existing_event.processed_at,
          'event_db_id', v_existing_event.id
        );
      ELSE
        -- Event exists but not processed (possibly failed before)
        -- Update it and continue processing
        v_event_db_id := v_existing_event.id;
      END IF;
  END;

  -- ============================================
  -- STEP 3: RESOLVE BOOKING ID
  -- ============================================
  
  IF p_booking_id IS NOT NULL THEN
    v_booking_id := p_booking_id;
  ELSE
    -- Try to find booking via payment intent
    SELECT bp.booking_id INTO v_booking_id
    FROM booking_payments bp
    WHERE bp.stripe_payment_intent_id = p_stripe_payment_intent_id
    LIMIT 1;

    IF v_booking_id IS NULL THEN
      -- No booking found - this is a warning, not an error
      -- Event is logged but ignored
      UPDATE stripe_events
      SET 
        processed_at = now(),
        processing_error = NULL
      WHERE id = v_event_db_id;

      RETURN jsonb_build_object(
        'success', true,
        'result', 'ignored',
        'warning_code', 'booking_not_found',
        'warning_message', 'No booking found for payment intent: ' || p_stripe_payment_intent_id,
        'event_db_id', v_event_db_id
      );
    END IF;

    -- Update event with resolved booking_id
    UPDATE stripe_events
    SET booking_id = v_booking_id
    WHERE id = v_event_db_id;
  END IF;

  -- ============================================
  -- STEP 4: FETCH CURRENT STATE
  -- ============================================
  
  SELECT * INTO v_payment_record
  FROM booking_payments
  WHERE stripe_payment_intent_id = p_stripe_payment_intent_id
  LIMIT 1;

  IF NOT FOUND THEN
    UPDATE stripe_events
    SET 
      processed_at = now(),
      processing_error = NULL
    WHERE id = v_event_db_id;

    RETURN jsonb_build_object(
      'success', true,
      'result', 'ignored',
      'warning_code', 'payment_not_found',
      'warning_message', 'No payment record found for intent: ' || p_stripe_payment_intent_id,
      'event_db_id', v_event_db_id
    );
  END IF;

  SELECT * INTO v_booking_record
  FROM bookings
  WHERE id = v_booking_id;

  IF NOT FOUND THEN
    UPDATE stripe_events
    SET 
      processed_at = now(),
      processing_error = 'Booking not found: ' || v_booking_id::TEXT
    WHERE id = v_event_db_id;

    RETURN jsonb_build_object(
      'success', false,
      'error_code', 'booking_not_found',
      'error_message', 'Booking not found: ' || v_booking_id::TEXT,
      'event_db_id', v_event_db_id
    );
  END IF;

  v_booking_status_before := v_booking_record.status::TEXT;
  v_payment_status_before := v_payment_record.status;

  -- ============================================
  -- STEP 5: EVENT-SPECIFIC PROCESSING
  -- ============================================
  
  CASE p_event_type
    WHEN 'payment_intent.succeeded' THEN
      -- Defensive: Only update if not already in terminal success state
      IF v_payment_record.status IN ('succeeded') THEN
        v_warning_code := 'payment_already_succeeded';
        v_warning_message := 'Payment already in succeeded state';
        v_payment_status_after := v_payment_status_before;
      ELSIF v_payment_record.status IN ('failed', 'canceled') THEN
        v_warning_code := 'payment_in_terminal_state';
        v_warning_message := 'Payment in terminal state: ' || v_payment_record.status;
        v_payment_status_after := v_payment_status_before;
      ELSE
        UPDATE booking_payments
        SET 
          status = 'succeeded',
          captured_at = COALESCE(p_event_created_at, now()),
          livemode = p_livemode,
          stripe_charge_id = p_charge_id,
          updated_at = now()
        WHERE id = v_payment_record.id;
        
        v_payment_status_after := 'succeeded';
      END IF;

      -- Update booking to CONFIRMED if payment succeeded
      IF v_booking_record.status IN ('CONFIRMED', 'IN_PROGRESS', 'COMPLETED') THEN
        v_warning_code := 'booking_already_confirmed';
        v_warning_message := 'Booking already in confirmed or later state';
        v_booking_status_after := v_booking_status_before;
      ELSIF v_booking_record.status NOT IN ('PENDING_PAYMENT', 'PAYMENT_FAILED') THEN
        v_warning_code := 'booking_status_mismatch';
        v_warning_message := 'Unexpected booking status for confirmation: ' || v_booking_record.status;
        v_booking_status_after := v_booking_status_before;
      ELSE
        UPDATE bookings
        SET 
          status = 'CONFIRMED',
          updated_at = now()
        WHERE id = v_booking_id;
        
        v_booking_status_after := 'CONFIRMED';
      END IF;

    WHEN 'payment_intent.payment_failed' THEN
      -- Defensive: Don't downgrade succeeded payments
      IF v_payment_record.status = 'succeeded' THEN
        v_warning_code := 'payment_already_succeeded';
        v_warning_message := 'Cannot mark succeeded payment as failed';
        v_payment_status_after := v_payment_status_before;
      ELSE
        UPDATE booking_payments
        SET 
          status = 'failed',
          last_error = p_last_error,
          livemode = p_livemode,
          updated_at = now()
        WHERE id = v_payment_record.id;
        
        v_payment_status_after := 'failed';
      END IF;

      -- Update booking to PAYMENT_FAILED
      IF v_booking_record.status IN ('CONFIRMED', 'IN_PROGRESS', 'COMPLETED') THEN
        v_warning_code := 'booking_already_confirmed';
        v_warning_message := 'Cannot mark confirmed booking as payment failed';
        v_booking_status_after := v_booking_status_before;
      ELSE
        UPDATE bookings
        SET 
          status = 'PAYMENT_FAILED',
          updated_at = now()
        WHERE id = v_booking_id;
        
        v_booking_status_after := 'PAYMENT_FAILED';
      END IF;

    WHEN 'payment_intent.canceled' THEN
      -- Defensive: Don't downgrade succeeded payments
      IF v_payment_record.status = 'succeeded' THEN
        v_warning_code := 'payment_already_succeeded';
        v_warning_message := 'Cannot cancel succeeded payment';
        v_payment_status_after := v_payment_status_before;
      ELSE
        UPDATE booking_payments
        SET 
          status = 'canceled',
          livemode = p_livemode,
          updated_at = now()
        WHERE id = v_payment_record.id;
        
        v_payment_status_after := 'canceled';
      END IF;

      -- Update booking to CANCELLED
      IF v_booking_record.status IN ('CONFIRMED', 'IN_PROGRESS', 'COMPLETED') THEN
        v_warning_code := 'booking_already_confirmed';
        v_warning_message := 'Cannot cancel confirmed booking via payment cancellation';
        v_booking_status_after := v_booking_status_before;
      ELSE
        UPDATE bookings
        SET 
          status = 'CANCELLED',
          updated_at = now()
        WHERE id = v_booking_id;
        
        v_booking_status_after := 'CANCELLED';
      END IF;

    ELSE
      -- Unsupported event type
      UPDATE stripe_events
      SET 
        processed_at = now(),
        processing_error = NULL
      WHERE id = v_event_db_id;

      RETURN jsonb_build_object(
        'success', true,
        'result', 'ignored',
        'warning_code', 'unsupported_event_type',
        'warning_message', 'Event type not supported: ' || p_event_type,
        'event_db_id', v_event_db_id
      );
  END CASE;

  -- ============================================
  -- STEP 6: MARK EVENT AS PROCESSED
  -- ============================================
  
  UPDATE stripe_events
  SET 
    processed_at = now(),
    processing_error = NULL
  WHERE id = v_event_db_id;

  -- ============================================
  -- STEP 7: RETURN SUCCESS RESPONSE
  -- ============================================
  
  RETURN jsonb_build_object(
    'success', true,
    'result', 'processed',
    'event_db_id', v_event_db_id,
    'booking_id', v_booking_id,
    'booking_status', v_booking_status_after,
    'payment_id', v_payment_record.id,
    'payment_status', v_payment_status_after,
    'processed_at', now(),
    'warning_code', v_warning_code,
    'warning_message', v_warning_message,
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
    -- HARDENING: Write exception to stripe_events for audit trail
    v_error_message := 'RPC exception: ' || SQLERRM || ' (SQLSTATE: ' || SQLSTATE || ')';
    
    -- Try to update event with error (if event was inserted)
    IF v_event_db_id IS NOT NULL THEN
      BEGIN
        UPDATE stripe_events
        SET processing_error = v_error_message
        WHERE id = v_event_db_id;
      EXCEPTION
        WHEN OTHERS THEN
          -- If update fails, at least return the error
          NULL;
      END;
    END IF;
    
    RETURN jsonb_build_object(
      'success', false,
      'error_code', 'internal_error',
      'error_message', SQLERRM,
      'error_detail', SQLSTATE,
      'event_db_id', v_event_db_id
    );
END;
$$;

-- Update function comment
COMMENT ON FUNCTION apply_stripe_payment_event IS 
'Wave 1B (Hardened): Atomically processes Stripe payment_intent.* webhook events.
Handles idempotency via stripe_events.stripe_event_id unique constraint.
Applies defensive status transitions (no downgrade of succeeded/confirmed).
Writes processing_error to stripe_events table on exception for audit trail.
Returns structured JSONB with success/error codes and audit trail.
Supported events: payment_intent.succeeded, payment_intent.payment_failed, payment_intent.canceled';
