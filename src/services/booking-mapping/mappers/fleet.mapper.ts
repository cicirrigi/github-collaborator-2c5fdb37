/**
 * 🚐 FLEET Booking Mapper
 */

import { createBaseBookingRecord } from '../base-mapping';
import type { BookingRecord, TripConfiguration } from '../types';
import { getFleetVehicleCount } from '../utils';

/**
 * Maps TripConfiguration to BookingRecord for FLEET bookings
 * FLEET bookings use separate columns for each vehicle type
 */
export const mapFleetBooking = (tripConfig: TripConfiguration): BookingRecord => {
  const baseRecord = createBaseBookingRecord(tripConfig, 'fleet');

  return {
    ...baseRecord,
    fleet_executive: getFleetVehicleCount(tripConfig, 'executive'),
    fleet_s_class: getFleetVehicleCount(tripConfig, 's_class'),
    fleet_v_class: getFleetVehicleCount(tripConfig, 'v_class'),
    fleet_suv: getFleetVehicleCount(tripConfig, 'suv'),
  };
};
