/**
 * Booking Service - Production Version
 */

import { createClient } from '@supabase/supabase-js';
import {
  mapAdditionalStops,
  mapHourlyBookingToLegs,
  mapOnewayBookingToLegs,
  mapReturnAdditionalStops,
  mapReturnBookingToLegs,
  mapTripConfigToBooking,
  validateBookingRecord,
} from './booking-mapping';
import type { BookingRecord, BookingType, TripConfiguration } from './booking-mapping/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Result interfaces
export interface BookingSuccess {
  success: true;
  booking: BookingRecord & { id: string };
  message: string;
}

export interface BookingError {
  success: false;
  error: string;
  details?: string[];
  code?: string;
}

export type BookingResult = BookingSuccess | BookingError;

// Normalize timestamp
const normalizeTimestamp = (iso: string) =>
  iso
    .replace('T', ' ')
    .replace(/\.\d{3}Z$/, '')
    .replace('Z', '');

/**
 * Create a booking
 */
export const saveBooking = async (
  tripConfig: TripConfiguration,
  bookingType: BookingType
): Promise<BookingResult> => {
  try {
    // 1. Transform
    const record = mapTripConfigToBooking(tripConfig, bookingType);

    // 2. Validate
    const validationErrors = validateBookingRecord(record);
    if (validationErrors.length > 0) {
      return { success: false, error: 'Validation failed', details: validationErrors };
    }

    // 3. Normalize timestamp
    const payload = {
      ...record,
      start_at: normalizeTimestamp(record.start_at),
      return_date: record.return_date || null,
      return_time: record.return_time || null,
    };

    // 4. Insert main booking
    const { data, error } = await supabase.from('bookings').insert(payload).select().single();

    if (error) {
      return { success: false, error: error.message, code: error.code };
    }

    // 5. Insert additional stops (optional) - non-blocking
    if (tripConfig.additionalStops?.length) {
      const stops = mapAdditionalStops(data.id, tripConfig);
      const { error: stopsError } = await supabase.from('booking_additional_stops').insert(stops);
      if (stopsError) {
        console.warn('Failed to insert additional stops:', stopsError.message);
      }
    }

    // 5.1. Insert booking legs pentru ONE-WAY trips
    if (bookingType === 'oneway') {
      const legs = mapOnewayBookingToLegs(data.id, tripConfig);
      const { error: legsError } = await supabase.from('booking_legs').insert(legs);
      if (legsError) {
        console.warn('Failed to insert ONE-WAY booking legs:', legsError.message);
      }
    }

    // 5.2. Insert booking legs pentru RETURN trips
    if (bookingType === 'return') {
      console.log('🚗 DEBUG: Creating booking legs for RETURN trip...');
      const legs = mapReturnBookingToLegs(data.id, tripConfig);
      console.log('🚗 DEBUG: Generated legs:', legs);

      const { error: legsError } = await supabase.from('booking_legs').insert(legs);
      if (legsError) {
        console.error('❌ ERROR inserting booking legs:', legsError);
      } else {
        console.log('✅ Booking legs inserted successfully');
      }

      // 6.1. Insert return additional stops pentru RETURN trips
      if (tripConfig.returnAdditionalStops?.length) {
        console.log('🚏 DEBUG: Creating return additional stops...');
        const returnStops = mapReturnAdditionalStops(data.id, tripConfig);
        console.log('🚏 DEBUG: Generated return stops:', returnStops);

        const { error: returnStopsError } = await supabase
          .from('booking_additional_stops')
          .insert(returnStops);
        if (returnStopsError) {
          console.error('❌ ERROR inserting return additional stops:', returnStopsError);
        } else {
          console.log('✅ Return additional stops inserted successfully');
        }
      }
    }

    // 5.3. Insert booking legs pentru HOURLY trips
    if (bookingType === 'hourly') {
      const legs = mapHourlyBookingToLegs(data.id, tripConfig);
      const { error: legsError } = await supabase.from('booking_legs').insert(legs);
      if (legsError) {
        console.warn('Failed to insert HOURLY booking legs:', legsError.message);
      }
    }

    // 7. Return success
    return {
      success: true,
      booking: data,
      message: `${bookingType} booking created`,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Unexpected error occurred while saving booking',
      details: [error instanceof Error ? error.message : 'Unknown error'],
      code: 'UNEXPECTED_ERROR',
    };
  }
};

/**
 * Fetch booking by ID
 */
export const getBooking = async (id: string) => {
  const { data, error } = await supabase.from('bookings').select('*').eq('id', id).single();

  if (error) return null;
  return data;
};

/**
 * List bookings (optional)
 */
export const listBookings = async () => {
  const { data } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  return data || [];
};
