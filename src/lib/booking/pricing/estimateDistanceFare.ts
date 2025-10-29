/**
 * 🗺️ Distance-Based Pricing Calculator
 * Google Maps integration ready
 */

import { BOOKING_CONSTANTS, type VehicleClass } from '../../../types/booking/index';

/**
 * Calculates distance-based fare pentru Google Maps integration
 * Converts km to miles și applies vehicle-specific rates
 * 
 * @param distanceKm - Distance in kilometers from Google Maps
 * @param vehicleType - Vehicle class determining the rate
 * @returns Calculated fare in GBP
 */
export const estimateDistanceFare = (
  distanceKm: number, 
  vehicleType: VehicleClass = 'executive'
): number => {
  if (distanceKm <= 0) return 0;
  
  const distanceMiles = distanceKm * 0.621371; // Convert km to miles
  const ratePerMile = BOOKING_CONSTANTS.PRICING.DISTANCE_RATES[vehicleType];
  
  return Math.round(distanceMiles * ratePerMile * 100) / 100; // Round to 2 decimal places
};
