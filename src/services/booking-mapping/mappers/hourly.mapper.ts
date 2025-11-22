/**
 * ⏰ HOURLY Booking Mapper
 */

import { createBaseBookingRecord } from '../base-mapping';
import type { BookingRecord, TripConfiguration } from '../types';

/**
 * Maps TripConfiguration to BookingRecord for HOURLY bookings
 * HOURLY bookings need hours field from hoursRequested
 */
export const mapHourlyBooking = (tripConfig: TripConfiguration): BookingRecord => {
  const baseRecord = createBaseBookingRecord(tripConfig, 'hourly');

  return {
    ...baseRecord,
    hours: tripConfig.hoursRequested || 1, // Default to 1 hour minimum
  };
};
