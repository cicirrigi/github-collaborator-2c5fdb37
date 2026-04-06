/**
 * 🧪 Booking Test Service - Development/Testing Only
 *
 * Contains all test functions for booking functionality.
 * NEVER import this in production code!
 */

import { useBookingState } from '@/hooks/useBookingState';
import type { TripConfiguration } from '@/hooks/useBookingState/booking.types';
import { createClient } from '@supabase/supabase-js';
import {
  mapTripConfigToBooking,
  validateBookingRecord,
  type BookingRecord,
  type BookingType,
} from './booking-mapping';
import { saveBooking, type BookingResult } from './booking.service';

// Supabase client for dev functions
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Test function to validate ONE-WAY booking creation with current store data
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

  // Create ONE-WAY booking using production service
  return await saveBooking(tripConfig, 'oneway');
};

/**
 * Test function to validate RETURN booking creation with current store data
 */
export const testReturnBooking = async (tripConfig: TripConfiguration): Promise<BookingResult> => {
  console.log('🧪 Testing RETURN booking creation...');

  // Validate minimum required fields for RETURN
  if (!tripConfig.pickupDateTime) {
    return {
      success: false,
      error: 'Pickup date/time is required for RETURN booking',
      code: 'MISSING_PICKUP_DATETIME',
    };
  }

  if (!tripConfig.returnDateTime) {
    return {
      success: false,
      error: 'Return date/time is required for RETURN booking',
      code: 'MISSING_RETURN_DATETIME',
    };
  }

  if (!tripConfig.selectedVehicle?.category) {
    return {
      success: false,
      error: 'Vehicle category is required for RETURN booking',
      code: 'MISSING_VEHICLE_CATEGORY',
    };
  }

  // Create RETURN booking using production service
  return await saveBooking(tripConfig, 'return');
};

/**
 * Test function to validate ANY booking type with current store data
 */
export const testBooking = async (
  bookingType: 'oneway' | 'return' | 'hourly' | 'daily' | 'fleet' | 'bespoke'
): Promise<BookingResult> => {
  const { tripConfiguration } = useBookingState.getState();

  switch (bookingType) {
    case 'oneway':
      return await testOneWayBooking(tripConfiguration);
    case 'return':
      return await testReturnBooking(tripConfiguration);
    default:
      return await saveBooking(tripConfiguration, bookingType);
  }
};

/**
 * DEV FUNCTION: Check Supabase connection
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
 * DEV FUNCTION: Get booking by ID (for verification)
 */
export const getBookingForTest = async (id: string): Promise<BookingRecord | null> => {
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
 * DEV FUNCTION: Log booking structure for debugging
 */
export const logBookingStructure = (
  tripConfig: TripConfiguration,
  bookingType: BookingType
): void => {
  if (process.env.NODE_ENV !== 'development') return;

  console.group('📋 Booking Structure Preview');

  const bookingRecord = mapTripConfigToBooking(tripConfig, bookingType, 'test-customer-id');
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
