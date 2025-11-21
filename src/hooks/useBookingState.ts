import { create } from 'zustand';
import type {
  BookingState,
  BookingType,
  LocationData,
  TripConfiguration,
} from './useBookingState/booking.types';

// 🏗️ INITIAL CONFIGURATION
const initialTripConfiguration: TripConfiguration = {
  pickup: null,
  dropoff: null,
  additionalStops: [],

  returnPickup: null,
  returnDropoff: null,
  returnAdditionalStops: [],
  isDifferentReturnLocation: false,

  pickupDate: null,
  returnDate: null,
  pickupTime: '',
  returnTime: '',

  pickupDateTime: null,
  returnDateTime: null,

  dailyRange: [null, null],

  passengers: 1,
  luggage: 0,
  flightNumberPickup: '',
  flightNumberReturn: '',

  hoursRequested: null,
  daysRequested: null,
  customRequirements: '',
};

// 🚀 UNIFIED BOOKING STORE
export const useBookingState = create<BookingState>((set, get) => ({
  // BOOKING TYPE
  bookingType: 'oneway',
  setBookingType: (type: BookingType) => set({ bookingType: type }),

  // TRIP CONFIGURATION
  tripConfiguration: initialTripConfiguration,

  // WIZARD STATE
  currentStep: 1,
  completedSteps: [],
  totalSteps: 4,

  // LOCATION ACTIONS
  setPickup: (location: LocationData | null) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        pickup: location,
      },
    })),

  setDropoff: (location: LocationData | null) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        dropoff: location,
      },
    })),

  setAdditionalStops: (stops: LocationData[]) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        additionalStops: stops,
      },
    })),

  // Return Trip Actions
  setReturnPickup: (location: LocationData | null) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        returnPickup: location,
      },
    })),

  setReturnDropoff: (location: LocationData | null) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        returnDropoff: location,
      },
    })),

  setReturnAdditionalStops: (stops: LocationData[]) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        returnAdditionalStops: stops,
      },
    })),

  setIsDifferentReturnLocation: (value: boolean) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        isDifferentReturnLocation: value,
      },
    })),

  // DATE & TIME ACTIONS (simplified)
  setPickupDateTime: (date: Date | null) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        pickupDateTime: date,
      },
    })),

  setReturnDateTime: (date: Date | null) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        returnDateTime: date,
      },
    })),

  setDailyRange: (range: [Date | null, Date | null]) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        dailyRange: range,
      },
    })),

  // PASSENGER & LOGISTICS ACTIONS
  setPassengers: (value: number) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        passengers: Math.max(1, value), // Minimum 1 passenger
      },
    })),

  setLuggage: (value: number) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        luggage: Math.max(0, value), // Minimum 0 luggage
      },
    })),

  setFlightNumberPickup: (value: string) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        flightNumberPickup: value,
      },
    })),

  setFlightNumberReturn: (value: string) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        flightNumberReturn: value,
      },
    })),

  setHoursRequested: (value: number | null) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        hoursRequested: value,
      },
    })),

  setDaysRequested: (value: number | null) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        daysRequested: value,
      },
    })),

  setCustomRequirements: (value: string) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        customRequirements: value,
      },
    })),

  // WIZARD ACTIONS
  setCurrentStep: (step: number) => {
    const { totalSteps } = get();
    if (step >= 1 && step <= totalSteps) {
      set({ currentStep: step });
    }
  },

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
    const { currentStep, tripConfiguration } = get();

    switch (currentStep) {
      case 1:
        // Step 1: Basic trip info
        return tripConfiguration.pickup !== null;
      case 2:
        // Step 2: Services (basic validation)
        return true;
      case 3:
        // Step 3: Payment info
        return true;
      case 4:
        // Step 4: Confirmation
        return true;
      default:
        return false;
    }
  },

  resetTrip: () =>
    set({
      bookingType: 'oneway',
      tripConfiguration: initialTripConfiguration,
      currentStep: 1,
      completedSteps: [],
    }),

  // UTILITY ACTIONS
  calculateEstimatedDistanceAndTime: () => {
    // Dummy implementation - no actual API calls yet
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
}));

// 🔧 RE-EXPORTS FROM TYPES
export type {
  BookingType,
  LocationData,
  PickupDropoffField,
  StopPoint,
  TripConfiguration,
} from './useBookingState/booking.types';
