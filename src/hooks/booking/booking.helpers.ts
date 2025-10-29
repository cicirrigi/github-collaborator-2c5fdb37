/**
 * 🛠️ Booking Helpers - DEPRECATED
 * 
 * ⚠️ IMPORTANT: This file is being phased out in favor of modular structure
 * New imports should use: import { ... } from '@/lib/booking'
 * 
 * Temporary backward compatibility exports
 */

// Re-export everything from new modular structure
export {
  getInitialTripConfiguration,
  estimateDistanceFare,
  calculateBookingPricing,
  validateBookingFields,
  validateStep,
  validateStepBoolean,
  logValidationErrors,
} from '@/lib/booking';

<<<<<<< HEAD
// Default state generator
export const getInitialTripConfiguration = (): TripConfiguration => ({
  type: 'oneway',
  pickup: null,
  dropoff: null,
  additionalStops: [],
  returnAdditionalStops: [],
  fleetSelection: [],
  isFleetByHour: false,
  passengers: 1,
  baggage: 0,
  pickupDate: null,
  pickupTime: '',
});

// Pricing calculator
export const calculateBookingPricing = (
  tripConfig: TripConfiguration,
  vehicleSelection: VehicleSelection | null,
  services: SelectedService[]
): PricingBreakdown => {
  const baseFare = 50;
  const additionalStops = tripConfig.additionalStops.length * BOOKING_CONSTANTS.ON_ROUTE_STOP_FEE;
  const servicesTotal = services.filter(s => s.isSelected).reduce((sum, s) => sum + s.price, 0);

  const subtotal = baseFare + additionalStops + servicesTotal;
  const tax = subtotal * BOOKING_CONSTANTS.TAX_RATE;

  return {
    baseFare,
    additionalStops,
    offRouteDistance: 0, // TODO: Google Maps integration
    services: servicesTotal,
    totalBeforeTax: subtotal,
    tax,
    total: subtotal + tax,
  };
};

// Step validation
export const validateStep = (step: number, state: BookingStore): boolean => {
  switch (step) {
    case 1:
      return !!(
        state.tripConfiguration.pickup &&
        state.tripConfiguration.dropoff &&
        state.tripConfiguration.pickupDate
      );
    case 2:
      if (state.tripConfiguration.type === 'fleet') {
        return state.tripConfiguration.fleetSelection.length > 0;
      }
      return !!state.vehicleSelection;
    case 3:
      return !!state.pricing && state.pricing.total > 0;
    case 4:
      return !!state.paymentDetails;
    default:
      return true;
  }
};
=======
export type {
  BookingValidationError,
  ValidationResult,
  StepValidationResult,
} from '@/lib/booking';
>>>>>>> 252d0b5 (🚀 Major booking system refactor & optimization)
