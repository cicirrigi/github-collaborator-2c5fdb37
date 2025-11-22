/**
 * ✅ Booking Validation & Debug - Validation and debug utilities
 */

import type { BookingRecord, BookingType, TripConfiguration } from './types';

/**
 * Validates booking record before database insert
 */
export const validateBookingRecord = (record: BookingRecord): string[] => {
  const errors: string[] = [];

  // Required field validation
  if (!record.operator_id) {
    errors.push('operator_id is required');
  }

  if (!record.category) {
    errors.push('category is required');
  }

  if (!record.start_at) {
    errors.push('start_at timestamp is required');
  }

  // Trip type validation
  const validTripTypes = ['oneway', 'return', 'hourly', 'daily', 'fleet', 'bespoke'];
  if (!validTripTypes.includes(record.trip_type)) {
    errors.push(`trip_type must be one of: ${validTripTypes.join(', ')}`);
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
  console.group('🔄 Booking Mapping Debug');
  console.log('Input TripConfiguration:', tripConfig);
  console.log('Booking Type:', bookingType);
  console.log('Output BookingRecord:', record);

  const errors = validateBookingRecord(record);
  if (errors.length > 0) {
    console.error('❌ Validation errors:', errors);
  } else {
    console.log('✅ Booking record is valid');
  }
  console.groupEnd();
};
