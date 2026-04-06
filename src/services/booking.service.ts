/**
 * Booking Service - Production Version
 */

import { createClient } from '@supabase/supabase-js';
import {
  mapOnewayBooking,
  mapOnewayLegs,
  mapReturnBooking,
  mapReturnBookingMetadata,
  mapReturnLegs,
} from './booking-mapping/mappers';
import type {
  BookingMetadataRecord,
  BookingRecord,
  BookingType,
  TripConfiguration,
} from './booking-mapping/types';
import { validateBookingRecord } from './booking-mapping/validation';

// Create browser-safe Supabase client
const createSupabaseClient = () => {
  if (typeof window === 'undefined') {
    // Server-side: use basic client (should not be called)
    throw new Error('Booking service should only be used in browser context');
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    }
  );
};

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
 * Create a booking - UPDATED FOR NEW MAPPER STRUCTURE
 */
export const saveBooking = async (
  tripConfig: TripConfiguration,
  bookingType: BookingType,
  customerId: string = '1a560433-c426-41d8-812c-01c44cb992d7' // Cristian Manolache (test customer)
): Promise<BookingResult> => {
  try {
    console.log(`🎯 Creating ${bookingType} booking...`);

    // Initialize browser-only Supabase client
    const supabase = createSupabaseClient();

    let bookingRecord: BookingRecord;
    let metadataRecord: BookingMetadataRecord | null = null;

    // 1. Map based on booking type
    if (bookingType === 'oneway') {
      bookingRecord = mapOnewayBooking(tripConfig, customerId);
    } else if (bookingType === 'return') {
      bookingRecord = mapReturnBooking(tripConfig, customerId);
    } else {
      return {
        success: false,
        error: `Booking type '${bookingType}' not yet implemented`,
        details: ['Only oneway and return bookings are currently supported'],
      };
    }

    // 2. Validate booking record
    const validationErrors = validateBookingRecord(bookingRecord);
    if (validationErrors.length > 0) {
      console.error('❌ Validation failed:', validationErrors);
      return { success: false, error: 'Validation failed', details: validationErrors };
    }

    // 3. Normalize timestamps
    const payload = {
      ...bookingRecord,
      start_at: normalizeTimestamp(bookingRecord.start_at ?? ''),
    };

    console.log('📝 Booking payload:', payload);

    // 4. Insert main booking record
    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .insert(payload)
      .select()
      .single();

    if (bookingError) {
      console.error('❌ Booking insertion error:', bookingError);
      return { success: false, error: bookingError.message, code: bookingError.code };
    }

    console.log('✅ Main booking created:', bookingData.id);

    // 5. Insert booking metadata (for return bookings)
    if (bookingType === 'return') {
      metadataRecord = mapReturnBookingMetadata(bookingData.id, tripConfig);
      console.log('� Metadata payload:', metadataRecord);

      const { error: metadataError } = await supabase
        .from('booking_metadata')
        .insert(metadataRecord);

      if (metadataError) {
        console.error('❌ Metadata insertion error:', metadataError);
        // Non-blocking - booking still succeeds
      } else {
        console.log('✅ Booking metadata created');
      }
    }

    // 6. Insert booking legs
    let legs;
    if (bookingType === 'oneway') {
      legs = mapOnewayLegs(bookingData.id, tripConfig);
    } else if (bookingType === 'return') {
      legs = mapReturnLegs(bookingData.id, tripConfig);
    }

    if (legs && legs.length > 0) {
      console.log(`🛣️ Creating ${legs.length} legs:`, legs);

      const { error: legsError } = await supabase.from('booking_legs').insert(legs);

      if (legsError) {
        console.error('❌ Legs insertion error:', legsError);
        // Non-blocking - booking still succeeds
      } else {
        console.log('✅ Booking legs created');
      }
    }

    // 7. Return success
    console.log('🎉 Booking creation completed successfully!');
    return {
      success: true,
      booking: bookingData,
      message: `${bookingType.toUpperCase()} booking created successfully`,
    };
  } catch (error) {
    console.error('💥 Unexpected error:', error);
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
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from('bookings').select('*').eq('id', id).single();

  if (error) return null;
  return data;
};

/**
 * List bookings (optional)
 */
export const listBookings = async () => {
  const supabase = createSupabaseClient();
  const { data } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  return data || [];
};
