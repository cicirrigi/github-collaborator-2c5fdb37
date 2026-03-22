-- ✅ FIX: Add billing_snapshot to create_booking_with_legs RPC
-- ISSUE: billing_entity_id exists, but billing_snapshot is MISSING

CREATE OR REPLACE FUNCTION create_booking_with_legs(
  p_booking JSONB,
  p_legs JSONB[]
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
declare
  v_booking_id uuid;
begin
  insert into public.bookings (
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
    billing_snapshot,           -- ✅ ADDED THIS LINE
    trip_configuration_raw
  )
  values (
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
    p_booking->'billing_snapshot',  -- ✅ ADDED THIS LINE (note: ->' not ->>' for JSONB)
    p_booking->'trip_configuration_raw'
  )
  returning id into v_booking_id;

  insert into public.booking_legs (
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
  select
    v_booking_id,
    (leg->>'leg_number')::int,
    coalesce((leg->>'leg_kind')::leg_kind, 'main'::leg_kind),
    coalesce((leg->>'status')::leg_status, 'PENDING'::leg_status),

    leg->>'pickup_place_id',
    (leg->>'pickup_address'),
    nullif(leg->>'pickup_lat','')::numeric,
    nullif(leg->>'pickup_lng','')::numeric,

    leg->>'dropoff_place_id',
    (leg->>'dropoff_address'),
    nullif(leg->>'dropoff_lat','')::numeric,
    nullif(leg->>'dropoff_lng','')::numeric,

    coalesce(leg->'stops_raw','[]'::jsonb),
    (leg->>'scheduled_at')::timestamptz,
    nullif(leg->>'scheduled_end_at','')::timestamptz,
    leg->>'flight_number',

    (leg->>'vehicle_category_id'),
    leg->>'vehicle_model_id',

    leg->'preferences',
    leg->'addons',

    nullif(leg->>'distance_miles','')::numeric,
    nullif(leg->>'duration_min','')::int,
    leg->'route_input'
  from jsonb_array_elements(p_legs) as leg;

  return v_booking_id;
end;
$$;

-- IMPORTANT NOTES:
-- 1. Use p_booking->'billing_snapshot' (JSONB operator ->) NOT ->>> (text operator)
-- 2. This allows NULL values if billing_snapshot is not provided
-- 3. Maintains backward compatibility with existing bookings without billing
