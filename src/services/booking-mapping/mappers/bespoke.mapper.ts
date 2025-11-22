/**
 * ✨ BESPOKE Booking Mapper
 */

import { createBaseBookingRecord } from '../base-mapping';
import type { BookingRecord, TripConfiguration } from '../types';

/**
 * Maps TripConfiguration to BookingRecord for BESPOKE bookings
 * BESPOKE bookings use the base record with custom requirements in notes
 */
export const mapBespokeBooking = (tripConfig: TripConfiguration): BookingRecord => {
  // BESPOKE bookings use just the base record
  // Custom requirements are already mapped in notes field
  return createBaseBookingRecord(tripConfig, 'bespoke');
};
