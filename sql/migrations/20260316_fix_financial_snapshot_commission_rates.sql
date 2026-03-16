-- ============================================================================
-- Migration: Fix Financial Snapshot Commission Rates
-- Date: 2026-03-16
-- Author: Financial Flow Audit
--
-- Purpose: Replace hardcoded 30% platform / 0% operator fees with actual
--          values from organization_settings table
--
-- Changes:
--   - Removes: v_platform_fee_rate_bp := 3000 (hardcoded 30%)
--   - Removes: v_operator_fee_rate_bp := 0 (hardcoded 0%)
--   - Adds: Query to organization_settings for actual commission rates
--   - Adds: NULL validation for commission_pct fields
--   - Adds: Safe conversion NUMERIC → basis points with round()
--   - Keeps: Booking override priority (if exists)
--   - Keeps: All idempotency logic unchanged
--   - Keeps: VAT at 0 temporarily (documented as TODO)
--
-- Expected Result:
--   New snapshots will have platform_fee_rate_bp = 1000 (10%)
--   New snapshots will have operator_fee_rate_bp = 900 (9%)
--   Based on organization_settings values: 0.10 and 0.09
-- ============================================================================

CREATE OR REPLACE FUNCTION create_financial_snapshot_for_payment(
  p_payment_id uuid,
  p_pricing_source text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_payment record;
  v_booking record;
  v_org_settings record;

  v_next_version int;

  -- ✅ NO LONGER HARDCODED - will be loaded from organization_settings
  v_platform_fee_rate_bp int;
  v_operator_fee_rate_bp int;

  v_gross int;
  v_vat_pence int := 0;  -- TODO: VAT calculation not implemented yet, kept at 0 temporarily
  v_subtotal_ex_vat_pence int;

  v_platform_fee_pence int := 0;
  v_operator_fee_pence int := 0;

  -- processor fee from metadata
  v_processor_fee_pence int := 0;
  v_net_collected_pence int := 0;

  v_driver_payout_pence int := 0;

  v_vendor_cost_pence int := 0;
  v_profit_pence int := 0;

  v_new_id uuid;
BEGIN
  -- ========================================================================
  -- STEP 1: FETCH PAYMENT
  -- ========================================================================
  SELECT * INTO v_payment
  FROM public.booking_payments
  WHERE id = p_payment_id;

  IF v_payment.id IS NULL THEN
    RAISE EXCEPTION 'Payment not found: %', p_payment_id;
  END IF;

  -- ========================================================================
  -- STEP 2: IDEMPOTENCY CHECK
  -- ========================================================================
  -- v1: payment_succeeded => if any snapshot exists for this payment, return it
  IF p_pricing_source = 'payment_succeeded' THEN
    SELECT id INTO v_new_id
    FROM public.internal_booking_financials
    WHERE booking_payment_id = p_payment_id
    ORDER BY version DESC
    LIMIT 1;

    IF v_new_id IS NOT NULL THEN
      RETURN v_new_id;
    END IF;
  END IF;

  -- v2: payment_fee_finalized => allow a new version,
  -- but do not duplicate if fee_finalized already exists
  IF p_pricing_source = 'payment_fee_finalized' THEN
    SELECT id INTO v_new_id
    FROM public.internal_booking_financials
    WHERE booking_payment_id = p_payment_id
      AND pricing_source = 'payment_fee_finalized'
    ORDER BY version DESC
    LIMIT 1;

    IF v_new_id IS NOT NULL THEN
      RETURN v_new_id;
    END IF;
  END IF;

  -- ========================================================================
  -- STEP 3: FETCH ORGANIZATION SETTINGS (NEW - replaces hardcoded values)
  -- ========================================================================
  SELECT
    platform_commission_pct,
    operator_commission_pct
  INTO v_org_settings
  FROM public.organization_settings
  WHERE organization_id = v_payment.organization_id;

  -- ✅ EXPLICIT FAILURE if organization_settings not found (using NOT FOUND pattern)
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Organization settings not found for organization_id: %. Cannot calculate financial snapshot without commission rates.',
      v_payment.organization_id;
  END IF;

  -- ✅ EXPLICIT FAILURE if commission rates are NULL
  IF v_org_settings.platform_commission_pct IS NULL THEN
    RAISE EXCEPTION 'platform_commission_pct is NULL for organization_id: %. Cannot calculate financial snapshot.',
      v_payment.organization_id;
  END IF;

  IF v_org_settings.operator_commission_pct IS NULL THEN
    RAISE EXCEPTION 'operator_commission_pct is NULL for organization_id: %. Cannot calculate financial snapshot.',
      v_payment.organization_id;
  END IF;

  -- ✅ SAFE CONVERSION: NUMERIC (0.10) → basis points (1000)
  -- Using round() to avoid precision issues
  v_platform_fee_rate_bp := round(v_org_settings.platform_commission_pct * 10000)::int;
  v_operator_fee_rate_bp := round(v_org_settings.operator_commission_pct * 10000)::int;

  -- ========================================================================
  -- STEP 4: FETCH BOOKING OVERRIDES (priority over org settings)
  -- ========================================================================
  SELECT
    id,
    platform_fee_rate_bp_override,
    operator_fee_rate_bp_override
  INTO v_booking
  FROM public.bookings
  WHERE id = v_payment.booking_id;

  -- ✅ OVERRIDE PRIORITY: booking overrides take precedence if set
  IF v_booking.id IS NOT NULL THEN
    v_platform_fee_rate_bp := COALESCE(v_booking.platform_fee_rate_bp_override, v_platform_fee_rate_bp);
    v_operator_fee_rate_bp := COALESCE(v_booking.operator_fee_rate_bp_override, v_operator_fee_rate_bp);
  END IF;

  -- ========================================================================
  -- STEP 5: CALCULATE VERSION
  -- ========================================================================
  SELECT COALESCE(MAX(version), 0) + 1
    INTO v_next_version
  FROM public.internal_booking_financials
  WHERE booking_id = v_payment.booking_id;

  -- ========================================================================
  -- STEP 6: CALCULATE FEES (unchanged logic)
  -- ========================================================================
  v_gross := v_payment.amount_pence;
  v_subtotal_ex_vat_pence := v_gross - v_vat_pence;

  -- fees (rounding consistent)
  v_platform_fee_pence := round(v_gross * (v_platform_fee_rate_bp / 10000.0))::int;
  v_operator_fee_pence := round(v_gross * (v_operator_fee_rate_bp / 10000.0))::int;

  -- payout (driver gets remainder)
  v_driver_payout_pence := GREATEST(v_gross - v_platform_fee_pence - v_operator_fee_pence, 0);

  -- ✅ processor fee from metadata (safe parse - validate numeric before cast)
  IF (v_payment.metadata->>'stripe_fee_pence') ~ '^\d+$' THEN
    v_processor_fee_pence := (v_payment.metadata->>'stripe_fee_pence')::int;
  ELSE
    v_processor_fee_pence := 0;
  END IF;

  -- ✅ net collected after processor fee
  v_net_collected_pence := GREATEST(v_gross - v_processor_fee_pence, 0);

  -- vendor_cost: operator + driver
  v_vendor_cost_pence := v_operator_fee_pence + v_driver_payout_pence;

  -- ✅ platform profit net after Stripe fee
  v_profit_pence := GREATEST(v_platform_fee_pence - v_processor_fee_pence, 0);

  -- ========================================================================
  -- STEP 7: INSERT FINANCIAL SNAPSHOT
  -- ========================================================================
  INSERT INTO public.internal_booking_financials (
    booking_id,
    version,
    currency,

    gross_amount_pence,
    vat_amount_pence,
    subtotal_ex_vat_pence,

    platform_fee_pence,
    platform_fee_rate_bp,

    operator_fee_pence,
    operator_fee_rate_bp,

    processor_fee_pence,
    net_collected_pence,
    net_to_platform_pence,
    net_to_operator_pence,
    net_to_driver_pence,

    vendor_cost_pence,
    driver_payout_pence,
    platform_profit_pence,

    pricing_source,
    calculated_at,
    booking_payment_id,
    line_items
  ) VALUES (
    v_payment.booking_id,
    v_next_version,
    v_payment.currency,

    v_gross,
    v_vat_pence,
    v_subtotal_ex_vat_pence,

    v_platform_fee_pence,
    v_platform_fee_rate_bp,

    v_operator_fee_pence,
    v_operator_fee_rate_bp,

    v_processor_fee_pence,
    v_net_collected_pence,
    v_platform_fee_pence,
    v_operator_fee_pence,
    v_driver_payout_pence,

    v_vendor_cost_pence,
    v_driver_payout_pence,
    v_profit_pence,

    p_pricing_source,
    NOW(),
    p_payment_id,

    -- ✅ AUDIT METADATA: document calculation source
    jsonb_build_object(
      'source', p_pricing_source,
      'payment_id', p_payment_id,
      'calculation_method', 'organization_settings',
      'organization_id', v_payment.organization_id,
      'had_booking_override', (v_booking.platform_fee_rate_bp_override IS NOT NULL
                                OR v_booking.operator_fee_rate_bp_override IS NOT NULL),

      'gross_amount_pence', v_gross,
      'vat_amount_pence', v_vat_pence,
      'subtotal_ex_vat_pence', v_subtotal_ex_vat_pence,

      'platform_fee_rate_bp', v_platform_fee_rate_bp,
      'platform_fee_pence', v_platform_fee_pence,

      'operator_fee_rate_bp', v_operator_fee_rate_bp,
      'operator_fee_pence', v_operator_fee_pence,

      'driver_payout_pence', v_driver_payout_pence,

      'processor_fee_pence', v_processor_fee_pence,
      'net_collected_pence', v_net_collected_pence
    )
  )
  RETURNING id INTO v_new_id;

  RETURN v_new_id;
END;
$$;

-- ============================================================================
-- Migration Notes:
-- ============================================================================
-- 1. This function is called automatically by triggers on booking_payments:
--    - booking_payment_succeeded_snapshot (on status = 'succeeded')
--    - trg_booking_payments_fee_finalized (on stripe_fee_pence added)
--
-- 2. Triggers remain unchanged - no modifications to trigger flow
--
-- 3. Expected behavior after migration:
--    - New snapshots will use 10% platform / 9% operator (from org_settings)
--    - Old snapshots (30% platform / 0% operator) remain in DB for historical record
--    - Idempotency ensures no duplicate snapshots for same payment
--
-- 4. Rollback strategy:
--    - Can restore previous version of function from git history
--    - Old snapshots remain valid and unchanged
--
-- 5. Testing:
--    - Run manual test: SELECT create_financial_snapshot_for_payment('<payment_id>', 'payment_succeeded');
--    - Verify platform_fee_rate_bp = 1000, operator_fee_rate_bp = 900
--    - Check line_items.calculation_method = 'organization_settings'
-- ============================================================================
