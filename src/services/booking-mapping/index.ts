/**
 * Booking mapping service entrypoint (non-deprecated).
 *
 * Used by `booking.test-service.ts` and dev tooling.
 */

export type {
  BookingRecord,
  BookingMetadataRecord,
  BookingLegRecord,
  BookingType,
  TripConfiguration,
} from './types';

export { validateBookingRecord, debugBookingMapping } from './validation';

export { mapOnewayBooking } from './mappers/oneway.mapper';
export { mapReturnBooking } from './mappers/return.mapper';

import type { BookingRecord, BookingType, TripConfiguration } from './types';
import { mapOnewayBooking } from './mappers/oneway.mapper';
import { mapReturnBooking } from './mappers/return.mapper';

/**
 * Main mapping function - delegates to appropriate booking type mapper.
 * Minimal implementation for the types currently used by dev tooling.
 */
export const mapTripConfigToBooking = (
  tripConfig: TripConfiguration,
  bookingType: BookingType,
  customerId: string
): BookingRecord => {
  switch (bookingType) {
    case 'oneway':
      return mapOnewayBooking(tripConfig, customerId);
    case 'return':
      return mapReturnBooking(tripConfig, customerId);
    default:
      throw new Error(`Booking type '${bookingType}' not yet implemented in non-deprecated mapper`);
  }
};
