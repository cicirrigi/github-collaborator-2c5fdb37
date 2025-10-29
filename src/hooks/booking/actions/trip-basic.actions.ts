/**
 * 🗺️ Trip Basic Actions
 * Locations, trip type, datetime (<200 linii)
 */

import type { TripType, TripConfiguration, FleetSelection } from '../../../types/booking/index';
import { BOOKING_CONSTANTS } from '../../../types/booking/index';
import type { GooglePlace } from '../../../components/ui/location-picker/types';

type ZustandSet = (partial: any) => void;
type ZustandGet = () => any;

export interface TripBasicActions {
  activeTripType: () => TripType;
  setTripType: (type: TripType) => void;
  onTripTypeChange: (type: TripType) => void;
  setPickupLocation: (location: GooglePlace | null) => void;
  setDropoffLocation: (location: GooglePlace | null) => void;
  setAdditionalStops: (stops: GooglePlace[]) => void;
  setFleetSelection: (selection: FleetSelection[]) => void;
  setDateTime: (date: Date | null, time: string) => void;
}

export const createTripBasicActions = (set: ZustandSet, get: ZustandGet): TripBasicActions => ({
  activeTripType: () => {
    const state = get();
    return state.tripConfiguration.type;
  },

  onTripTypeChange: (type: TripType) => {
    set({ currentStep: 1 });
    const state = get();
    if (state.completedSteps.length > 0) {
      set({ completedSteps: [] });
    }
    if (get().clearAllStepErrors) {
      get().clearAllStepErrors();
    }
  },

  setTripType: (type: TripType) => {
    if (get().clearAllStepErrors) {
      get().clearAllStepErrors();
    }

    set((state: any) => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        type,
        ...(type !== 'return' && {
          returnFlight: undefined,
          returnDate: undefined,
          returnTime: undefined,
          returnAdditionalStops: [],
        }),
        ...(type !== 'hourly' && {
          hoursRequested: undefined,
        }),
        ...(type !== 'fleet' && {
          fleetSelection: [],
          isFleetByHour: false,
        }),
        ...(type === 'hourly' && {
          additionalStops: [],
        }),
      },
      isDirty: true,
    }));

    get().onTripTypeChange(type);
    get().calculatePricing();
  },

  setPickupLocation: (location: GooglePlace | null) => {
    set((state: any) => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        pickup: location,
      },
      isDirty: true,
    }));
    get().calculatePricing();
  },

  setDropoffLocation: (location: GooglePlace | null) => {
    set((state: any) => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        dropoff: location,
      },
      isDirty: true,
    }));
    get().calculatePricing();
  },

  setAdditionalStops: (stops: GooglePlace[]) => {
    set((state: any) => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        additionalStops: stops.slice(0, BOOKING_CONSTANTS.MAX_ADDITIONAL_STOPS),
      },
      isDirty: true,
    }));
    get().calculatePricing();
  },

  setFleetSelection: (selection: FleetSelection[]) => {
    set((state: any) => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        fleetSelection: selection,
      },
      isDirty: true,
    }));

    get().updateLimitsFromVehicle();
    get().validatePassengerLimits();
    get().calculatePricing();
  },

  setDateTime: (date: Date | null, time: string) => {
    set((state: any) => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        pickupDate: date,
        pickupTime: time,
      },
      isDirty: true,
    }));
    get().calculatePricing();
  },
});
