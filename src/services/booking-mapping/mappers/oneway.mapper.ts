/**
 * 🚗 ONE-WAY Booking Mapper
 */

import { createBaseBookingRecord } from '../base-mapping';
import type { BookingRecord, TripConfiguration } from '../types';

/**
 * Maps TripConfiguration to BookingRecord for ONE-WAY bookings
 * Addresses are now stored in booking_legs table, not in notes
 */
export const mapOnewayBooking = (tripConfig: TripConfiguration): BookingRecord => {
  // ONE-WAY bookings use just the base record
  // Addresses are stored in booking_legs table via mapOnewayBookingToLegs()
  return createBaseBookingRecord(tripConfig, 'oneway');
};
