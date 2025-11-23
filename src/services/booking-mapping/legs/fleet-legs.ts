/**
 * 🚛 FLEET Booking Legs
 * Handles booking_legs creation for FLEET bookings (multiple vehicles)
 */

import type { BookingLegRecord, TripConfiguration } from '../types';
import { getFleetVehicleCount } from '../utils';

/**
 * Maps FLEET booking to multiple booking legs
 * Creates separate legs for each vehicle in the fleet
 *
 * FLEET LOGIC:
 * - Each vehicle = 1 separate leg
 * - vehicle_index = position in fleet (1, 2, 3...)
 * - Same pickup/destination for all vehicles in fleet
 * - Fleet coordination logic handled elsewhere
 */
export const mapFleetBookingToLegs = (
  bookingId: string,
  tripConfig: TripConfiguration
): BookingLegRecord[] => {
  const fleetLegs: BookingLegRecord[] = [];
  let vehicleIndex = 1;

  // Get fleet vehicle counts from TripConfiguration (same as fleet.mapper.ts)
  const fleetCounts = {
    executive: getFleetVehicleCount(tripConfig, 'executive') || 0,
    s_class: getFleetVehicleCount(tripConfig, 's_class') || 0,
    v_class: getFleetVehicleCount(tripConfig, 'v_class') || 0,
    suv: getFleetVehicleCount(tripConfig, 'suv') || 0,
  };

  // Create legs for each vehicle type and count
  Object.entries(fleetCounts).forEach(([vehicleCategory, count]) => {
    if (count && count > 0) {
      // Create separate leg for each vehicle of this type
      for (let i = 0; i < count; i++) {
        const fleetLeg: BookingLegRecord = {
          parent_booking_id: bookingId,
          leg_number: vehicleIndex,
          leg_type: 'outbound', // FLEET uses outbound leg type
          internal_reference: `${bookingId}-FLEET-${vehicleIndex}`,
          driver_reference: `VL-${bookingId.slice(-8).toUpperCase()}-F${vehicleIndex}`,

          // Fleet vehicle info
          vehicle_category: vehicleCategory,
          vehicle_model: null, // Will be assigned during fleet management
          vehicle_index: vehicleIndex, // Position in fleet (1, 2, 3...)

          // Same pickup & destination for all fleet vehicles
          pickup_location: tripConfig.pickup?.address || 'Not specified',
          pickup_lat: tripConfig.pickup?.coordinates ? tripConfig.pickup.coordinates[0] : null,
          pickup_lng: tripConfig.pickup?.coordinates ? tripConfig.pickup.coordinates[1] : null,

          destination: tripConfig.dropoff?.address || 'Not specified',
          destination_lat: tripConfig.dropoff?.coordinates
            ? tripConfig.dropoff.coordinates[0]
            : null,
          destination_lng: tripConfig.dropoff?.coordinates
            ? tripConfig.dropoff.coordinates[1]
            : null,

          // Scheduled at same time for coordinated pickup
          scheduled_at: tripConfig.pickupDateTime?.toISOString() || new Date().toISOString(),

          // Assignment - will be handled by fleet management system
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
          leg_price: 0, // Will be calculated by pricing service per vehicle
          driver_payout: null,
          payout_status: 'pending',
          platform_fee: null,
          operator_net: null,
          paid_at: null,

          // Optional fields
          distance_miles: null,
          duration_min: null, // Standard transfer duration
          notes: `Fleet Service: Vehicle ${vehicleIndex} (${vehicleCategory}). Flight: ${tripConfig.flightNumberPickup || 'N/A'}. Passengers: ${tripConfig.passengers}. Fleet coordination required.`,
        };

        fleetLegs.push(fleetLeg);
        vehicleIndex++;
      }
    }
  });

  return fleetLegs;
};
