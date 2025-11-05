/**
 * 🛫 Trip Extended Actions (Clean & Modular)
 * Structured sections, no duplicated logic (<180 lines)
 */

import { BOOKING_CONSTANTS } from '../../../types/booking/index';
import type { BookingStore, TripConfiguration } from '../../../types/booking/index';
import type { GooglePlace } from '../../../components/ui/location-picker/types';
import type { FleetSelection } from '../../../types/booking';

// ================== 🔧 SHARED HELPERS ==================
type ZustandSet = (
  partial: Partial<BookingStore> | ((state: BookingStore) => Partial<BookingStore>)
) => void;
type ZustandGet = () => BookingStore;
type PartialTripConfig = Partial<
  Pick<
    TripConfiguration,
    'returnFlight' | 'returnDate' | 'returnTime' | 'sameDayReturn' | 'returnAdditionalStops'
  >
>;

// Unified pricing recalculation (eliminates 7x duplication)
const safeRecalculatePricing = (get: ZustandGet) => {
  const { calculatePricing } = get();
  if (typeof calculatePricing === 'function') calculatePricing();
};

// Unified limit calculator (eliminates 3x duplication)
const getVehicleLimits = (state: BookingStore) => {
  const isFleet =
    state.tripConfiguration.type === 'fleet' && state.tripConfiguration.fleetSelection.length > 0;
  const model = state.vehicleSelection?.model as
    | { maxPassengers?: number; maxBaggage?: number }
    | undefined;

  return {
    maxPassengers: isFleet
      ? BOOKING_CONSTANTS.MAX_PASSENGERS_DEFAULT
      : model?.maxPassengers ||
        state.limits?.passengers ||
        BOOKING_CONSTANTS.MAX_PASSENGERS_DEFAULT,
    maxBaggage: isFleet
      ? BOOKING_CONSTANTS.MAX_BAGGAGE_DEFAULT
      : model?.maxBaggage || state.limits?.baggage || BOOKING_CONSTANTS.MAX_BAGGAGE_DEFAULT,
  };
};

// ================== ✈️ RETURN ACTIONS ==================
const createReturnActions = (set: ZustandSet, get: ZustandGet) => ({
  setReturnFlight: (flightNumber: string) => {
    set(state => ({
      tripConfiguration: { ...state.tripConfiguration, returnFlight: flightNumber },
      isDirty: true,
    }));
    safeRecalculatePricing(get);
  },

  setReturnAdditionalStops: (stops: GooglePlace[]) => {
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        returnAdditionalStops: stops.slice(0, BOOKING_CONSTANTS.MAX_ADDITIONAL_STOPS),
      },
      isDirty: true,
    }));
    safeRecalculatePricing(get);
  },

  setReturnDetails: (details: PartialTripConfig) => {
    set(state => ({
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
  setReturnDetails: (details: PartialTripConfig) => void;

  // Hourly specific
  setHoursRequested: (hours: number | string) => void;

  // Passenger/Baggage with validation
  setPassengerCount: (count: number) => void;
  setBaggageCount: (count: number) => void;
  getMaxPassengersForSelection: () => number;
  getMaxBaggageForSelection: () => number;
  validatePassengerLimits: () => boolean;

  // Missing BookingActions methods (TODO: move to proper modules)
  setPickupLocation: (location: GooglePlace | null) => void;
  setDropoffLocation: (location: GooglePlace | null) => void;
  setAdditionalStops: (stops: GooglePlace[]) => void;
  setFleetSelection: (selection: FleetSelection[]) => void;
  setDateTime: (date: Date | null, time: string) => void;
}

// Main factory - combines all action modules
export const createTripExtendedActions = (
  set: ZustandSet,
  get: ZustandGet
): TripExtendedActions => ({
  ...createReturnActions(set, get),
  ...createHourlyActions(set, get),
  ...createPassengerActions(set, get),

  // TODO: Implement missing BookingActions methods properly
  setPickupLocation: (location: GooglePlace | null) => {
    set(state => ({
      tripConfiguration: { ...state.tripConfiguration, pickupLocation: location },
      isDirty: true,
    }));
  },
  setDropoffLocation: (location: GooglePlace | null) => {
    set(state => ({
      tripConfiguration: { ...state.tripConfiguration, dropoffLocation: location },
      isDirty: true,
    }));
  },
  setAdditionalStops: (stops: GooglePlace[]) => {
    set(state => ({
      tripConfiguration: { ...state.tripConfiguration, additionalStops: stops },
      isDirty: true,
    }));
  },
  setFleetSelection: (selection: FleetSelection[]) => {
    set(state => ({
      tripConfiguration: { ...state.tripConfiguration, fleetSelection: selection },
      isDirty: true,
    }));
  },
  setDateTime: (date: Date | null, time: string) => {
    set(state => ({
      tripConfiguration: { ...state.tripConfiguration, date, time },
      isDirty: true,
    }));
  },
});
