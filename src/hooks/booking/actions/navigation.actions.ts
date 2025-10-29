/**
 * 🧭 Navigation Actions
 */

import type { BookingStore } from '../../../types/booking/index';

type ZustandSet = (partial: any) => void;
type ZustandGet = () => BookingStore;

export interface NavigationActions {
  totalSteps: number;
  goToStep: (step: number) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  completeStep: (step: number) => void;
}

export const createNavigationActions = (set: ZustandSet, get: ZustandGet): NavigationActions => ({
  totalSteps: 5,

  goToStep: (step: number) => {
    const state = get();
    if (state.canProceedToStep(step)) {
      set({ currentStep: step });
    }
  },

  setCurrentStep: (step: number) => {
    const state = get();
    if (state.canProceedToStep(step)) {
      set({ currentStep: step });
    }
  },

  nextStep: () => {
    const state = get();
    const nextStep = state.currentStep + 1;
    if (state.canProceedToStep(nextStep)) {
      set({
        currentStep: nextStep,
        completedSteps: [...new Set([...state.completedSteps, state.currentStep])],
      });
    }
  },

  prevStep: () => {
    const state = get();
    const prevStep = Math.max(1, state.currentStep - 1);
    set({ currentStep: prevStep });
  },

  completeStep: (step: number) => {
    set((state: BookingStore) => ({
      completedSteps: [...new Set([...state.completedSteps, step])],
    }));
  },
});
