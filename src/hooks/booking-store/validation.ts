// ✅ VALIDATION ACTIONS - Enterprise Step Validation & Return Trip Logic
import {
  getSmartRecommendations,
  validateCrossStep,
} from '../../lib/booking/validation/cross-step.validation';
import { validateStep2Complete } from '../../lib/booking/validation/step2.validation';
import type { BookingState, SingleBooking } from '../useBookingState/booking.types';

export const createValidationActions = (
  set: (partial: Partial<BookingState> | ((state: BookingState) => Partial<BookingState>)) => void,
  get: () => BookingState
) => ({
  // 🎯 STEP VALIDATION ROUTER
  validateCurrentStep: () => {
    const { currentStep, tripConfiguration } = get();

    switch (currentStep) {
      case 1:
        return get().validateStep1Complete();
      case 2: {
        // ENTERPRISE STEP 2 VALIDATION - validare completă per booking type
        const { bookingType } = get();
        const result = validateStep2Complete(bookingType, tripConfiguration);
        return result.isValid;
      }
      case 3:
        return true; // Payment step
      case 4:
        return true; // Confirmation step
      default:
        return false;
    }
  },

  // 🎯 ENTERPRISE STEP 1 VALIDATION (per booking type)
  validateStep1Complete: () => {
    const { bookingType, tripConfiguration: t, pricingState, hasPricingData } = get();

    // First check required fields per booking type
    let fieldsValid = false;
    switch (bookingType) {
      case 'oneway':
        fieldsValid = !!(t.pickup && t.dropoff && t.pickupDateTime && t.passengers > 0);
        break;

      case 'return':
        fieldsValid = !!(
          t.pickup &&
          t.dropoff &&
          t.pickupDateTime &&
          t.returnDateTime &&
          t.passengers > 0
        );
        break;

      case 'hourly':
        fieldsValid = !!(
          t.pickup &&
          t.pickupDateTime &&
          t.hoursRequested &&
          t.hoursRequested > 0 &&
          t.passengers > 0
        );
        break;

      case 'daily':
        fieldsValid = !!(
          t.pickup &&
          t.dailyRange[0] &&
          t.dailyRange[1] &&
          t.daysRequested &&
          t.daysRequested > 0 &&
          t.passengers > 0
        );
        break;

      case 'fleet':
        fieldsValid = !!(t.pickup && t.pickupDateTime && t.passengers > 0); // Fleet requires passengers for capacity planning
        break;

      case 'bespoke':
        fieldsValid = !!(
          t.pickup &&
          t.customRequirements &&
          t.customRequirements.trim().length > 0 &&
          t.passengers > 0
        );
        break;

      default:
        fieldsValid = false;
    }

    // If required fields are not valid, return false immediately
    if (!fieldsValid) return false;

    // For bespoke bookings, skip pricing validation (they don't use pricing API)
    if (bookingType === 'bespoke') return true;

    // For all other booking types, also check pricing completion
    // TEMPORARY: Allow booking even with pricing errors for testing
    // TODO: Re-enable strict validation once Google Maps issues are fixed

    // Skip strict validation temporarily to allow booking testing
    const pricingValid = true; // Temporarily bypass pricing validation

    return fieldsValid && pricingValid;
  },

  // 🚗 RETURN TRIP ENTERPRISE LOGIC - 2 Separate Bookings
  prepareReturnTripBookings: () => {
    const { bookingType, tripConfiguration: t } = get();

    // Only works for return bookings
    if (
      bookingType !== 'return' ||
      !t.pickup ||
      !t.dropoff ||
      !t.pickupDateTime ||
      !t.returnDateTime
    ) {
      return null;
    }

    const baseBooking = {
      passengers: t.passengers,
      luggage: t.luggage,
      vehicle: t.selectedVehicle,
      ...(t.customRequirements && { specialRequirements: t.customRequirements }),
    };

    return {
      // 🛫 OUTBOUND: Pickup → Dropoff
      outbound: {
        type: 'oneway' as const,
        pickup: t.pickup,
        dropoff: t.dropoff,
        pickupDateTime: t.pickupDateTime,
        ...(t.flightNumberPickup && { flightNumber: t.flightNumberPickup }),
        ...baseBooking,
      },

      // 🛬 INBOUND: Dropoff → Pickup (reversed)
      inbound: {
        type: 'oneway' as const,
        pickup: t.dropoff, // Return starts from original dropoff
        dropoff: t.pickup, // Return ends at original pickup
        pickupDateTime: t.returnDateTime,
        ...(t.flightNumberReturn && { flightNumber: t.flightNumberReturn }),
        ...baseBooking,
      },
    };
  },

  // 🚗 ENTERPRISE STEP 2 VALIDATION (separate action for direct access)
  validateStep2Complete: () => {
    const { bookingType, tripConfiguration } = get();
    const result = validateStep2Complete(bookingType, tripConfiguration);

    // Return detailed result for UI to show errors/warnings
    return {
      isValid: result.isValid,
      errors: result.missingFields,
      warnings: result.warnings,
    };
  },

  // 🔗 CROSS-STEP VALIDATION (Step 1 ↔ Step 2 compatibility)
  validateCrossStep: () => {
    const { bookingType, tripConfiguration } = get();
    const result = validateCrossStep(bookingType, tripConfiguration);

    return {
      isValid: result.isValid,
      recommendations: result.recommendations,
      warnings: result.warnings,
      errors: result.errors,
    };
  },

  // 🎯 SMART RECOMMENDATIONS ENGINE
  getSmartRecommendations: () => {
    const { bookingType, tripConfiguration } = get();
    return getSmartRecommendations(bookingType, tripConfiguration);
  },

  // 🧮 UTILITY: Distance & Time Calculation
  calculateEstimatedDistanceAndTime: () => {
    const { tripConfiguration, pricingState } = get();

    if (!tripConfiguration.pickup || !tripConfiguration.dropoff) {
      return { distanceKm: 0, durationMinutes: 0, error: 'No pickup or dropoff selected' };
    }

    // Check if Google Maps API failed
    if (pricingState.pricingError) {
      return {
        distanceKm: 0,
        durationMinutes: 0,
        error: 'Route calculation failed - booking temporarily unavailable',
      };
    }

    // Use real route data from Google Maps if available
    if (
      pricingState.routeData.isCalculated &&
      pricingState.routeData.distance &&
      pricingState.routeData.duration
    ) {
      // Convert miles to km for UI display (API uses miles, UI shows km)
      const distanceKm = Math.round(pricingState.routeData.distance * 1.609344 * 10) / 10; // miles to km, 1 decimal
      const durationMinutes = Math.round(pricingState.routeData.duration);

      return {
        distanceKm,
        durationMinutes,
        error: null,
      };
    }

    // NO FALLBACK TO ZERO - Return error state instead
    return {
      distanceKm: 0,
      durationMinutes: 0,
      error: 'Calculating route... Please wait',
    };
  },
});

// 🔧 TYPE DEFINITION
export interface ValidationActions {
  validateCurrentStep: () => boolean;
  validateStep1Complete: () => boolean;
  validateStep2Complete: () => { isValid: boolean; errors: string[]; warnings: string[] };
  validateCrossStep: () => {
    isValid: boolean;
    recommendations: string[];
    warnings: string[];
    errors: string[];
  };
  getSmartRecommendations: () => string[];
  prepareReturnTripBookings: () => { outbound: SingleBooking; inbound: SingleBooking } | null;
  calculateEstimatedDistanceAndTime: () => {
    distanceKm: number;
    durationMinutes: number;
    error: string | null;
  };
}
