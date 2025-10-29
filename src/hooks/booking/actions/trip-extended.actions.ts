/**
 * 🛫 Trip Extended Actions (Clean & Modular)
 * Structured sections, no duplicated logic (<180 lines)
 */

import { BOOKING_CONSTANTS } from '../../../types/booking/index';
import type { BookingStore, TripConfiguration } from '../../../types/booking/index';
import type { GooglePlace } from '../../../components/ui/location-picker/types';

// ================== 🔧 SHARED HELPERS ==================
type ZustandSet = (partial: Partial<BookingStore> | ((state: BookingStore) => Partial<BookingStore>)) => void;
type ZustandGet = () => BookingStore;
type PartialTripConfig = Partial<Pick<TripConfiguration, 'returnFlight' | 'returnDate' | 'returnTime' | 'sameDayReturn' | 'returnAdditionalStops'>>;

// Unified pricing recalculation (eliminates 7x duplication)
const safeRecalculatePricing = (get: ZustandGet) => {
  const { calculatePricing } = get();
  if (typeof calculatePricing === 'function') calculatePricing();
};

// Unified limit calculator (eliminates 3x duplication)  
const getVehicleLimits = (state: BookingStore) => {
  const isFleet = state.tripConfiguration.type === 'fleet' && state.tripConfiguration.fleetSelection.length > 0;
  const model = state.vehicleSelection?.model as { maxPassengers?: number; maxBaggage?: number } | undefined;

  return {
    maxPassengers: isFleet ? BOOKING_CONSTANTS.MAX_PASSENGERS_DEFAULT 
      : model?.maxPassengers || state.limits?.passengers || BOOKING_CONSTANTS.MAX_PASSENGERS_DEFAULT,
    maxBaggage: isFleet ? BOOKING_CONSTANTS.MAX_BAGGAGE_DEFAULT 
      : model?.maxBaggage || state.limits?.baggage || BOOKING_CONSTANTS.MAX_BAGGAGE_DEFAULT,
  };
};

// ================== ✈️ RETURN ACTIONS ==================
const createReturnActions = (set: ZustandSet, get: ZustandGet) => ({
  setReturnFlight: (flightNumber: string) => {
    set((state) => ({
      tripConfiguration: { ...state.tripConfiguration, returnFlight: flightNumber },
      isDirty: true,
    }));
    safeRecalculatePricing(get);
  },

  setReturnAdditionalStops: (stops: GooglePlace[]) => {
    set((state) => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        returnAdditionalStops: stops.slice(0, BOOKING_CONSTANTS.MAX_ADDITIONAL_STOPS),
      },
      isDirty: true,
    }));
    safeRecalculatePricing(get);
  },

  setReturnDetails: (details: PartialTripConfig) => {
    set((state) => ({
      tripConfiguration: { ...state.tripConfiguration, ...details },
      isDirty: true,
    }));
    safeRecalculatePricing(get);
  },
});

// ================== ⏱ HOURLY ACTIONS ==================
const createHourlyActions = (set: ZustandSet, get: ZustandGet) => ({
  setHoursRequested: (hoursInput: number | string) => {
    const hours = Number(hoursInput);
    const state = get();

    if (isNaN(hours) || hours < 1) {
      state.setStepError?.(state.currentStep, 'Invalid hours: must be ≥ 1');
      return;
    }

    const validHours = Math.max(
      BOOKING_CONSTANTS.HOURLY_MIN_HOURS,
      Math.min(BOOKING_CONSTANTS.HOURLY_MAX_HOURS, hours)
    );

    set({
      tripConfiguration: { ...state.tripConfiguration, hoursRequested: validHours },
      isDirty: true,
    });
    safeRecalculatePricing(get);
  },
});

// ================== 👥 PASSENGER & BAGGAGE ACTIONS ==================
const createPassengerActions = (set: ZustandSet, get: ZustandGet) => ({
  setPassengerCount: (count: number) => {
    const state = get();
    const { maxPassengers } = getVehicleLimits(state);
    const valid = Math.max(BOOKING_CONSTANTS.MIN_PASSENGERS, Math.min(maxPassengers, count));

    set({ tripConfiguration: { ...state.tripConfiguration, passengers: valid }, isDirty: true });
    safeRecalculatePricing(get);
  },

  setBaggageCount: (count: number) => {
    const state = get();
    const { maxBaggage } = getVehicleLimits(state);
    const valid = Math.max(BOOKING_CONSTANTS.MIN_BAGGAGE, Math.min(maxBaggage, count));

    set({ tripConfiguration: { ...state.tripConfiguration, baggage: valid }, isDirty: true });
    safeRecalculatePricing(get);
  },

  getMaxPassengersForSelection: () => {
    const state = get();
    return getVehicleLimits(state).maxPassengers;
  },

  getMaxBaggageForSelection: () => {
    const state = get();
    return getVehicleLimits(state).maxBaggage;
  },

  validatePassengerLimits: () => {
    const state = get();
    const { maxPassengers, maxBaggage } = getVehicleLimits(state);
    const updates: Partial<Pick<TripConfiguration, 'passengers' | 'baggage'>> = {};

    if (state.tripConfiguration.passengers > maxPassengers) updates.passengers = maxPassengers;
    if (state.tripConfiguration.baggage > maxBaggage) updates.baggage = maxBaggage;

    const needsUpdate = Object.keys(updates).length > 0;
    if (needsUpdate) {
      set({ tripConfiguration: { ...state.tripConfiguration, ...updates }, isDirty: true });
      state.setStepError?.(state.currentStep, 'Passenger/baggage count adjusted to vehicle limits');
    }

    return !needsUpdate;
  },
});

