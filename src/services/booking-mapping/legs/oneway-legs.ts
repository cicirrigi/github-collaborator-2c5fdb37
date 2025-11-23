/**
 * 🚗 ONE-WAY Booking Legs
 * Handles booking_legs creation for ONE-WAY bookings
 */

import type { BookingLegRecord, TripConfiguration } from '../types';

/**
 * Maps ONE-WAY booking to single booking leg
 * Creates 1 outbound leg with pickup → destination
 */
export const mapOnewayBookingToLegs = (
  bookingId: string,
  tripConfig: TripConfiguration
): BookingLegRecord[] => {
  const outboundLeg: BookingLegRecord = {
    parent_booking_id: bookingId,
    leg_number: 1,
    leg_type: 'outbound',
    internal_reference: `${bookingId}-OUT`,
    driver_reference: `VL-${bookingId.slice(-8).toUpperCase()}-OUT`,

    // Pickup & Destination for ONE-WAY
    pickup_location: tripConfig.pickup?.address || 'Not specified',
    pickup_lat: tripConfig.pickup?.coordinates ? tripConfig.pickup.coordinates[0] : null,
    pickup_lng: tripConfig.pickup?.coordinates ? tripConfig.pickup.coordinates[1] : null,

    destination: tripConfig.dropoff?.address || 'Not specified',
    destination_lat: tripConfig.dropoff?.coordinates ? tripConfig.dropoff.coordinates[0] : null,
    destination_lng: tripConfig.dropoff?.coordinates ? tripConfig.dropoff.coordinates[1] : null,

    scheduled_at: tripConfig.pickupDateTime?.toISOString() || new Date().toISOString(),

    // Vehicle & assignment
    vehicle_category: tripConfig.selectedVehicle?.category?.id || 'executive',
    vehicle_model: tripConfig.selectedVehicle?.model?.name || null,
    vehicle_index: null,
    assigned_driver_id: null,
    assigned_vehicle_id: null,
    assigned_at: null,
    assigned_by: null,

    // Status & lifecycle
    status: 'pending',
    started_at: null,
    completed_at: null,
    cancelled_at: null,
    cancellation_reason: null,

    // Pricing & payouts
    leg_price: 0, // Will be calculated by pricing service
    driver_payout: null,
    payout_status: 'pending',
    platform_fee: null,
    operator_net: null,
    paid_at: null,

    // Optional fields
    distance_miles: null,
    duration_min: null,
    notes: `Flight: ${tripConfig.flightNumberPickup || 'N/A'}. Passengers: ${tripConfig.passengers}. Luggage: ${tripConfig.luggage}. Additional stops: ${tripConfig.additionalStops?.length || 0}`,
  };

  return [outboundLeg];
};
