/**
 * 📅 DAILY Booking Mapper
 */

import { createBaseBookingRecord } from '../base-mapping';
import type { BookingRecord, TripConfiguration } from '../types';

/**
 * Maps TripConfiguration to BookingRecord for DAILY bookings
 * DAILY bookings use dedicated days field (not converted to hours)
 */
export const mapDailyBooking = (tripConfig: TripConfiguration): BookingRecord => {
  const baseRecord = createBaseBookingRecord(tripConfig, 'daily');

  return {
    ...baseRecord,
    days: tripConfig.daysRequested || 1, // Use dedicated days field
  };
};
