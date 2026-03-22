-- ============================================================================
-- TEST SCRIPT: create_booking_with_quote_atomic RPC
-- Purpose: Validate atomic behavior before integrating into booking flow
-- ============================================================================

-- PREREQUISITE: Run migration first
-- \i sql/migrations/20260318_create_booking_with_quote_atomic.sql

-- ============================================================================
-- TEST 1: Valid payload - should create booking + legs + quote
-- ============================================================================

DO $$
DECLARE
  v_result jsonb;
  v_booking_id uuid;
  v_quote_id uuid;
  v_booking_exists boolean;
  v_quote_exists boolean;
  v_legs_count int;
BEGIN
  RAISE NOTICE '============================================================';
  RAISE NOTICE 'TEST 1: Valid payload - should create all entities';
  RAISE NOTICE '============================================================';

  -- Call RPC with valid payload
  SELECT create_booking_with_quote_atomic(
    -- p_booking
    jsonb_build_object(
      'customer_id', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',  -- Replace with real customer_id
      'organization_id', '9a5caade-4791-4860-93b5-12b1c4fa9830',
      'booking_type', 'oneway',
      'status', 'NEW',
      'currency', 'GBP',
      'source', 'web',
      'start_at', now() + interval '2 days',
      'passenger_count', 2,
      'bag_count', 2
    ),
    -- p_legs
    ARRAY[
      jsonb_build_object(
        'leg_number', 1,
        'leg_kind', 'main',
        'status', 'PENDING',
        'pickup_address', 'Heathrow Airport, London',
        'pickup_lat', 51.4700,
        'pickup_lng', -0.4543,
        'dropoff_address', 'Central London Hotel',
        'dropoff_lat', 51.5074,
        'dropoff_lng', -0.1278,
        'scheduled_at', now() + interval '2 days',
        'vehicle_category_id', 'executive',
        'distance_miles', 20.5,
        'duration_min', 45
      )
    ],
    -- p_quote
    jsonb_build_object(
      'organization_id', '9a5caade-4791-4860-93b5-12b1c4fa9830',
      'version', 1,
      'subtotal_pence', 12500,  -- £125 (final vehicle charge + services)
      'discount_pence', 500,     -- £5 discount
      'vat_rate', 0.20,
      'vat_pence', 2500,         -- £25 VAT on £125
      'total_pence', 15000,      -- £150 total
      'currency', 'GBP',
      'line_items', jsonb_build_object(
        'meta', jsonb_build_object(
          'calc_source', 'pricing_engine_v2',
          'calc_version', '2.0.0',
          'calculated_at', now()
        ),
        'vehicle_pricing', jsonb_build_object(
          'base_fare', 50.00,
          'distance_fee', 45.00,
          'time_fee', 20.00,
          'subtotal_before_rounding', 115.00,
          'rounding_adjustment', 0.00,
          'final_vehicle_charge', 115.00,
          'final_vehicle_charge_pence', 11500
        ),
        'services_pricing', jsonb_build_object(
          'items', jsonb_build_array(),
          'subtotal_pence', 1000
        ),
        'summary', jsonb_build_object(
          'vehicle_final_pence', 11500,
          'services_subtotal_pence', 1000,
          'total_subtotal_pence', 12500,
          'vat_pence', 2500,
          'total_pence', 15000
        )
      ),
      'pricing_version_id', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',  -- Mock pricing version
      'calc_source', 'pricing_engine_v2',
      'calc_version', '2.0.0',
      'quote_valid_until', now() + interval '30 minutes',
      'is_locked', false
    )
  ) INTO v_result;

  -- Extract IDs
  v_booking_id := (v_result->>'booking_id')::uuid;
  v_quote_id := (v_result->>'quote_id')::uuid;

  RAISE NOTICE 'Result: %', v_result;
  RAISE NOTICE 'Booking ID: %', v_booking_id;
  RAISE NOTICE 'Quote ID: %', v_quote_id;

  -- Verify booking exists
  SELECT EXISTS(SELECT 1 FROM bookings WHERE id = v_booking_id) INTO v_booking_exists;
  RAISE NOTICE 'Booking exists: %', v_booking_exists;

  -- Verify quote exists and is linked
  SELECT EXISTS(
    SELECT 1 FROM client_booking_quotes 
    WHERE id = v_quote_id 
      AND booking_id = v_booking_id
      AND total_pence = 15000
  ) INTO v_quote_exists;
  RAISE NOTICE 'Quote exists and linked: %', v_quote_exists;

  -- Verify legs exist
  SELECT COUNT(*) FROM booking_legs WHERE booking_id = v_booking_id INTO v_legs_count;
  RAISE NOTICE 'Legs count: %', v_legs_count;

  -- Assertions
  IF NOT v_booking_exists THEN
    RAISE EXCEPTION 'TEST 1 FAILED: Booking not created';
  END IF;

  IF NOT v_quote_exists THEN
    RAISE EXCEPTION 'TEST 1 FAILED: Quote not created or not linked';
  END IF;

  IF v_legs_count != 1 THEN
    RAISE EXCEPTION 'TEST 1 FAILED: Expected 1 leg, got %', v_legs_count;
  END IF;

  RAISE NOTICE '✅ TEST 1 PASSED: All entities created atomically';
  
  -- Cleanup
  DELETE FROM booking_legs WHERE booking_id = v_booking_id;
  DELETE FROM client_booking_quotes WHERE id = v_quote_id;
  DELETE FROM bookings WHERE id = v_booking_id;
  
  RAISE NOTICE 'Cleanup complete';

