// 🏗️ INITIAL STATE - Booking Store Configuration Factory
import type { TripConfiguration } from '../useBookingState/booking.types';

/**
 * 🎯 Factory function pentru configurația inițială - IMMUTABLE
 * Previne shared references și memory leaks
 */
export const createInitialTripConfiguration = (): TripConfiguration => ({
  // Locații
  pickup: null,
  dropoff: null,
  additionalStops: [],

  // Return Trip Locations
  returnPickup: null,
  returnDropoff: null,
  returnAdditionalStops: [],
  isDifferentReturnLocation: false,

  // Date & Time (legacy + new format)
  pickupDate: null,
  returnDate: null,
  pickupTime: '',
  returnTime: '',
  pickupDateTime: null,
  returnDateTime: null,
  dailyRange: [null, null],

  // Passengers & Logistics
  passengers: 1,
  luggage: 0,
  flightNumberPickup: '',
  flightNumberReturn: '',

  // Booking Type Specific
  hoursRequested: null,
  daysRequested: null,
  customRequirements: '',

  // 🚗 Step 2: Vehicle Selection
  selectedVehicle: {
    category: null,
    model: null,
    selectedAt: null,
  },
});

/**
 * 🎛️ Initial Wizard State
 */
export const initialWizardState = {
  currentStep: 1,
  completedSteps: [] as number[],
  totalSteps: 4,
};
