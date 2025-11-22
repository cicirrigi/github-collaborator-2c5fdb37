/**
 * 📅 DAILY Booking Mapper
 */

import { createBaseBookingRecord } from '../base-mapping';
import type { BookingRecord, TripConfiguration } from '../types';

/**
 * Maps TripConfiguration to BookingRecord for DAILY bookings
 * DAILY bookings convert days to hours (days * 24)
 */
export const mapDailyBooking = (tripConfig: TripConfiguration): BookingRecord => {
  const baseRecord = createBaseBookingRecord(tripConfig, 'daily');

  return {
    ...baseRecord,
    hours: (tripConfig.daysRequested || 1) * 24, // Convert days to hours
  };
};
