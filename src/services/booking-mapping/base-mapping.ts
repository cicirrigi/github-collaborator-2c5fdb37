/**
 * 🏗️ Base Booking Mapping - Common record creation logic
 */

import type { BookingRecord, BookingType, TripConfiguration } from './types';
import { mapVehicleCategoryToDB } from './utils';

/**
 * Creates the base booking record with common fields
 * Used by all booking type mappers
 */
export const createBaseBookingRecord = (
  tripConfig: TripConfiguration,
  bookingType: BookingType
): BookingRecord => {
  // Get the operator ID from environment variable
  const operatorId = process.env.NEXT_PUBLIC_CENTRAL_OPERATOR_ID;
  if (!operatorId) {
    throw new Error('NEXT_PUBLIC_CENTRAL_OPERATOR_ID environment variable is required');
  }

  return {
    // System identifiers
    operator_id: operatorId,
    category: mapVehicleCategoryToDB(tripConfig.selectedVehicle?.category?.id),
    start_at: tripConfig.pickupDateTime?.toISOString() || new Date().toISOString(),

    // Basic trip configuration
    trip_type: bookingType,
    passenger_count: tripConfig.passengers || 1,
    bag_count: tripConfig.luggage || 0,

    // Optional trip details
    vehicle_model: tripConfig.selectedVehicle?.model?.name || null,
    flight_number: tripConfig.flightNumberPickup || null,
    notes: tripConfig.customRequirements || null,

    // System defaults
    currency: 'GBP',
    payment_method: 'CARD',
    status: 'NEW',
    booking_status: 'draft',
    extra_stops: tripConfig.additionalStops?.length || 0,
  };
};
