/**
 * ↩️ RETURN Booking Mapper
 */

import { createBaseBookingRecord } from '../base-mapping';
import type { BookingRecord, TripConfiguration } from '../types';

/**
 * Maps TripConfiguration to BookingRecord for RETURN bookings
 * RETURN bookings cu return_date, return_time, return_flight_number
 *
 * NOTE: Această funcție creează doar parent booking record.
 * Pentru legs, folosește mapReturnBookingToLegs() din booking-legs.ts
 */
export const mapReturnBooking = (tripConfig: TripConfiguration): BookingRecord => {
  const baseRecord = createBaseBookingRecord(tripConfig, 'return');

  // DEBUG: Log ALL return fields
  console.log('🔄 DEBUG Return Mapper - returnDateTime:', tripConfig.returnDateTime);
  console.log('🔄 DEBUG Return Mapper - returnDate (legacy):', tripConfig.returnDate);
  console.log('🔄 DEBUG Return Mapper - typeof returnDateTime:', typeof tripConfig.returnDateTime);

  // Try both fields as fallback
  const sourceDateTime = tripConfig.returnDateTime || tripConfig.returnDate;
  console.log('🔄 DEBUG Return Mapper - sourceDateTime:', sourceDateTime);

  // Ensure proper null handling for TypeScript strict mode
  const returnDate = sourceDateTime ? sourceDateTime.toISOString().split('T')[0] : null;
  const returnTime = sourceDateTime ? sourceDateTime.toTimeString().split(' ')[0] : null;

  console.log('🔄 DEBUG Return Mapper - FINAL returnDate:', returnDate);
  console.log('🔄 DEBUG Return Mapper - FINAL returnTime:', returnTime);

  return {
    ...baseRecord,
    return_date: returnDate,
    return_time: returnTime,
    return_flight_number: tripConfig.flightNumberReturn || null,
  };
};
