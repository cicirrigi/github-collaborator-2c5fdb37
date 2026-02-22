/**
 * 📅 DAILY Booking Legs
 * Handles booking_legs creation for DAILY bookings (multi-day chauffeur service)
 */

import type { BookingLegRecord, TripConfiguration } from '../types';

/**
 * Maps DAILY booking to single booking leg
 * Creates 1 leg for multi-day chauffeur service
 *
 * DAILY LOGIC:
 * - Single leg for extended chauffeur service over multiple days
 * - Duration calculated from daysRequested (days × 24h × 60min)
 * - Often same pickup/dropoff location for extended "at disposal" service
 * - Perfect for business trips, extended events, or long-term chauffeur needs
 */
export const mapDailyBookingToLegs = (
  bookingId: string,
  tripConfig: TripConfiguration
): BookingLegRecord[] => {
  const dailyLeg: BookingLegRecord = {
    parent_booking_id: bookingId,
    leg_number: 1,
    leg_type: 'outbound', // DAILY uses outbound leg type
    internal_reference: `${bookingId}-DAILY`,
    driver_reference: `VL-${bookingId.slice(-8).toUpperCase()}-D`,

    // Pickup & Destination for DAILY
    pickup_location: tripConfig.pickup?.address || 'Not specified',
    pickup_lat: tripConfig.pickup?.coordinates ? tripConfig.pickup.coordinates[0] : null,
    pickup_lng: tripConfig.pickup?.coordinates ? tripConfig.pickup.coordinates[1] : null,

    // For DAILY: destination can be same as pickup for extended "at disposal" service
    destination:
      tripConfig.dropoff?.address || tripConfig.pickup?.address || 'At disposal (multi-day)',
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
    leg_price: 0, // Will be calculated by pricing service based on days
    driver_payout: null,
    payout_status: 'pending',
    platform_fee: null,
    operator_net: null,
    paid_at: null,

    // Optional fields
    distance_miles: null, // Not applicable for multi-day at disposal service
    duration_min: tripConfig.daysRequested ? tripConfig.daysRequested * 24 * 60 : 1440, // Convert days to minutes (default 1 day = 1440min)
    notes: `Daily Service: ${tripConfig.daysRequested || 1} day(s). Flight: ${tripConfig.flightNumberPickup || 'N/A'}. Passengers: ${tripConfig.passengers}. Luggage: ${tripConfig.luggage}. Additional stops: ${tripConfig.additionalStops?.length || 0}`,
  };

  return [dailyLeg];
};
