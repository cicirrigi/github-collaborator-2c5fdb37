/**
 * 🏗️ Base Booking Mapping - Common record creation logic
 *
 * Non-deprecated entrypoint (webpack/Next only treats `.ts` / `.tsx` as TS).
 * This exists to satisfy imports from `booking.service.ts` and the non-deprecated
 * mappers we add under `booking-mapping/`.
 */

import type { BookingMetadataRecord, BookingRecord, BookingType, TripConfiguration } from './types';

// Helper to safely convert datetime to ISO string
export function safeToISOString(dateValue: any): string {
  if (!dateValue) return new Date().toISOString();

  // If it's already a Date object
  if (dateValue instanceof Date) {
    return dateValue.toISOString();
  }

  // If it's a string, try to parse it
  if (typeof dateValue === 'string') {
    const parsed = new Date(dateValue);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  // Fallback to current time
  return new Date().toISOString();
}

/**
 * Creates the base booking record for `bookings` table
 * Used by all booking type mappers.
 */
export const createBaseBookingRecord = (
  tripConfig: TripConfiguration,
  bookingType: BookingType,
  customerId: string
): BookingRecord => {
  return {
    // Required fields
    customer_id: customerId,
    booking_type: bookingType,

    // Core booking fields
    start_at: safeToISOString(tripConfig.pickupDateTime),

    // Passenger & logistics
    passenger_count: tripConfig.passengers || 1,
    bag_count: tripConfig.luggage || 0,
    notes: tripConfig.customRequirements || null, // DB has notes

    // System fields - align with DB schema expectations
    status: 'NEW',
    payment_status: 'unpaid',
    booking_source: 'web',
    currency: 'GBP',

    // Flight number
    flight_number: tripConfig.flightNumberPickup || null,

    // Required jsonb field
    trip_configuration_raw: tripConfig,

    // Optional organization
    organization_id: null,
  };
};

/**
 * Creates booking metadata record for `booking_metadata` table.
 * Contains additional fields not in main bookings table.
 */
export const createBookingMetadataRecord = (
  bookingId: string,
  tripConfig: TripConfiguration,
  _bookingType: BookingType
): BookingMetadataRecord => {
  const operatorId = process.env.NEXT_PUBLIC_CENTRAL_OPERATOR_ID;

  return {
    booking_id: bookingId,

    // System fields
    operator_id: operatorId || null,
    payment_method: 'CARD',
    vehicle_model: tripConfig.selectedVehicle?.model?.name || null,
    extra_stops: tripConfig.additionalStops?.length || 0,

    // Booking type specific fields (set by specific mappers)
    hours: null,
    days: null,
    return_date: null,
    return_time: null,
    return_flight_number: null,
  };
};

/**
 * Builds notes field combining custom requirements and vehicle model.
 * Kept for compatibility with deprecated implementations.
 */
export const buildNotesField = (tripConfig: TripConfiguration): string | null => {
  const parts: string[] = [];

  if (tripConfig.customRequirements) {
    parts.push(tripConfig.customRequirements);
  }

  if (tripConfig.selectedVehicle?.model?.name) {
    parts.push(`Vehicle: ${tripConfig.selectedVehicle.model.name}`);
  }

  return parts.length > 0 ? parts.join(' | ') : null;
};
