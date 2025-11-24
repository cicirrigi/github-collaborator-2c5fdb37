/**
 * 🔄 Booking Mapping Service - Vantage Lane 2.0
 *
 * Converts TripConfiguration from Zustand store to Supabase booking record format.
 * Handles all booking types: oneway, return, hourly, daily, fleet, bespoke.
 */

import type { BookingType, TripConfiguration } from '@/hooks/useBookingState/booking.types';

// Database booking record interface (based on our DB schema analysis)
export interface BookingRecord {
  // Required fields
  operator_id: string;
  category: string;
  start_at: string; // timestamp

  // Basic booking info
  trip_type: BookingType;
  passenger_count: number;
  bag_count: number;

  // Optional fields
  vehicle_model?: string | null;
  flight_number?: string | null;
  notes?: string | null;

  // Return trip fields
  return_date?: string | null | undefined;
  return_time?: string | null | undefined;
  return_flight_number?: string | null | undefined;

  // Hourly booking fields
  hours?: number;

  // Fleet booking fields
  fleet_executive?: number | null;
  fleet_s_class?: number | null;
  fleet_v_class?: number | null;
  fleet_suv?: number | null;

  // System defaults
  currency: string;
  payment_method: string;
  status: string;
  booking_status: string;
  extra_stops: number;
}

export interface AdditionalStopRecord {
  booking_id: string;
  stop_order: number;
  address: string;
  latitude: number | null;
  longitude: number | null;
  place_id: string | null;
  stop_charge: number;
}

/**
 * Maps UI vehicle category ID to DB category string
 * Simple 1:1 mapping - no conversion needed
 */
const mapVehicleCategoryToDB = (categoryId?: string): string => {
  // Direct 1:1 mapping - UI categories match DB values exactly
  return categoryId || 'executive'; // Default fallback to executive
};

/**
 * Maps TripConfiguration to Supabase booking record
 */
export const mapTripConfigToBooking = (
  tripConfig: TripConfiguration,
  bookingType: BookingType
): BookingRecord => {
  // Get operator ID from environment
  const operatorId = process.env.NEXT_PUBLIC_CENTRAL_OPERATOR_ID;

  if (!operatorId) {
    throw new Error('NEXT_PUBLIC_CENTRAL_OPERATOR_ID not configured in environment');
  }

  // Base mapping - common to all booking types
  const baseRecord: BookingRecord = {
    // Required fields
    operator_id: operatorId,
    category: mapVehicleCategoryToDB(tripConfig.selectedVehicle?.category?.id),
    start_at: tripConfig.pickupDateTime?.toISOString() || '',

    // Basic info
    trip_type: bookingType,
    passenger_count: tripConfig.passengers || 1,
    bag_count: tripConfig.luggage || 0,

    // Optional fields
    vehicle_model: tripConfig.selectedVehicle?.model?.name || null,
    flight_number: tripConfig.flightNumberPickup || null,
    notes: tripConfig.customRequirements || null,

    // System defaults
    currency: 'GBP',
    payment_method: 'CARD',
    status: 'NEW',
    booking_status: 'draft',
    extra_stops: tripConfig.additionalStops?.length || 0,
  };

  // Booking type specific mappings
  switch (bookingType) {
    case 'return':
      // Ensure proper null handling for TypeScript strict mode
      const returnDate = tripConfig.returnDateTime
        ? tripConfig.returnDateTime.toISOString().split('T')[0]
        : null;
      const returnTime = tripConfig.returnDateTime
        ? tripConfig.returnDateTime.toTimeString().split(' ')[0]
        : null;

      return {
        ...baseRecord,
        return_date: returnDate,
        return_time: returnTime,
        return_flight_number: tripConfig.flightNumberReturn || null,
      };

    case 'hourly':
      return {
        ...baseRecord,
        hours: tripConfig.hoursRequested || 1,
      };

    case 'daily':
      return {
        ...baseRecord,
        hours: (tripConfig.daysRequested || 1) * 24, // Convert days to hours
      };

    case 'fleet':
      // Fleet bookings use separate columns for each vehicle type
      return {
        ...baseRecord,
        fleet_executive: getFleetVehicleCount(tripConfig, 'executive'),
        fleet_s_class: getFleetVehicleCount(tripConfig, 'luxury'), // S-Class from luxury category
        fleet_v_class: getFleetVehicleCount(tripConfig, 'mpv'), // V-Class from MPV category
        fleet_suv: getFleetVehicleCount(tripConfig, 'suv'),
      };

    case 'oneway':
    case 'bespoke':
    default:
      return baseRecord;
  }
};

/**
 * Helper to extract fleet vehicle counts by category
 */
const getFleetVehicleCount = (_tripConfig: TripConfiguration, _category: string): number | null => {
  // This will be implemented when we have fleet selection in store
  // For now return null (no fleet booking data in current store)
  return null;
};

/**
 * Validates booking record before database insert
 */
export const validateBookingRecord = (record: BookingRecord): string[] => {
  const errors: string[] = [];

  // Required field validation
  if (!record.operator_id) errors.push('operator_id is required');
  if (!record.category) errors.push('category is required');
  if (!record.start_at) errors.push('start_at is required');

  // Date validation
  if (record.start_at) {
    const startDate = new Date(record.start_at);
    if (isNaN(startDate.getTime())) {
      errors.push('start_at must be a valid timestamp');
    }
  }

  // Passenger validation
  if (record.passenger_count < 1 || record.passenger_count > 8) {
    errors.push('passenger_count must be between 1 and 8');
  }

  // Return trip validation
  if (record.trip_type === 'return') {
    if (!record.return_date) {
      errors.push('return_date is required for return trips');
    }
  }

  return errors;
};

/**
 * Debug helper to log mapping result
 */
export const debugBookingMapping = (
  tripConfig: TripConfiguration,
  bookingType: BookingType,
  record: BookingRecord
): void => {
  // Debug function - console statements available for development
  // console.group('🔄 Booking Mapping Debug');
  // console.log('Input TripConfiguration:', tripConfig);
  // console.log('Booking Type:', bookingType);
  // console.log('Output BookingRecord:', record);

  const errors = validateBookingRecord(record);
  if (errors.length > 0) {
    // console.error('❌ Validation errors:', errors);
  } else {
    // console.log('✅ Booking record is valid');
  }
  // console.groupEnd();
};

/**
 * Maps TripConfiguration additional stops to AdditionalStopRecord array
 */
export const mapAdditionalStops = (
  bookingId: string,
  tripConfig: TripConfiguration
): AdditionalStopRecord[] => {
  if (!tripConfig.additionalStops || tripConfig.additionalStops.length === 0) {
    return [];
  }

  return tripConfig.additionalStops.map((stop, index) => ({
    booking_id: bookingId,
    stop_order: index + 1, // 1-based ordering
    address: stop.address,
    latitude: stop.coordinates ? stop.coordinates[0] : null, // lat is first element
    longitude: stop.coordinates ? stop.coordinates[1] : null, // lng is second element
    place_id: stop.placeId || null,
    stop_charge: 15.0, // £15 per stop as per business rules
  }));
};
