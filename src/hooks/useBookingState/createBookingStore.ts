import { create } from 'zustand';
import type { BookingState, PickupDropoffField, StopPoint, TripConfiguration } from './types';

const initialConfig: TripConfiguration = {
  pickup: null,
  dropoff: null,

  additionalStops: [],

  pickupDate: null,
  returnDate: null,

  pickupTime: '',
  returnTime: '',

  passengers: 1,
  luggage: 0,

  flightNumberPickup: '',
  flightNumberReturn: '',

  hoursRequested: null,
};

export const createBookingStore = create<BookingState>((set, get) => ({
  // BOOKING TYPE (default oneway)
  bookingType: 'oneway',
  setBookingType: type => set({ bookingType: type }),

  // WIZARD STATE
  currentStep: 1,
  completedSteps: [],
  totalSteps: 4,

  // TRIP CONFIGURATION
  tripConfiguration: initialConfig,

  // Basic fields
  setPickup: (location: PickupDropoffField) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        pickup: location,
      },
    })),

  setDropoff: (location: PickupDropoffField) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        dropoff: location,
      },
    })),

  // Stops
  setAdditionalStops: (stops: StopPoint[]) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        additionalStops: stops,
      },
    })),

  // Dates & times
  setPickupDateTime: (date, time) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        pickupDate: date,
        pickupTime: time,
      },
    })),

  setReturnDateTime: (date, time) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        returnDate: date,
        returnTime: time,
      },
    })),

  // Passengers & luggage
  setPassengers: value =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        passengers: value,
      },
    })),

  setLuggage: value =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        luggage: value,
      },
    })),

  // Flight numbers
  setFlightNumberPickup: value =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        flightNumberPickup: value,
      },
    })),

  setFlightNumberReturn: value =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        flightNumberReturn: value,
      },
    })),

  // Hourly
  setHoursRequested: value =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        hoursRequested: value,
      },
    })),

  // WIZARD ACTIONS
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

  canProceedToStep: (step: number) => {
    const { currentStep, completedSteps } = get();
    return step <= currentStep || completedSteps.includes(step - 1);
  },

  validateCurrentStep: () => {
    // Basic validation - can be extended later
    return true;
  },

  // 🔥 RESET
  resetTrip: () =>
    set({
      tripConfiguration: initialConfig,
      currentStep: 1,
      completedSteps: [],
    }),
}));
