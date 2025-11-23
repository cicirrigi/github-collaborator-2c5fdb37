/**
 * 🎨 BESPOKE Booking Legs
 * Handles booking_legs creation for BESPOKE bookings (custom/personalized service)
 */

import type { BookingLegRecord, TripConfiguration } from '../types';

/**
 * Maps BESPOKE booking to single informational leg
 * Creates 1 leg with all customer requirements for personalized quote
 *
 * BESPOKE LOGIC:
 * - Single informational leg with customer requirements
 * - Custom requirements text in notes field
 * - Personalized quote will be provided separately
 * - All standard pickup/dropoff/flight info collected
 */
export const mapBespokeBookingToLegs = (
  bookingId: string,
  tripConfig: TripConfiguration
): BookingLegRecord[] => {
  const bespokeLeg: BookingLegRecord = {
    parent_booking_id: bookingId,
    leg_number: 1,
    leg_type: 'outbound', // BESPOKE uses outbound leg type
    internal_reference: `${bookingId}-BESPOKE`,
    driver_reference: `VL-${bookingId.slice(-8).toUpperCase()}-B`,

    // Pickup & Destination for BESPOKE (informational)
    pickup_location: tripConfig.pickup?.address || 'Not specified',
    pickup_lat: tripConfig.pickup?.coordinates ? tripConfig.pickup.coordinates[0] : null,
    pickup_lng: tripConfig.pickup?.coordinates ? tripConfig.pickup.coordinates[1] : null,

    destination: tripConfig.dropoff?.address || 'Not specified',
    destination_lat: tripConfig.dropoff?.coordinates ? tripConfig.dropoff.coordinates[0] : null,
    destination_lng: tripConfig.dropoff?.coordinates ? tripConfig.dropoff.coordinates[1] : null,

    // Scheduled time (informational)
    scheduled_at: tripConfig.pickupDateTime?.toISOString() || new Date().toISOString(),

    // Vehicle info (will be determined in personalized quote)
    vehicle_category: 'bespoke', // Special category for custom service
    vehicle_model: null, // Will be determined based on requirements
    vehicle_index: null, // Not applicable for bespoke

    // Assignment - will be handled after quote approval
    assigned_driver_id: null,
    assigned_vehicle_id: null,
    assigned_at: null,
    assigned_by: null,

    // Status & lifecycle
    status: 'pending', // Waiting for quote preparation
    started_at: null,
    completed_at: null,
    cancelled_at: null,
    cancellation_reason: null,

    // Pricing & payouts - will be set after quote approval
    leg_price: 0, // Will be calculated in personalized quote
    driver_payout: null,
    payout_status: 'pending',
    platform_fee: null,
    operator_net: null,
    paid_at: null,

    // Optional fields
    distance_miles: null, // Will be calculated based on final route
    duration_min: null, // Will be estimated in quote
    notes: `Bespoke Service Request: ${tripConfig.customRequirements || 'Custom requirements not specified'}. Flight: ${tripConfig.flightNumberPickup || 'N/A'}. Passengers: ${tripConfig.passengers}. Luggage: ${tripConfig.luggage}. Additional stops: ${tripConfig.additionalStops?.length || 0}. PERSONALIZED QUOTE REQUIRED.`,
  };

  return [bespokeLeg];
};