END $$;

-- ============================================================================
-- TEST 2: Invalid quote (missing required field) - should rollback everything
-- ============================================================================

DO $$
DECLARE
  v_result jsonb;
  v_error_caught boolean := false;
  v_orphan_bookings int;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '============================================================';
  RAISE NOTICE 'TEST 2: Invalid quote - should rollback entire transaction';
  RAISE NOTICE '============================================================';

  -- Count bookings before
  SELECT COUNT(*) FROM bookings INTO v_orphan_bookings;
  RAISE NOTICE 'Bookings before: %', v_orphan_bookings;

  BEGIN
    -- Call RPC with invalid quote (missing total_pence)
    SELECT create_booking_with_quote_atomic(
      -- p_booking (valid)
      jsonb_build_object(
        'customer_id', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        'organization_id', '9a5caade-4791-4860-93b5-12b1c4fa9830',
        'booking_type', 'oneway',
        'status', 'NEW',
        'currency', 'GBP',
        'start_at', now() + interval '2 days'
      ),
      -- p_legs (valid)
      ARRAY[
        jsonb_build_object(
          'leg_number', 1,
          'pickup_address', 'Test',
          'dropoff_address', 'Test',
          'scheduled_at', now() + interval '2 days'
        )
      ],
      -- p_quote (INVALID - missing total_pence)
      jsonb_build_object(
        'organization_id', '9a5caade-4791-4860-93b5-12b1c4fa9830',
        'subtotal_pence', 10000,
        'vat_rate', 0.20
        -- Missing total_pence intentionally!
      )
    ) INTO v_result;

  EXCEPTION
    WHEN OTHERS THEN
      v_error_caught := true;
      RAISE NOTICE 'Expected error caught: %', SQLERRM;
  END;

  -- Verify no orphan bookings created
  SELECT COUNT(*) FROM bookings 
  WHERE created_at > now() - interval '1 minute'
  INTO v_orphan_bookings;

  RAISE NOTICE 'Bookings created in last minute: %', v_orphan_bookings;

  -- Assertions
  IF NOT v_error_caught THEN
    RAISE EXCEPTION 'TEST 2 FAILED: Error should have been raised for invalid quote';
  END IF;

  IF v_orphan_bookings > 0 THEN
    RAISE EXCEPTION 'TEST 2 FAILED: Found % orphan booking(s) - rollback did not work!', v_orphan_bookings;
  END IF;

  RAISE NOTICE '✅ TEST 2 PASSED: Transaction rolled back correctly';

END $$;

-- ============================================================================
-- TEST 3: Verify quote is mandatory (cannot call without p_quote)
-- ============================================================================

DO $$
DECLARE
  v_result jsonb;
  v_error_caught boolean := false;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '============================================================';
  RAISE NOTICE 'TEST 3: Quote is mandatory - cannot call without p_quote';
  RAISE NOTICE '============================================================';

  BEGIN
    -- This should fail at function signature level
    SELECT create_booking_with_quote_atomic(
      jsonb_build_object('customer_id', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
      ARRAY[jsonb_build_object('leg_number', 1)]
      -- Missing p_quote parameter!
    ) INTO v_result;

  EXCEPTION
    WHEN OTHERS THEN
      v_error_caught := true;
      RAISE NOTICE 'Expected error caught: %', SQLERRM;
  END;

  IF NOT v_error_caught THEN
    RAISE EXCEPTION 'TEST 3 FAILED: Should require p_quote parameter';
  END IF;

  RAISE NOTICE '✅ TEST 3 PASSED: p_quote is mandatory';

END $$;

-- ============================================================================
-- SUMMARY
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '============================================================';
  RAISE NOTICE 'ALL TESTS COMPLETED';
  RAISE NOTICE '============================================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Verify no orphan bookings: SELECT COUNT(*) FROM bookings WHERE id NOT IN (SELECT booking_id FROM client_booking_quotes);';
  RAISE NOTICE '2. Verify all quotes have bookings: SELECT COUNT(*) FROM client_booking_quotes WHERE booking_id NOT IN (SELECT id FROM bookings);';
  RAISE NOTICE '3. If all tests passed, proceed to Faza 2 - booking flow implementation';
  RAISE NOTICE '';
END $$;
