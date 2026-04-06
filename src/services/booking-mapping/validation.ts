/**
 * ✅ Booking Validation & Debug - Validation and debug utilities
 *
 * Non-deprecated entrypoint (used by `booking.service.ts`)
 */

import type { BookingRecord, BookingType, TripConfiguration } from './types';

/**
 * Validates booking record before database insert
 */
export const validateBookingRecord = (record: BookingRecord): string[] => {
  const errors: string[] = [];

  // Required field validation - MATCHES ACTUAL `bookings` TABLE (based on project expectations)
  if (!record.customer_id) {
    errors.push('customer_id is required');
  }

  if (!record.booking_type) {
    errors.push('booking_type is required');
  }

  if (!record.start_at) {
    errors.push('start_at timestamp is required');
  }

  // Trip type validation
  const validTripTypes = ['oneway', 'return', 'hourly', 'daily', 'fleet', 'bespoke'];
  if (!validTripTypes.includes(record.trip_type)) {
    errors.push(`trip_type must be one of: ${validTripTypes.join(', ')}`);
  }

  // Passenger validation (optional field)
  if (record.passenger_count && (record.passenger_count < 1 || record.passenger_count > 8)) {
    errors.push('passenger_count must be between 1 and 8');
  }

  // NOTE: operator_id is in booking_metadata table, not main bookings table
  // NOTE: return_date/return_time are in booking_metadata table, not main bookings table

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
  const errors = validateBookingRecord(record);
  // Intentionally no console spam here; keep utility side-effect free.
  void tripConfig;
  void bookingType;
  void errors;
};
