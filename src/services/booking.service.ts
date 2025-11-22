/**
 * 💾 Booking Service - Supabase Integration
 *
 * Handles booking creation and management with Supabase database.
 * Uses the booking-mapping.service for data transformation.
 */

import type { BookingType, TripConfiguration } from '@/hooks/useBookingState/booking.types';
import { createClient } from '@supabase/supabase-js';
import {
  debugBookingMapping,
  mapAdditionalStops,
  mapTripConfigToBooking,
  validateBookingRecord,
  type BookingRecord,
} from './booking-mapping';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// Mock authentication for testing - simulate admin user
const mockAuth = async () => {
  // Create a mock JWT token for admin user - mimics the actual admin user from DB
  const mockToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzM0OTAyNTI4LCJpYXQiOjE3MzQ4OTg5MjgsImlzcyI6Imh0dHBzOi8vZm1lb251dm1sb3BrdXRiamVqbG8uc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6IjU0M2RhYTg4LWQzMTQtNDg0MC1hOGY1LWI4MmM3YTI0YTAxMCIsImVtYWlsIjoiY3Jpc3RpQHZhbnRhZ2VsYW5lLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnt9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzM0ODk4OTI4fV0sInNlc3Npb25faWQiOiIyNzMyNTQ3MS1iNDE0LTQ4MGItYTVhZS1hZTkxOTQ4MTg3NzEifQ.bVr2Sg6D0V4Qz1Xo9zfJ8iY_3CZ_eLm1Kp7RnzFGVq4';

  // Set the session manually
  await supabase.auth.setSession({
    access_token: mockToken,
    refresh_token: 'mock_refresh_token',
  });

  return supabase.auth.getSession();
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

/**
 * Converts ISO timestamp to PostgreSQL timestamp format
 */
const normalizeTimestamp = (isoString: string): string => {
  // Convert "2025-11-22T22:01:00.123Z" to "2025-11-22 22:01:00"
  return isoString
    .replace('T', ' ')
    .replace(/\.\d{3}Z$/, '')
    .replace('Z', '');
};

/**
 * Saves a booking to Supabase database
 */
export const saveBooking = async (
  tripConfig: TripConfiguration,
  bookingType: BookingType
): Promise<BookingResult> => {
  try {
    // Step 0: Authenticate for testing (development only)
    if (process.env.NODE_ENV === 'development') {
      console.log('🔐 Authenticating as admin user for testing...');
      await mockAuth();
    }

    // Step 1: Map TripConfiguration to BookingRecord
    const bookingRecord = mapTripConfigToBooking(tripConfig, bookingType);

    // Step 2: Validate booking record
    const validationErrors = validateBookingRecord(bookingRecord);
    if (validationErrors.length > 0) {
      return {
        success: false,
        error: 'Booking validation failed',
        details: validationErrors,
        code: 'VALIDATION_ERROR',
      };
    }

    // Step 3: Normalize timestamps for PostgreSQL
    const normalizedRecord = {
      ...bookingRecord,
      start_at: normalizeTimestamp(bookingRecord.start_at),
      return_date: bookingRecord.return_date || null,
      return_time: bookingRecord.return_time || null,
    };

    // Step 4: Debug log (development only)
    if (process.env.NODE_ENV === 'development') {
      debugBookingMapping(tripConfig, bookingType, normalizedRecord);
    }

    // Step 5: Insert into Supabase
    const { data, error } = await supabase
      .from('bookings')
      .insert(normalizedRecord)
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase insert error:', error);
      return {
        success: false,
        error: 'Failed to save booking to database',
        details: [error.message],
        code: error.code || 'SUPABASE_ERROR',
      };
    }

    if (!data) {
      return {
        success: false,
        error: 'No data returned from database insert',
        code: 'NO_DATA_RETURNED',
      };
    }

    // Step 6: Save additional stops (if any)
    if (tripConfig.additionalStops && tripConfig.additionalStops.length > 0) {
      const additionalStops = mapAdditionalStops(data.id, tripConfig);

      if (process.env.NODE_ENV === 'development') {
        console.log(`🚏 Saving ${additionalStops.length} additional stops:`, additionalStops);
      }

      const { error: stopsError } = await supabase
        .from('booking_additional_stops')
        .insert(additionalStops);

      if (stopsError) {
        console.error('❌ Failed to save additional stops:', stopsError);
        // Note: We don't fail the whole booking if stops fail - booking is already created
        // In production, you might want to log this for manual intervention
      }
    }

    // Step 7: Success response
    return {
      success: true,
      booking: data as BookingRecord & { id: string },
      message: `${bookingType} booking created successfully with ${tripConfig.additionalStops?.length || 0} additional stops`,
    };
  } catch (error) {
    console.error('❌ Unexpected error in saveBooking:', error);

    return {
      success: false,
      error: 'Unexpected error occurred while saving booking',
      details: [error instanceof Error ? error.message : 'Unknown error'],
      code: 'UNEXPECTED_ERROR',
    };
  }
};

