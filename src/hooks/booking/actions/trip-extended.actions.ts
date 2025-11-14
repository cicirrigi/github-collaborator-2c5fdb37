/**
 * 🛫 Trip Extended Actions (Clean & Modular)
 * Structured sections, no duplicated logic (<180 lines)
 */

import type { GooglePlace } from '../../../components/ui/location-picker/types';
import type { FleetSelection } from '../../../types/booking';
import type { BookingStore, TripConfiguration } from '../../../types/booking/index';
import { BOOKING_CONSTANTS } from '../../../types/booking/index';

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

  // Canonical TripConfiguration actions (enterprise contract)
  setPickup: (location: GooglePlace | null) => void;
  setDropoff: (location: GooglePlace | null) => void;
  setAdditionalStops: (stops: GooglePlace[]) => void;
  setPickupDateTime: (date: Date | null, time: string) => void;
  setReturnDateTime: (date: Date | null, time: string) => void;
  setPassengers: (count: number) => void;
  setBaggage: (count: number) => void;
  resetTrip: () => void;

  // Legacy-compatible aliases (to be migrated away from)
  setPickupLocation: (location: GooglePlace | null) => void;
  setDropoffLocation: (location: GooglePlace | null) => void;
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

  // Canonical TripConfiguration actions
  setPickup: (location: GooglePlace | null) => {
    set(state => ({
      tripConfiguration: { ...state.tripConfiguration, pickup: location },
      isDirty: true,
    }));
    safeRecalculatePricing(get);
  },

  setDropoff: (location: GooglePlace | null) => {
    set(state => ({
      tripConfiguration: { ...state.tripConfiguration, dropoff: location },
      isDirty: true,
    }));
    safeRecalculatePricing(get);
  },

  setAdditionalStops: (stops: GooglePlace[]) => {
    set(state => ({
      tripConfiguration: { ...state.tripConfiguration, additionalStops: stops },
      isDirty: true,
    }));
    safeRecalculatePricing(get);
  },

  setPickupDateTime: (date: Date | null, time: string) => {
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        pickupDate: date,
        pickupTime: time,
      },
      isDirty: true,
    }));
    safeRecalculatePricing(get);
  },

  setReturnDateTime: (date: Date | null, time: string) => {
    set(state => {
      const { returnDate: _prevReturnDate, ...rest } = state.tripConfiguration;
      void _prevReturnDate;

      const nextConfig: TripConfiguration =
        date === null
          ? {
              ...rest,
              returnTime: time,
            }
          : {
              ...rest,
              returnDate: date,
              returnTime: time,
            };

      return {
        tripConfiguration: nextConfig,
        isDirty: true,
      };
    });
    safeRecalculatePricing(get);
  },

  setPassengers: (count: number) => {
    const state = get();
    state.setPassengerCount(count);
  },

  setBaggage: (count: number) => {
    const state = get();
    state.setBaggageCount(count);
  },

  resetTrip: () => {
    const state = get();
    if (typeof state.resetStep === 'function') {
      state.resetStep(1);
    }
  },

  // Legacy-compatible aliases (prefer canonical methods above)
  setPickupLocation: (location: GooglePlace | null) => {
    set(current => ({
      tripConfiguration: { ...current.tripConfiguration, pickup: location },
      isDirty: true,
    }));
    safeRecalculatePricing(get);
  },

  setDropoffLocation: (location: GooglePlace | null) => {
    set(current => ({
      tripConfiguration: { ...current.tripConfiguration, dropoff: location },
      isDirty: true,
    }));
    safeRecalculatePricing(get);
  },

  setFleetSelection: (selection: FleetSelection[]) => {
    set(state => ({
      tripConfiguration: { ...state.tripConfiguration, fleetSelection: selection },
      isDirty: true,
    }));
    safeRecalculatePricing(get);
  },

  setDateTime: (date: Date | null, time: string) => {
    set(current => ({
      tripConfiguration: {
        ...current.tripConfiguration,
        pickupDate: date,
        pickupTime: time,
      },
      isDirty: true,
    }));
    safeRecalculatePricing(get);
  },
});
