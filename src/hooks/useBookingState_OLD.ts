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
      vehicleSelection: null,
      services: [],
      specialRequests: [],
      paymentDetails: null,
      pricing: null,
      isValid: false,
      isDirty: false,
      lastSaved: null,

      // === COMPUTED PROPERTIES ===
      canProceedToStep: (step: number) => {
        const state = get();
        const currentStep = state.currentStep;

        // Nu poți sări pași înainte
        if (step > currentStep + 1) return false;

        // Poți reveni la pași anteriori
        if (step <= currentStep) return true;

        // Pentru următorul pas, verifică validarea
        const validation = validateStep(currentStep, state);
        return typeof validation === 'boolean' ? validation : validation.isValid;
      },

      // === ACTIONS (imported from actions module) ===
      ...createBookingActions(set, get),
    }),
    bookingPersistConfig
  )
);
