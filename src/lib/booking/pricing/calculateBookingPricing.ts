/**
 * 💰 Booking Pricing Calculator
 * Enhanced calculator cu support pentru vehicle classes, distance, surge pricing
 */

import { BOOKING_CONSTANTS } from '../../../types/booking/index';
import type { 
  TripConfiguration, 
  VehicleSelection, 
  SelectedService, 
  PricingBreakdown, 
  VehicleClass 
} from '../../../types/booking/index';
import { estimateDistanceFare } from './estimateDistanceFare';

/**
 * Enhanced pricing calculator cu comprehensive support
 * 
 * Features:
 * - Vehicle class-based pricing
 * - Distance-based calculations
 * - Hourly rate support
 * - Surge pricing multipliers
 * - Service add-ons
 * 
 * @param tripConfig - Trip configuration with all details
 * @param vehicleSelection - Selected vehicle (null pentru fleet)
 * @param services - Array of selected services
 * @returns Complete pricing breakdown
 */
export const calculateBookingPricing = (
  tripConfig: TripConfiguration,
  vehicleSelection: VehicleSelection | null,
  services: SelectedService[]
): PricingBreakdown => {
  const vehicleType: VehicleClass = vehicleSelection?.model?.class || 'executive';
  
  // Calculate fare based on trip type
  let baseFare: number;
  
  if (tripConfig.type === 'hourly' && tripConfig.hoursRequested) {
    // Hourly pricing
    baseFare = tripConfig.hoursRequested * BOOKING_CONSTANTS.PRICING.HOURLY_RATES[vehicleType];
  } else {
    // Standard trip pricing
    baseFare = BOOKING_CONSTANTS.PRICING.BASE_FARE;
    
    // Add distance-based pricing (if available)
    if (tripConfig.distanceKm) {
      baseFare += estimateDistanceFare(tripConfig.distanceKm, vehicleType);
    }
  }
  
  // Additional stops (on-route)
  const additionalStops = tripConfig.additionalStops.length * BOOKING_CONSTANTS.PRICING.ON_ROUTE_STOP_FEE;
  
  // Off-route distance calculation (placeholder pentru Google Maps)
  const offRouteDistance = 0; // TODO: Implement cu Google Maps API
  
  // Services total
  const servicesTotal = services.filter(s => s.isSelected).reduce((sum, s) => sum + s.price, 0);
  
  // Surge pricing (placeholder pentru future implementation)
  const currentTime = new Date();
  const isWeekend = currentTime.getDay() === 0 || currentTime.getDay() === 6;
  const surgeMultiplier = isWeekend ? BOOKING_CONSTANTS.PRICING.SURGE_MULTIPLIERS.weekend : 1;
  
  const subtotal = (baseFare + additionalStops + servicesTotal) * surgeMultiplier;
  const tax = subtotal * BOOKING_CONSTANTS.PRICING.TAX_RATE;

  return {
    baseFare: Math.round(baseFare * 100) / 100,
    additionalStops: Math.round(additionalStops * 100) / 100,
    offRouteDistance: Math.round(offRouteDistance * 100) / 100,
    services: Math.round(servicesTotal * 100) / 100,
    totalBeforeTax: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round((subtotal + tax) * 100) / 100,
  };
};
