/**
 * ⏰ HOURLY Booking Legs
 * Handles booking_legs creation for HOURLY bookings (chauffeur service)
 */

import type { BookingLegRecord, TripConfiguration } from '../types';

/**
 * Maps HOURLY booking to single booking leg
 * Creates 1 leg for chauffeur service with specified duration
 *
 * HOURLY LOGIC:
 * - Single leg starting at pickup location
 * - Duration specified by hoursRequested field in parent booking
 * - Can have same pickup/dropoff for "at disposal" service
 * - Additional stops supported for multiple destinations
 */
export const mapHourlyBookingToLegs = (
  bookingId: string,
  tripConfig: TripConfiguration
): BookingLegRecord[] => {
  const hourlyLeg: BookingLegRecord = {
    parent_booking_id: bookingId,
    leg_number: 1,
    leg_type: 'outbound', // HOURLY uses outbound leg type
    internal_reference: `${bookingId}-HOURLY`,
    driver_reference: `VL-${bookingId.slice(-8).toUpperCase()}-H`,

    // Pickup & Destination for HOURLY
    pickup_location: tripConfig.pickup?.address || 'Not specified',
    pickup_lat: tripConfig.pickup?.coordinates ? tripConfig.pickup.coordinates[0] : null,
    pickup_lng: tripConfig.pickup?.coordinates ? tripConfig.pickup.coordinates[1] : null,

    // For HOURLY: destination can be same as pickup for "at disposal" service
    destination: tripConfig.dropoff?.address || tripConfig.pickup?.address || 'At disposal',
    destination_lat: tripConfig.dropoff?.coordinates
      ? tripConfig.dropoff.coordinates[0]
      : tripConfig.pickup?.coordinates
        ? tripConfig.pickup.coordinates[0]
        : null,
    destination_lng: tripConfig.dropoff?.coordinates
      ? tripConfig.dropoff.coordinates[1]
      : tripConfig.pickup?.coordinates
        ? tripConfig.pickup.coordinates[1]
        : null,

    // Scheduled at pickup time - service starts here
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
    leg_price: 0, // Will be calculated by pricing service based on hours
    driver_payout: null,
    payout_status: 'pending',
    platform_fee: null,
    operator_net: null,
    paid_at: null,

    // Optional fields
    distance_miles: null, // Not applicable for hourly service
    duration_min: tripConfig.hoursRequested ? tripConfig.hoursRequested * 60 : 60, // Convert hours to minutes
    notes: `Hourly Service: ${tripConfig.hoursRequested || 1}h. Flight: ${tripConfig.flightNumberPickup || 'N/A'}. Passengers: ${tripConfig.passengers}. Luggage: ${tripConfig.luggage}. Additional stops: ${tripConfig.additionalStops?.length || 0}`,
  };

  return [hourlyLeg];
};
