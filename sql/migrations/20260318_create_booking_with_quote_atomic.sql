-- ============================================================================
-- Migration: Create atomic booking + quote creation RPC
-- Date: 2026-03-18
-- Purpose: Enforce mandatory quote creation for all new bookings
-- 
-- IMPORTANT: This is a NEW RPC, does NOT modify existing create_booking_with_legs
-- ============================================================================

-- DROP FUNCTION IF EXISTS create_booking_with_quote_atomic CASCADE;

CREATE OR REPLACE FUNCTION create_booking_with_quote_atomic(
  p_booking JSONB,
  p_legs JSONB[],
  p_quote JSONB
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_booking_id uuid;
  v_quote_id uuid;
  v_leg record;
BEGIN
  
  -- =====================================================
  -- STEP 1: Insert booking
  -- =====================================================
  INSERT INTO public.bookings (
    customer_id,
    organization_id,
    booking_type,
    fleet_mode,
    status,
    currency,
    source,
    start_at,
    end_at,
    hours_requested,
    days_requested,
    passenger_count,
    bag_count,
    custom_requirements,
    billing_entity_id,
    billing_snapshot,
    trip_configuration_raw
  )
  VALUES (
    (p_booking->>'customer_id')::uuid,
    nullif(p_booking->>'organization_id','')::uuid,
    (p_booking->>'booking_type')::booking_type,
    nullif(p_booking->>'fleet_mode','')::fleet_mode,
    coalesce((p_booking->>'status')::booking_status, 'NEW'::booking_status),
    coalesce(p_booking->>'currency','GBP'),
    coalesce(p_booking->>'source','web'),
    nullif(p_booking->>'start_at','')::timestamptz,
    nullif(p_booking->>'end_at','')::timestamptz,
    nullif(p_booking->>'hours_requested','')::int,
    nullif(p_booking->>'days_requested','')::int,
    nullif(p_booking->>'passenger_count','')::int,
    nullif(p_booking->>'bag_count','')::int,
    p_booking->>'custom_requirements',
    nullif(p_booking->>'billing_entity_id','')::uuid,
    p_booking->'billing_snapshot',
    p_booking->'trip_configuration_raw'
  )
  RETURNING id INTO v_booking_id;

  -- =====================================================
  -- STEP 2: Insert booking legs
  -- =====================================================
  FOR v_leg IN SELECT * FROM jsonb_array_elements(p_legs::jsonb)
  LOOP
    INSERT INTO public.booking_legs (
      booking_id,
      leg_number,
      leg_kind,
      status,
      pickup_place_id,
      pickup_address,
      pickup_lat,
      pickup_lng,
      dropoff_place_id,
      dropoff_address,
      dropoff_lat,
      dropoff_lng,
      stops_raw,
      scheduled_at,
      scheduled_end_at,
      flight_number,
      vehicle_category_id,
      vehicle_model_id,
      preferences,
      addons,
      distance_miles,
      duration_min,
      route_input
    )
    VALUES (
      v_booking_id,
      (v_leg->>'leg_number')::int,
      coalesce((v_leg->>'leg_kind')::leg_kind, 'main'::leg_kind),
      coalesce((v_leg->>'status')::leg_status, 'PENDING'::leg_status),
      
      v_leg->>'pickup_place_id',
      v_leg->>'pickup_address',
      nullif(v_leg->>'pickup_lat','')::numeric,
      nullif(v_leg->>'pickup_lng','')::numeric,
      
      v_leg->>'dropoff_place_id',
      v_leg->>'dropoff_address',
      nullif(v_leg->>'dropoff_lat','')::numeric,
      nullif(v_leg->>'dropoff_lng','')::numeric,
      
      coalesce(v_leg->'stops_raw','[]'::jsonb),
      (v_leg->>'scheduled_at')::timestamptz,
      nullif(v_leg->>'scheduled_end_at','')::timestamptz,
      v_leg->>'flight_number',
      
      v_leg->>'vehicle_category_id',
      v_leg->>'vehicle_model_id',
      
      v_leg->'preferences',
      v_leg->'addons',
      
      nullif(v_leg->>'distance_miles','')::numeric,
      nullif(v_leg->>'duration_min','')::int,
      v_leg->'route_input'
    );
  END LOOP;

  -- =====================================================
  -- STEP 3: Insert client_booking_quotes (MANDATORY)
  -- If this fails, entire transaction rolls back
  -- =====================================================
  INSERT INTO public.client_booking_quotes (
    booking_id,
    organization_id,
    version,
    subtotal_pence,
    discount_pence,
    vat_rate,
    vat_pence,
    total_pence,
    currency,
    line_items,
    pricing_version_id,
    calc_source,
    calc_version,
    quote_valid_until,
    is_locked,
    calculated_at
  )
  VALUES (
    v_booking_id,
    (p_quote->>'organization_id')::uuid,
    coalesce((p_quote->>'version')::int, 1),
    (p_quote->>'subtotal_pence')::int,
    coalesce((p_quote->>'discount_pence')::int, 0),
    (p_quote->>'vat_rate')::numeric,
    (p_quote->>'vat_pence')::int,
    (p_quote->>'total_pence')::int,
    coalesce(p_quote->>'currency', 'GBP'),
    p_quote->'line_items',
    nullif(p_quote->>'pricing_version_id', '')::uuid,
    coalesce(p_quote->>'calc_source', 'pricing_engine_v2'),
    coalesce(p_quote->>'calc_version', '2.0.0'),
    (p_quote->>'quote_valid_until')::timestamptz,
    coalesce((p_quote->>'is_locked')::boolean, false),
    now()
  )
  RETURNING id INTO v_quote_id;

  -- =====================================================
  -- STEP 4: Return both IDs for reference
  -- =====================================================
  RETURN jsonb_build_object(
    'booking_id', v_booking_id,
    'quote_id', v_quote_id,
    'success', true
  );

EXCEPTION
  WHEN OTHERS THEN
    -- Rollback automatic prin transaction
    RAISE EXCEPTION 'Booking creation failed: %', SQLERRM;
END;
$$;

-- ============================================================================
-- COMMENTS & DOCUMENTATION
-- ============================================================================

COMMENT ON FUNCTION create_booking_with_quote_atomic IS 
'Atomically creates booking + legs + mandatory quote. 
If quote creation fails, entire transaction rolls back.
This enforces quote as mandatory source of truth for client pricing.
Does NOT modify existing create_booking_with_legs RPC.';

-- ============================================================================
-- VALIDATION NOTES
-- ============================================================================

-- REQUIRED fields in p_quote JSONB:
-- - organization_id (uuid)
-- - version (int, defaults to 1)
-- - subtotal_pence (int) = final_vehicle_charge_pence + services_subtotal_pence
-- - discount_pence (int) = vehicle discounts only in current phase
-- - vat_rate (numeric) = from organization_settings
-- - vat_pence (int) = subtotal_pence * vat_rate
-- - total_pence (int) = subtotal_pence + vat_pence
-- - currency (text, defaults to 'GBP')
-- - line_items (jsonb) = complete breakdown with vehicle_pricing + services_pricing
-- - pricing_version_id (uuid, nullable) = from Backend Pricing API
-- - calc_source (text, defaults to 'pricing_engine_v2')
-- - calc_version (text, defaults to '2.0.0')
-- - quote_valid_until (timestamptz) = calculated from org settings or 30 min default
-- - is_locked (boolean, defaults to false)

-- IMPORTANT: subtotal_pence uses FINAL vehicle charge after rounding, not intermediate subtotal
-- This ensures payment truth matches actual taxed amount

-- ============================================================================