/**
 * Test function to validate booking creation with current store data
 * ONLY for ONE-WAY bookings initially
 */
export const testOneWayBooking = async (tripConfig: TripConfiguration): Promise<BookingResult> => {
  console.log('🧪 Testing ONE-WAY booking creation...');

  // Validate minimum required fields for ONE-WAY
  if (!tripConfig.pickupDateTime) {
    return {
      success: false,
      error: 'Pickup date/time is required for ONE-WAY booking',
      code: 'MISSING_PICKUP_DATETIME',
    };
  }

  if (!tripConfig.selectedVehicle?.category) {
    return {
      success: false,
      error: 'Vehicle category is required for ONE-WAY booking',
      code: 'MISSING_VEHICLE_CATEGORY',
    };
  }

  // Create ONE-WAY booking
  return await saveBooking(tripConfig, 'oneway');
};

/**
 * Utility function to check Supabase connection
 */
export const testSupabaseConnection = async (): Promise<{ connected: boolean; error?: string }> => {
  try {
    const { error } = await supabase.from('organizations').select('id').limit(1);

    if (error) {
      return { connected: false, error: error.message };
    }

    return { connected: true };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown connection error',
    };
  }
};

/**
 * Get booking by ID (for testing/verification)
 */
export const getBooking = async (id: string): Promise<BookingRecord | null> => {
  try {
    const { data, error } = await supabase.from('bookings').select('*').eq('id', id).single();

    if (error || !data) {
      console.error('Error fetching booking:', error);
      return null;
    }

    return data as BookingRecord;
  } catch (error) {
    console.error('Unexpected error fetching booking:', error);
    return null;
  }
};

/**
 * Development helper to log booking record structure
 */
export const logBookingStructure = (
  tripConfig: TripConfiguration,
  bookingType: BookingType
): void => {
  if (process.env.NODE_ENV !== 'development') return;

  console.group('📋 Booking Structure Preview');

  const bookingRecord = mapTripConfigToBooking(tripConfig, bookingType);
  const validation = validateBookingRecord(bookingRecord);

  console.log('Input from Store:', {
    bookingType,
    pickup: tripConfig.pickup?.address,
    dropoff: tripConfig.dropoff?.address,
    pickupDateTime: tripConfig.pickupDateTime,
    passengers: tripConfig.passengers,
    luggage: tripConfig.luggage,
    selectedVehicle: {
      category: tripConfig.selectedVehicle?.category?.id,
      model: tripConfig.selectedVehicle?.model?.name,
    },
  });

  console.log('Generated DB Record:', bookingRecord);
  console.log('Validation Status:', validation.length === 0 ? '✅ Valid' : '❌ Invalid');

  if (validation.length > 0) {
    console.warn('Validation Errors:', validation);
  }

  console.groupEnd();
};
