/**
 * 🎨 UI Actions
 */

import type { AuthState, FleetSelection } from '../../../types/booking/index';

import type { BookingStore } from '@/types/booking';

type ZustandSet = (
  partial: Partial<BookingStore> | ((state: BookingStore) => Partial<BookingStore>)
) => void;
type ZustandGet = () => BookingStore;

export interface UIActions {
  // Fleet Modal
  isFleetModalOpen: boolean;
  tempFleetSelection: FleetSelection[];
  openFleetModal: () => void;
  closeFleetModal: () => void;
  confirmFleetSelection: () => void;

  // Loading & Errors
  isLoading: boolean;
  stepErrors: Record<number, string[]>;
  setLoading: (loading: boolean) => void;
  setStepError: (step: number, message: string) => void;
  clearStepError: (step: number) => void;
  clearAllStepErrors: () => void;

  // Auth
  auth: AuthState;
  setAuthState: (auth: AuthState) => void;
  saveSessionBeforeLogin: () => void;
  restoreSessionAfterLogin: () => void;

  // Vehicle Limits
  limits: { passengers: number; baggage: number };
  updateLimitsFromVehicle: () => void;
}

export const createUIActions = (set: ZustandSet, get: ZustandGet): UIActions => ({
  // Fleet Modal
  isFleetModalOpen: false,
  tempFleetSelection: [],

  openFleetModal: () => {
    const state = get();
    set({
      isFleetModalOpen: true,
      tempFleetSelection: [...state.tripConfiguration.fleetSelection],
    });
  },

  closeFleetModal: () => {
    set({
      isFleetModalOpen: false,
      tempFleetSelection: [],
    });
  },

  confirmFleetSelection: () => {
    const state = get();
    set({
      tripConfiguration: {
        ...state.tripConfiguration,
        fleetSelection: state.tempFleetSelection || [],
      },
      isFleetModalOpen: false,
      tempFleetSelection: [],
      isDirty: true,
    });

    // TODO: implement updateLimitsFromVehicle method
    // get().updateLimitsFromVehicle();
    get().calculatePricing();
  },

  // Loading & Errors
  isLoading: false,
  stepErrors: {},

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setStepError: (step: number, message: string) => {
    set((state: BookingStore) => ({
      stepErrors: {
        ...state.stepErrors,
        [step]: [...((state.stepErrors || {})[step] || []), message],
      },
    }));
  },

  clearStepError: (step: number) => {
    set((state: BookingStore) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [step]: _removed, ...rest } = state.stepErrors || {};
      return { stepErrors: rest };
    });
  },

  clearAllStepErrors: () => {
    set({ stepErrors: {} });
  },

  // Auth
  auth: {
    isAuthenticated: false,
    user: null,
    isLoading: false,
  },

  setAuthState: (auth: AuthState) => {
    set({ auth });
  },

  saveSessionBeforeLogin: () => {
    const state = get();
    const sessionData = {
      tripConfiguration: state.tripConfiguration,
      vehicleSelection: state.vehicleSelection,
      services: state.services,
      specialRequests: state.specialRequests,
      currentStep: state.currentStep,
      completedSteps: state.completedSteps,
    };

    localStorage.setItem('pendingBookingState', JSON.stringify(sessionData));
  },

  restoreSessionAfterLogin: () => {
    const data = localStorage.getItem('pendingBookingState');
    if (data) {
      try {
        const sessionData = JSON.parse(data);
        set(sessionData);
        localStorage.removeItem('pendingBookingState');
        get().calculatePricing();
      } catch {
        // Failed to parse session data, remove invalid data
        localStorage.removeItem('pendingBookingState');
      }
    }
  },

  // Vehicle Limits
  limits: { passengers: 8, baggage: 6 },

  updateLimitsFromVehicle: () => {
    const state = get();
    let maxPassengers = 8;
    let maxBaggage = 6;

    if (state.vehicleSelection?.model) {
      maxPassengers = state.vehicleSelection.model.maxPassengers;
      maxBaggage = state.vehicleSelection.model.maxBaggage;
    }

    set({
      limits: {
        passengers: maxPassengers,
        baggage: maxBaggage,
      },
    });

    // TODO: implement validatePassengerLimits method
    // if (state.validatePassengerLimits) {
    //   state.validatePassengerLimits();
    // }
  },
});
