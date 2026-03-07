-- Migration: Create RPC function for payment intent record creation
-- Date: 2026-03-07
-- Purpose: Wave 1A - Atomic and idempotent payment record creation
-- Related: Payment flow RPC migration

-- DROP FUNCTION IF EXISTS create_payment_intent_record CASCADE;

CREATE OR REPLACE FUNCTION create_payment_intent_record(
  p_booking_id UUID,
  p_stripe_payment_intent_id TEXT,
  p_amount_pence INTEGER,
  p_currency TEXT,
  p_receipt_email TEXT,
  p_idempotency_key TEXT,
  p_attempt_no INTEGER,
  p_organization_id UUID,
  p_livemode BOOLEAN,
  p_metadata JSONB DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_booking_status booking_status;
  v_booking_org_id UUID;
  v_payment_record booking_payments%ROWTYPE;
  v_is_retry BOOLEAN := false;
  v_result JSONB;
BEGIN
  -- ========================================
  -- VALIDATION 1: Booking exists and fetch status + org
  -- ========================================
  SELECT status, organization_id 
  INTO v_booking_status, v_booking_org_id
  FROM bookings 
  WHERE id = p_booking_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'BOOKING_NOT_FOUND: Booking % does not exist', p_booking_id;
  END IF;

  -- ========================================
  -- VALIDATION 2: Booking status allows payment
  -- ========================================
  -- Enum values: NEW, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, PENDING_PAYMENT, PAYMENT_FAILED
  -- Allow: NEW, PAYMENT_FAILED, PENDING_PAYMENT (retry)
  -- Reject: CONFIRMED, COMPLETED, CANCELLED, IN_PROGRESS
  IF v_booking_status IN ('CONFIRMED', 'COMPLETED', 'CANCELLED', 'IN_PROGRESS') THEN
    RAISE EXCEPTION 'INVALID_BOOKING_STATUS: Cannot create payment for booking with status %', v_booking_status;
  END IF;

  -- ========================================
  -- VALIDATION 3: Amount validation
  -- ========================================
  IF p_amount_pence IS NULL OR p_amount_pence <= 0 THEN
    RAISE EXCEPTION 'INVALID_AMOUNT: Amount must be greater than 0, got %', p_amount_pence;
  END IF;

  IF p_amount_pence > 10000000 THEN -- £100,000 safety limit
    RAISE EXCEPTION 'AMOUNT_TOO_LARGE: Amount % exceeds safety limit', p_amount_pence;
  END IF;

  -- ========================================
  -- VALIDATION 4: Currency format (flexible, not hardcoded)
  -- ========================================
  IF p_currency IS NULL OR p_currency !~ '^[A-Z]{3}$' THEN
    RAISE EXCEPTION 'INVALID_CURRENCY_FORMAT: Currency must be 3-letter uppercase code, got %', p_currency;
  END IF;

  -- ========================================
  -- VALIDATION 5: Organization match (security)
  -- ========================================
  IF v_booking_org_id != p_organization_id THEN
    RAISE EXCEPTION 'ORGANIZATION_MISMATCH: Booking belongs to different organization';
  END IF;

  -- ========================================
  -- VALIDATION 6: Required fields
  -- ========================================
  IF p_stripe_payment_intent_id IS NULL OR p_stripe_payment_intent_id = '' THEN
    RAISE EXCEPTION 'MISSING_STRIPE_PI_ID: Stripe Payment Intent ID is required';
  END IF;

  IF p_idempotency_key IS NULL OR p_idempotency_key = '' THEN
    RAISE EXCEPTION 'MISSING_IDEMPOTENCY_KEY: Idempotency key is required';
  END IF;

  IF p_attempt_no IS NULL OR p_attempt_no < 1 THEN
    RAISE EXCEPTION 'INVALID_ATTEMPT_NUMBER: Attempt number must be >= 1, got %', p_attempt_no;
  END IF;

  -- ========================================
  -- IDEMPOTENT INSERT: Try insert, return existing if conflict
  -- ========================================
  INSERT INTO booking_payments (
    booking_id,
    stripe_payment_intent_id,
    organization_id,
    amount_pence,
    currency,
    status,
    receipt_email,
    idempotency_key,
    attempt_no,
    livemode,
    metadata
  ) VALUES (
    p_booking_id,
    p_stripe_payment_intent_id,
    p_organization_id,
    p_amount_pence,
    p_currency,
    'pending',
    p_receipt_email,
    p_idempotency_key,
    p_attempt_no,
    p_livemode,
    p_metadata
  )
  ON CONFLICT (idempotency_key) DO NOTHING
  RETURNING * INTO v_payment_record;

  -- If conflict occurred, fetch existing record
  IF v_payment_record.id IS NULL THEN
    SELECT * INTO v_payment_record
    FROM booking_payments
    WHERE idempotency_key = p_idempotency_key;
    
    v_is_retry := true;
  END IF;

  -- ========================================
  -- UPDATE BOOKING STATUS (conditional)
  -- ========================================
  -- Only update if status is NEW or PAYMENT_FAILED
  -- If already PENDING_PAYMENT, no update needed (idempotent)
  IF v_booking_status IN ('NEW', 'PAYMENT_FAILED') THEN
    UPDATE bookings
    SET 
      status = 'PENDING_PAYMENT',
      updated_at = NOW()
    WHERE id = p_booking_id;
    
    -- Update local variable for response
    v_booking_status := 'PENDING_PAYMENT';
  END IF;

  -- ========================================
  -- BUILD JSON RESPONSE
  -- ========================================
  v_result := jsonb_build_object(
    'success', true,
    'payment_id', v_payment_record.id,
    'booking_id', v_payment_record.booking_id,
    'stripe_payment_intent_id', v_payment_record.stripe_payment_intent_id,
    'idempotency_key', v_payment_record.idempotency_key,
    'attempt_no', v_payment_record.attempt_no,
    'amount_pence', v_payment_record.amount_pence,
    'currency', v_payment_record.currency,
    'booking_status', v_booking_status,
    'is_retry', v_is_retry,
    'created_at', v_payment_record.created_at
  );

  RETURN v_result;

EXCEPTION
  WHEN OTHERS THEN
    -- Return error as JSON
    RETURN jsonb_build_object(
      'success', false,
      'error_code', SQLSTATE,
      'error_message', SQLERRM,
      'booking_id', p_booking_id
    );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_payment_intent_record TO authenticated;

-- Add function comment
COMMENT ON FUNCTION create_payment_intent_record IS 
'Wave 1A RPC: Creates payment intent record with idempotency protection.
- Validates booking status, amount, currency, organization
- Idempotent: returns existing record if same idempotency_key
- Updates booking status to PENDING_PAYMENT if needed
- Does NOT overwrite existing records on conflict';
