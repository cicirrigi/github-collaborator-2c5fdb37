/**
 * 🚗 Booking Legs Mapping - RETURN trips cu 2 legs
 */

import type { BookingLegRecord, TripConfiguration } from './types';

/**
 * Maps TripConfiguration pentru RETURN booking în 2 legs separate
 *
 * @param bookingId - Parent booking ID
 * @param tripConfig - TripConfiguration din Zustand
 * @returns Array cu 2 BookingLegRecord (outbound + inbound)
 */
export const mapReturnBookingToLegs = (
  bookingId: string,
  tripConfig: TripConfiguration
): BookingLegRecord[] => {
  // OUTBOUND LEG (dus)
  const outboundLeg: BookingLegRecord = {
    parent_booking_id: bookingId,
    leg_number: 1,
    leg_type: 'outbound',
    internal_reference: `${bookingId}-OUT`,
    driver_reference: `VL-${bookingId.slice(-8).toUpperCase()}-OUT`,

    // Pickup & Destination pentru outbound
    pickup_location: tripConfig.pickup?.address || '',
    pickup_lat: tripConfig.pickup?.coordinates ? tripConfig.pickup.coordinates[0] : null,
    pickup_lng: tripConfig.pickup?.coordinates ? tripConfig.pickup.coordinates[1] : null,

    destination: tripConfig.dropoff?.address || '',
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

  // INBOUND LEG (întoarcere) - LOGIC CONDITIONAL
  let inboundPickup, inboundDropoff;

  if (tripConfig.isDifferentReturnLocation) {
    // DIFFERENT LOCATION: Folosește returnPickup/returnDropoff
    inboundPickup = {
      address: tripConfig.returnPickup?.address || '',
      coordinates: tripConfig.returnPickup?.coordinates || null,
    };
    inboundDropoff = {
      address: tripConfig.returnDropoff?.address || '',
      coordinates: tripConfig.returnDropoff?.coordinates || null,
    };
  } else {
    // NORMAL RETURN: Inversează outbound locations
    inboundPickup = {
      address: tripConfig.dropoff?.address || '', // dropoff becomes pickup
      coordinates: tripConfig.dropoff?.coordinates || null,
    };
    inboundDropoff = {
      address: tripConfig.pickup?.address || '', // pickup becomes dropoff
      coordinates: tripConfig.pickup?.coordinates || null,
    };
  }

  const inboundLeg: BookingLegRecord = {
    parent_booking_id: bookingId,
    leg_number: 2,
    leg_type: 'return',
    internal_reference: `${bookingId}-IN`,
    driver_reference: `VL-${bookingId.slice(-8).toUpperCase()}-IN`,

    // Pickup & Destination pentru inbound (conditional logic)
    pickup_location: inboundPickup.address,
    pickup_lat: inboundPickup.coordinates ? inboundPickup.coordinates[0] : null,
    pickup_lng: inboundPickup.coordinates ? inboundPickup.coordinates[1] : null,

    destination: inboundDropoff.address,
    destination_lat: inboundDropoff.coordinates ? inboundDropoff.coordinates[0] : null,
    destination_lng: inboundDropoff.coordinates ? inboundDropoff.coordinates[1] : null,

    scheduled_at:
      (tripConfig.returnDateTime || tripConfig.returnDate)?.toISOString() ||
      new Date().toISOString(),

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
    notes: `Return Flight: ${tripConfig.flightNumberReturn || 'N/A'}. Return additional stops: ${tripConfig.returnAdditionalStops?.length || 0}. Different location: ${tripConfig.isDifferentReturnLocation}`,
  };

  return [outboundLeg, inboundLeg];
};

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
