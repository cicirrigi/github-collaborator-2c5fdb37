/**
 * 🗃️ Booking State Management
 * Main Zustand store - clean și modular (<100 linii)
 */

'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BookingStore } from '@/types/booking';
import { getInitialTripConfiguration, validateStep } from '@/lib/booking';
import { createBookingActions } from './booking/booking.actions';
import { bookingPersistConfig } from './booking/booking.config';

export const useBookingState = create<BookingStore>()(
  persist(
    (set, get) => ({
      // === BASE STATE ===
      currentStep: 1,
      completedSteps: [],
      tripConfiguration: getInitialTripConfiguration(),
      vehicleSelection: undefined,
      services: [],
      specialRequests: [],
      paymentDetails: undefined,
      pricing: undefined,
      isValid: false,
      isDirty: false,
      lastSaved: undefined,

      // === COMPUTED PROPERTIES ===
      canProceedToStep: (step: number) => {
        const state = get();
        const currentStep = state.currentStep;

        // Nu poți sări pași înainte
        if (step > currentStep + 1) return false;

        // Poți reveni la pași anteriori
        if (step <= currentStep) return true;

        // Pentru următorul pas, verifică validarea
        return validateStep(currentStep, state);
      },

      // === ACTIONS (imported from actions module) ===
      ...createBookingActions(set, get),
    }),
    bookingPersistConfig
  )
);
