/**
 * 🔄 Booking Mapping Service - Modular Architecture
 * Central export point for all booking mapping functionality
 */

// Export all types
export type {
  AdditionalStopRecord,
  BookingLegRecord,
  BookingRecord,
  BookingType,
  TripConfiguration,
} from './types';

// Export individual mappers
export { mapBespokeBooking } from './mappers/bespoke.mapper';
export { mapDailyBooking } from './mappers/daily.mapper';
export { mapFleetBooking } from './mappers/fleet.mapper';
export { mapHourlyBooking } from './mappers/hourly.mapper';
export { mapOnewayBooking } from './mappers/oneway.mapper';
export { mapReturnBooking } from './mappers/return.mapper';

// Export utilities
export { mapAdditionalStops, mapReturnAdditionalStops } from './additional-stops';
export {
  mapDailyBookingToLegs,
  mapHourlyBookingToLegs,
  mapOnewayBookingToLegs,
  mapReturnBookingToLegs,
} from './legs';
export { debugBookingMapping, validateBookingRecord } from './validation';

// Main mapping function - delegates to appropriate mapper
import { mapBespokeBooking } from './mappers/bespoke.mapper';
import { mapDailyBooking } from './mappers/daily.mapper';
import { mapFleetBooking } from './mappers/fleet.mapper';
import { mapHourlyBooking } from './mappers/hourly.mapper';
import { mapOnewayBooking } from './mappers/oneway.mapper';
import { mapReturnBooking } from './mappers/return.mapper';
import type { BookingRecord, BookingType, TripConfiguration } from './types';

/**
 * Main mapping function - routes to appropriate booking type mapper
 * IDENTICAL BEHAVIOR to original mapTripConfigToBooking function
 */
export const mapTripConfigToBooking = (
  tripConfig: TripConfiguration,
  bookingType: BookingType
): BookingRecord => {
  switch (bookingType) {
    case 'oneway':
      return mapOnewayBooking(tripConfig);

    case 'return':
      return mapReturnBooking(tripConfig);

    case 'hourly':
      return mapHourlyBooking(tripConfig);

    case 'daily':
      return mapDailyBooking(tripConfig);

    case 'fleet':
      return mapFleetBooking(tripConfig);

    case 'bespoke':
    default:
      return mapBespokeBooking(tripConfig);
  }
};
