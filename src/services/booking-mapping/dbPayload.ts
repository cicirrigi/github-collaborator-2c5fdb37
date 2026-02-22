import { BookingStatus, LegKind, LegStatus } from './dbEnums';
import type { TripConfiguration } from './types';

export type BookingType = 'oneway' | 'return' | 'hourly' | 'daily' | 'fleet' | 'bespoke';

const ROUTE_SOURCE = 'google_maps' as const;

type LatLngTuple = [number, number]; // [lat, lng] - CONSISTENT STANDARD

function getLatLng(coords?: LatLngTuple | null) {
  if (!coords || coords.length !== 2) return { lat: null, lng: null };

  const [lat, lng] = coords;

  // Coordinate validation guards
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    console.warn('Invalid coordinates detected:', { lat, lng });
    return { lat: null, lng: null };
  }

  return { lat, lng };
}

function toIso(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

/**
 * ✅ Builds p_booking payload EXACTLY matching DB function create_booking_with_legs()
 * bookings table columns:
 * customer_id, organization_id, booking_type, fleet_mode, status, currency, source,
 * start_at, end_at, hours_requested, days_requested, passenger_count, bag_count,
 * custom_requirements, billing_entity_id, trip_configuration_raw
 */
export function buildBookingPayload(params: {
  customerId: string;
  organizationId?: string; // Optional for backward compatibility
  bookingType: BookingType;
  tripConfiguration: TripConfiguration;
  currency?: string;
}) {
  const { customerId, organizationId, bookingType, tripConfiguration, currency } = params;

  // Fleet mode mapping for proper DB storage
  const fleetMode = tripConfiguration.fleetSelection?.fleetMode; // 'standard' | 'hourly' | 'daily'
  const isFleet = bookingType === 'fleet' && !!tripConfiguration.fleetSelection;

  return {
    customer_id: customerId,
    organization_id: organizationId || null,

    booking_type: bookingType,
    fleet_mode: isFleet
      ? fleetMode === 'hourly'
        ? 'hour'
        : fleetMode === 'daily'
          ? 'day'
          : null
      : null,

    status: BookingStatus.NEW,
    currency: (currency ?? 'GBP').toUpperCase(),
    source: 'web',

    start_at: toIso(tripConfiguration.pickupDateTime),
    end_at: toIso(tripConfiguration.returnDateTime) ?? null, // optional; for return/daily you can set if you want

    hours_requested: isFleet
      ? fleetMode === 'hourly'
        ? (tripConfiguration.fleetSelection?.fleetHours ?? null)
        : null
      : (tripConfiguration.hoursRequested ?? null),
    days_requested: isFleet
      ? fleetMode === 'daily'
        ? (tripConfiguration.fleetSelection?.fleetDays ?? null)
        : null
      : (tripConfiguration.daysRequested ?? null),

    passenger_count: tripConfiguration.passengers ?? null,
    bag_count: tripConfiguration.luggage ?? null,

    custom_requirements: tripConfiguration.customRequirements ?? null,
    billing_entity_id: null,

    trip_configuration_raw: tripConfiguration, // NOT NULL
  };
}

/**
 * ✅ Builds p_legs payload EXACTLY matching DB function create_booking_with_legs()
 *
 * booking_legs columns used by function:
 * leg_number, leg_kind, status,
 * pickup_place_id, pickup_address, pickup_lat, pickup_lng,
 * dropoff_place_id, dropoff_address, dropoff_lat, dropoff_lng,
 * stops_raw, scheduled_at, scheduled_end_at, flight_number,
 * vehicle_category_id, vehicle_model_id, preferences, addons,
 * distance_miles, duration_min, route_input
 *
 * IMPORTANT: function sets booking_id itself, so we DO NOT include booking_id here.
 */
export function buildLegsPayload(params: {
  bookingType: BookingType;
  tripConfiguration: TripConfiguration;
  pricingState?: {
    routeData: {
      distance: number | null;
      duration: number | null;
      isCalculated: boolean;
    };
  };
}) {
  const { bookingType, tripConfiguration, pricingState } = params;

  // minimal hard validation
  if (!tripConfiguration.pickup?.address) throw new Error('pickup.address missing');
  if (!tripConfiguration.pickupDateTime) throw new Error('pickupDateTime missing');

  // Safe vehicle category validation for fleet vs single vehicle vs bespoke
  const vehicleCategoryCode =
    bookingType === 'fleet'
      ? tripConfiguration.fleetSelection?.vehicles?.[0]?.category?.id
      : bookingType === 'bespoke'
        ? 'executive' // Default category for bespoke bookings
        : tripConfiguration.selectedVehicle?.category?.id;

  if (!vehicleCategoryCode) {
    throw new Error(
      'vehicleCategoryCode missing (selectedVehicle.category.id or fleetSelection.vehicles[0].category.id)'
    );
  }

  const scheduledAt = toIso(tripConfiguration.pickupDateTime);
  if (!scheduledAt) throw new Error('pickupDateTime invalid');

  // 🧠 Design decision (matches your DB design):
  // For ONE-WAY with stops, store stops in stops_raw of leg #1 (single leg).
  // If you want "one leg per stop", we can do that too, but your schema already supports stops_raw.
  const stopsRaw = (tripConfiguration.additionalStops ?? []).map(s => {
    const { lat, lng } = getLatLng(s?.coordinates as LatLngTuple);
    return {
      place_id: s?.placeId ?? null,
      address: s?.address ?? null,
      lat,
      lng,
    };
  });

  const baseLeg = {
    leg_number: 1,
    leg_kind: LegKind.MAIN,
    status: LegStatus.PENDING,

    pickup_place_id: tripConfiguration.pickup?.placeId ?? null,
    pickup_address: tripConfiguration.pickup.address,
    ...(() => {
      const { lat, lng } = getLatLng(tripConfiguration.pickup?.coordinates as LatLngTuple);
      return { pickup_lat: lat, pickup_lng: lng };
    })(),

    dropoff_place_id: tripConfiguration.dropoff?.placeId ?? null,
    dropoff_address: tripConfiguration.dropoff?.address ?? null,
    ...(() => {
      const { lat, lng } = getLatLng(tripConfiguration.dropoff?.coordinates as LatLngTuple);
      return { dropoff_lat: lat, dropoff_lng: lng };
    })(),

    stops_raw: stopsRaw, // jsonb, function coalesce -> ok either way

    scheduled_at: scheduledAt,
    scheduled_end_at: null,

    flight_number: tripConfiguration.flightNumberPickup ?? null,

    vehicle_category_id: vehicleCategoryCode,
    vehicle_model_id:
      bookingType === 'fleet'
        ? (tripConfiguration.fleetSelection?.vehicles?.[0]?.model?.id ?? null)
        : (tripConfiguration.selectedVehicle?.model?.id ?? null),

    preferences: null, // TODO: add preferences to TripConfiguration if needed
    addons: null, // TODO: add addons to TripConfiguration if needed

    distance_miles: pricingState?.routeData?.distance ?? null,
    duration_min:
      pricingState?.routeData?.duration != null
        ? Math.round(pricingState.routeData.duration)
        : null,

    route_input: pricingState?.routeData?.isCalculated
      ? {
          calculated: true,
          distance_miles: pricingState.routeData.distance,
          duration_minutes:
            pricingState.routeData.duration != null
              ? Math.round(pricingState.routeData.duration)
              : null,
          source: ROUTE_SOURCE,
        }
      : null,
  };

  // Return booking: you can choose 1 leg (outbound only) OR 2 legs.
  // Your DB supports multiple legs via leg_number, so we'll do 2 legs for return (clean).
  if (bookingType === 'return') {
    if (!tripConfiguration.returnDateTime)
      throw new Error('returnDateTime missing for return booking');

    const returnAt = toIso(tripConfiguration.returnDateTime);
    if (!returnAt) throw new Error('returnDateTime invalid');

    const outbound = { ...baseLeg, leg_number: 1, scheduled_at: scheduledAt };
    const inbound = {
      ...baseLeg,
      leg_number: 2,
      leg_kind: LegKind.RETURN,
      scheduled_at: returnAt,
      // Handle return leg based on isDifferentReturnLocation
      ...(tripConfiguration.isDifferentReturnLocation &&
      tripConfiguration.returnPickup &&
      tripConfiguration.returnDropoff
        ? {
            // Use custom return locations when different return location is selected
            pickup_place_id: tripConfiguration.returnPickup?.placeId ?? null,
            pickup_address: tripConfiguration.returnPickup?.address ?? '',
            ...(() => {
              const { lat, lng } = getLatLng(
                tripConfiguration.returnPickup?.coordinates as LatLngTuple
              );
              return { pickup_lat: lat, pickup_lng: lng };
            })(),

            dropoff_place_id: tripConfiguration.returnDropoff?.placeId ?? null,
            dropoff_address: tripConfiguration.returnDropoff?.address ?? '',
            ...(() => {
              const { lat, lng } = getLatLng(
                tripConfiguration.returnDropoff?.coordinates as LatLngTuple
              );
              return { dropoff_lat: lat, dropoff_lng: lng };
            })(),

            stops_raw: (tripConfiguration.returnAdditionalStops ?? []).map(s => {
              const { lat, lng } = getLatLng(s?.coordinates as LatLngTuple);
              return {
                place_id: s?.placeId ?? null,
                address: s?.address ?? null,
                lat,
                lng,
              };
            }),
          }
        : {
            // Use automatic reverse (dropoff → pickup) for normal return
            pickup_place_id: tripConfiguration.dropoff?.placeId ?? null,
            pickup_address: tripConfiguration.dropoff?.address ?? '',
            ...(() => {
              const { lat, lng } = getLatLng(tripConfiguration.dropoff?.coordinates as LatLngTuple);
              return { pickup_lat: lat, pickup_lng: lng };
            })(),

            dropoff_place_id: tripConfiguration.pickup?.placeId ?? null,
            dropoff_address: tripConfiguration.pickup?.address ?? '',
            ...(() => {
              const { lat, lng } = getLatLng(tripConfiguration.pickup?.coordinates as LatLngTuple);
              return { dropoff_lat: lat, dropoff_lng: lng };
            })(),

            stops_raw: [],
          }),

      flight_number: tripConfiguration.flightNumberReturn ?? null,
    };

    return [outbound, inbound];
  }

  // For other types (hourly/daily/fleet/bespoke), you might model legs differently later.
  // For now: 1 leg with pickup/dropoff (or pickup only) keeps DB happy.
  if (bookingType !== 'oneway' && bookingType !== 'return') {
    return [
      {
        ...baseLeg,
        dropoff_address: tripConfiguration.dropoff?.address ?? null,
        dropoff_place_id: tripConfiguration.dropoff?.placeId ?? null,
      },
    ];
  }

  return [baseLeg];
}
