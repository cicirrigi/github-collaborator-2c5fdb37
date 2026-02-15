// 🎯 BOOKING ACTIONS - Booking Type & Stepper Logic
import type { BookingState, BookingType } from '../useBookingState/booking.types';
import { createInitialTripConfiguration } from './initialState';

export const createBookingActions = (
  set: (partial: Partial<BookingState> | ((state: BookingState) => Partial<BookingState>)) => void,
  get: () => BookingState
) => ({
  // 🎯 BOOKING TYPE MANAGEMENT
  setBookingType: (type: BookingType) => {
    const currentConfig = get().tripConfiguration;

    set({
      bookingType: type,
      // Reset wizard to Step 1 when booking type changes (industry standard)
      currentStep: 1,
      completedSteps: [],
      tripConfiguration: {
        ...currentConfig,
        // Clear incompatible fields when booking type changes
        returnDateTime: type === 'return' ? currentConfig.returnDateTime : null,
        dailyRange: type === 'daily' ? currentConfig.dailyRange : [null, null],
        hoursRequested: type === 'hourly' ? currentConfig.hoursRequested : null,
        daysRequested: type === 'daily' ? currentConfig.daysRequested : null,
        customRequirements: type === 'bespoke' ? currentConfig.customRequirements : '',
      },
    });

    // 🔄 Trigger pricing recalculation if we have route data (industry standard pattern)
    const state = get();
    const { pricingState, tripConfiguration } = state;

    if (
      pricingState.routeData.isCalculated &&
      pricingState.routeData.distance &&
      pricingState.routeData.duration &&
      tripConfiguration.pickup &&
      tripConfiguration.dropoff
    ) {
      state.calculatePricing();
    }
  },

  // 🪄 STEPPER NAVIGATION
  setCurrentStep: (step: number) => set({ currentStep: step }),

  setCompletedSteps: (steps: number[]) => set({ completedSteps: steps }),

  nextStep: () => {
    const { currentStep, totalSteps } = get();
    if (currentStep < totalSteps) {
      set({ currentStep: currentStep + 1 });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: currentStep - 1 });
    }
  },

  // 🔐 STEPPER LOGIC cu Dependencies
  canProceedToStep: (step: number) => {
    const { currentStep, completedSteps } = get();
    const store = get();

    // Can always go backwards
    if (step <= currentStep) return true;

    // Can only proceed if previous step is completed
    switch (step) {
      case 2:
        return store.validateStep1Complete();

      case 3:
        // Fleet bookings use different validation path
        if (store.bookingType === 'fleet') {
          return store.validateStep1Complete() && store.validateFleetSelection();
        }
        // Normal bookings (oneway, return, hourly, daily) use selectedVehicle
        return (
          store.validateStep1Complete() && store.tripConfiguration.selectedVehicle.category !== null
        );

      case 4:
        // Fleet bookings use different validation path
        if (store.bookingType === 'fleet') {
          return store.validateStep1Complete() && store.validateFleetSelection();
        }
        return (
          store.validateStep1Complete() && store.tripConfiguration.selectedVehicle.category !== null
        );

      default:
        return completedSteps.includes(step - 1);
    }
  },

  // 🔄 RESET COMPLETE TRIP
  resetTrip: () =>
    set({
      bookingType: 'oneway',
      tripConfiguration: createInitialTripConfiguration(),
      currentStep: 1,
      completedSteps: [],
    }),
});

// 🔧 All types are now in BookingState interface
