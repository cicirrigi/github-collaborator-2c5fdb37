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
    const { bookingType, tripConfiguration: t } = get();

    switch (bookingType) {
      case 'oneway':
        return !!(t.pickup && t.dropoff && t.pickupDateTime);

      case 'return':
        return !!(t.pickup && t.dropoff && t.pickupDateTime && t.returnDateTime);

      case 'hourly':
        return !!(t.pickup && t.pickupDateTime && t.hoursRequested && t.hoursRequested > 0);

      case 'daily':
        return !!(
          t.pickup &&
          t.dailyRange[0] &&
          t.dailyRange[1] &&
          t.daysRequested &&
          t.daysRequested > 0
        );

      case 'fleet':
        return !!(t.pickup && t.pickupDateTime); // Fleet available for any passenger count

      case 'bespoke':
        return !!(t.pickup && t.customRequirements && t.customRequirements.trim().length > 0);

      default:
        return false;
    }
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
    const { tripConfiguration } = get();

    if (!tripConfiguration.pickup || !tripConfiguration.dropoff) {
      return { distanceKm: 0, durationMinutes: 0 };
    }

    // Return realistic dummy values based on London averages
    const dummyDistanceKm = Math.floor(Math.random() * 50) + 5; // 5-55 km
    const dummyDurationMinutes = Math.floor(dummyDistanceKm * 2.5); // ~2.5 min per km in city traffic

    return {
      distanceKm: dummyDistanceKm,
      durationMinutes: dummyDurationMinutes,
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
  calculateEstimatedDistanceAndTime: () => { distanceKm: number; durationMinutes: number };
}