// ================== 📋 INTERFACE & EXPORTS ==================
export interface TripExtendedActions {
  // Return specific
  setReturnFlight: (flightNumber: string) => void;
  setReturnAdditionalStops: (stops: GooglePlace[]) => void;
<<<<<<< HEAD
=======
  setReturnDetails: (details: PartialTripConfig) => void;
>>>>>>> 252d0b5 (🚀 Major booking system refactor & optimization)

  // Hourly specific  
  setHoursRequested: (hours: number | string) => void;

  // Passenger/Baggage with validation
  setPassengerCount: (count: number) => void;
  setBaggageCount: (count: number) => void;
  getMaxPassengersForSelection: () => number;
  getMaxBaggageForSelection: () => number;
  validatePassengerLimits: () => boolean;
}

<<<<<<< HEAD
export const createTripExtendedActions = (
  set: ZustandSet,
  get: ZustandGet
): TripExtendedActions => ({
  // === RETURN FLIGHT SPECIFIC ===
  setReturnFlight: (flightNumber: string) => {
    set((state: any) => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        returnFlight: flightNumber,
      },
      isDirty: true,
    }));
  },

  setReturnDateTime: (date: Date | null, time: string) => {
    set((state: any) => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        returnDate: date,
        returnTime: time,
      },
      isDirty: true,
    }));
    get().calculatePricing();
  },

  setReturnAdditionalStops: (stops: GooglePlace[]) => {
    set((state: any) => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        returnAdditionalStops: stops.slice(0, BOOKING_CONSTANTS.MAX_ADDITIONAL_STOPS),
      },
      isDirty: true,
    }));
    get().calculatePricing();
  },

  // === HOURLY SPECIFIC ===
  setHoursRequested: (hours: number) => {
    const validHours = Math.max(
      BOOKING_CONSTANTS.HOURLY_MIN_HOURS,
      Math.min(BOOKING_CONSTANTS.HOURLY_MAX_HOURS, hours)
    );

    set((state: any) => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        hoursRequested: validHours,
      },
      isDirty: true,
    }));
    get().calculatePricing();
  },

  // === PASSENGER/BAGGAGE WITH DYNAMIC LIMITS ===
  setPassengerCount: (count: number) => {
    const state = get();
    const maxAllowed = state.limits?.passengers || BOOKING_CONSTANTS.MAX_PASSENGERS_DEFAULT;
    const validCount = Math.max(BOOKING_CONSTANTS.MIN_PASSENGERS, Math.min(maxAllowed, count));

    set((state: any) => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        passengers: validCount,
      },
      isDirty: true,
    }));
  },

  setBaggageCount: (count: number) => {
    const state = get();
    const maxAllowed = state.limits?.baggage || BOOKING_CONSTANTS.MAX_BAGGAGE_DEFAULT;
    const validCount = Math.max(BOOKING_CONSTANTS.MIN_BAGGAGE, Math.min(maxAllowed, count));

    set((state: any) => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        baggage: validCount,
      },
      isDirty: true,
    }));
  },

  getMaxPassengersForSelection: () => {
    const state = get();

    if (
      state.tripConfiguration.type === 'fleet' &&
      state.tripConfiguration.fleetSelection.length > 0
    ) {
      return BOOKING_CONSTANTS.MAX_PASSENGERS_DEFAULT;
    }

    if (state.vehicleSelection?.model) {
      return state.vehicleSelection.model.maxPassengers;
    }

    return state.limits?.passengers || BOOKING_CONSTANTS.MAX_PASSENGERS_DEFAULT;
  },

  getMaxBaggageForSelection: () => {
    const state = get();

    if (
      state.tripConfiguration.type === 'fleet' &&
      state.tripConfiguration.fleetSelection.length > 0
    ) {
      return BOOKING_CONSTANTS.MAX_BAGGAGE_DEFAULT;
    }

    if (state.vehicleSelection?.model) {
      return state.vehicleSelection.model.maxBaggage;
    }

    return state.limits?.baggage || BOOKING_CONSTANTS.MAX_BAGGAGE_DEFAULT;
  },

  validatePassengerLimits: () => {
    const state = get();
    const maxPassengers = state.getMaxPassengersForSelection();
    const maxBaggage = state.getMaxBaggageForSelection();

    let needsUpdate = false;
    const updates: any = {};

    if (state.tripConfiguration.passengers > maxPassengers) {
      updates.passengers = maxPassengers;
      needsUpdate = true;
    }

    if (state.tripConfiguration.baggage > maxBaggage) {
      updates.baggage = maxBaggage;
      needsUpdate = true;
    }

    if (needsUpdate) {
      set((state: any) => ({
        tripConfiguration: {
          ...state.tripConfiguration,
          ...updates,
        },
        isDirty: true,
      }));

      if (state.setStepError) {
        const step = state.currentStep;
        state.setStepError(step, 'Passenger/baggage count adjusted to vehicle limits');
      }
    }

    return !needsUpdate;
  },
=======
// Main factory - combines all action modules
export const createTripExtendedActions = (set: ZustandSet, get: ZustandGet): TripExtendedActions => ({
  ...createReturnActions(set, get),
  ...createHourlyActions(set, get),
  ...createPassengerActions(set, get),
>>>>>>> 252d0b5 (🚀 Major booking system refactor & optimization)
});
