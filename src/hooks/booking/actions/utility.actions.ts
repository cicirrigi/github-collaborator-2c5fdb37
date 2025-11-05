/**
 * ⚙️ Utility Actions
 */

import type { BookingSummary, BookingStore, VehicleSelection } from '../../../types/booking/index';
import {
  calculateBookingPricing,
  validateStepBoolean,
  getInitialTripConfiguration,
} from '../../../lib/booking/index';

type ZustandSet = (
  partial: Partial<BookingStore> | ((state: BookingStore) => Partial<BookingStore>)
) => void;
type ZustandGet = () => BookingStore;

export interface UtilityActions {
  calculatePricing: () => void;
  validateCurrentStep: () => boolean;
  resetBooking: () => void;
  saveToStorage: () => void;
  loadFromStorage: () => void;

  getBookingSummary: () => BookingSummary;
  resetStep: (step: number) => void;

  // Time tracking
  stepDurations: Record<number, number>;
  startTimer: (step: number) => void;
  stopTimer: (step: number) => void;

  // Completion
  onComplete?: (summary: BookingSummary) => void;
  setOnComplete: (callback: (summary: BookingSummary) => void) => void;
  completeBooking: () => void;
}

export const createUtilityActions = (set: ZustandSet, get: ZustandGet): UtilityActions => ({
  stepDurations: {},

  calculatePricing: () => {
    const state = get();

    const pricing = calculateBookingPricing(
      state.tripConfiguration,
      state.vehicleSelection,
      state.services
    );

    set({
      pricing,
      isValid: validateStepBoolean(state.currentStep, { ...state, pricing }),
    });
  },

  validateCurrentStep: () => {
    const state = get();
    return validateStepBoolean(state.currentStep, state);
  },

  resetBooking: () => {
    set({
      currentStep: 1,
      completedSteps: [],
      tripConfiguration: getInitialTripConfiguration(),
      vehicleSelection: null,
      services: [],
      specialRequests: [],
      paymentDetails: null,
      pricing: null,
      isValid: false,
      isDirty: false,
      lastSaved: null,
      stepErrors: {},
      stepDurations: {},
      isFleetModalOpen: false,
      tempFleetSelection: [],
    });
  },

  saveToStorage: () => {
    set({
      isDirty: false,
      lastSaved: new Date(),
    });
  },

  loadFromStorage: () => {
    const state = get();
    state.calculatePricing();
  },

  getBookingSummary: (): BookingSummary => {
    const state = get();

    return {
      tripConfiguration: state.tripConfiguration,
      vehicleSelection: state.vehicleSelection as VehicleSelection, // Type assertion for now
      services: state.services.filter(s => s.isSelected),
      specialRequests: state.specialRequests,
      pricing: state.pricing!,
      bookingId: `booking_${Date.now()}`,
      createdAt: new Date(),
      status: 'draft',
    };
  },

  resetStep: (step: number) => {
    const state = get();

    switch (step) {
      case 1:
        set({
          tripConfiguration: getInitialTripConfiguration(),
          isDirty: true,
        });
        break;
      case 2:
        set({
          vehicleSelection: null,
          services: [],
          specialRequests: [],
          isDirty: true,
        });
        break;
      case 3:
        state.calculatePricing();
        break;
      case 4:
        set({
          paymentDetails: null,
          isDirty: true,
        });
        break;
    }

    set((state: BookingStore) => ({
      completedSteps: state.completedSteps.filter((s: number) => s !== step),
    }));

    if (state.clearStepError) {
      state.clearStepError(step);
    }
  },

  startTimer: (step: number) => {
    set((state: BookingStore) => ({
      stepDurations: {
        ...(state.stepDurations || {}),
        [step]: Date.now(),
      },
    }));
  },

  stopTimer: (step: number) => {
    const state = get();
    const startTime = state.stepDurations?.[step];

    if (startTime) {
      const duration = Date.now() - startTime;
      set((state: BookingStore) => ({
        stepDurations: {
          ...(state.stepDurations || {}),
          [step]: duration,
        },
      }));
    }
  },

  setOnComplete: (callback: (summary: BookingSummary) => void) => {
    set({ onComplete: callback });
  },

  completeBooking: () => {
    const state = get();
    const summary = state.getBookingSummary();

    state.stopTimer(state.currentStep);

    set({
      isDirty: false,
      lastSaved: new Date(),
    });

    if (state.onComplete) {
      state.onComplete(summary);
    }
  },
});
