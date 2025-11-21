import { create } from 'zustand';
import type {
  BookingState,
  PickupDropoffField,
  StopPoint,
  TripConfiguration,
} from './booking.types';

const initialConfig: TripConfiguration = {
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

  // Return Trip Actions
  setReturnPickup: (location: PickupDropoffField) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        returnPickup: location,
      },
    })),

  setReturnDropoff: (location: PickupDropoffField) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        returnDropoff: location,
      },
    })),

  setReturnAdditionalStops: (stops: StopPoint[]) =>
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

  // Dates & times
  setPickupDateTime: (date: Date | null) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        pickupDate: date,
        pickupTime: date
          ? date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
          : '',
        pickupDateTime: date, // Sync unified format
      },
    })),

  setReturnDateTime: (date: Date | null) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        returnDate: date,
        returnTime: date
          ? date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
          : '',
        returnDateTime: date, // Sync unified format
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

  // Daily
  setDaysRequested: (value: number | null) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        daysRequested: value,
      },
    })),

  // Bespoke
  setCustomRequirements: (value: string) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        customRequirements: value,
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

  // Daily range for daily bookings
  setDailyRange: (range: [Date | null, Date | null]) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        dailyRange: range,
      },
    })),

  // UTILITY ACTIONS
  calculateEstimatedDistanceAndTime: () => {
    // Mock calculation - can be implemented with Google Maps API later
    return { distanceKm: 25, durationMinutes: 35 };
  },

  // 🔥 RESET
  resetTrip: () =>
    set({
      tripConfiguration: initialConfig,
      currentStep: 1,
      completedSteps: [],
    }),
}));
