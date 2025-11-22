/**
 * ↩️ RETURN Booking Mapper
 */

import { createBaseBookingRecord } from '../base-mapping';
import type { BookingRecord, TripConfiguration } from '../types';

/**
 * Maps TripConfiguration to BookingRecord for RETURN bookings
 * RETURN bookings need return_date, return_time, return_flight_number
 */
export const mapReturnBooking = (tripConfig: TripConfiguration): BookingRecord => {
  const baseRecord = createBaseBookingRecord(tripConfig, 'return');

  // Ensure proper null handling for TypeScript strict mode
  const returnDate = tripConfig.returnDateTime
    ? tripConfig.returnDateTime.toISOString().split('T')[0]
    : null;
  const returnTime = tripConfig.returnDateTime
    ? tripConfig.returnDateTime.toTimeString().split(' ')[0]
    : null;

  return {
    ...baseRecord,
    return_date: returnDate,
    return_time: returnTime,
    return_flight_number: tripConfig.flightNumberReturn || null,
  };
};
