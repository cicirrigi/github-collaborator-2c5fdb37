/**
 * 🚗 ONE-WAY Booking Mapper
 */

import { createBaseBookingRecord } from '../base-mapping';
import type { BookingRecord, TripConfiguration } from '../types';

/**
 * Maps TripConfiguration to BookingRecord for ONE-WAY bookings
 * ONE-WAY bookings only need the base fields - no additional logic required
 */
export const mapOnewayBooking = (tripConfig: TripConfiguration): BookingRecord => {
  // ONE-WAY bookings use just the base record
  return createBaseBookingRecord(tripConfig, 'oneway');
};
