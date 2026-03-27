// 🎛️ MODULAR BOOKING STORE - Enterprise Split Architecture
import { create } from 'zustand';
import type { BookingState } from '../useBookingState/booking.types';
import {
  createInitialPricingState,
  createInitialTripConfiguration,
  initialWizardState,
  initialBackendState,
} from './initialState';

// Import individual action creators
import { createBookingActions } from './booking.actions';
import { createDateTimeActions } from './datetime.actions';
import { createFleetActions } from './fleet.actions';
import { createLocationActions } from './location.actions';
import { createPassengerActions } from './passenger.actions';
import { createValidationActions } from './validation';
import { createVehicleActions } from './vehicle.actions';
// Step 2 Service Package Actions
import { createPreferencesActions } from './preferences.actions';
import { createServicesActions } from './services.actions';
import { createUpgradesActions } from './upgrades.actions';
// Pricing Actions
import { createPricingActions } from './pricing.actions';
// Backend Integration Actions
import { createBackendActions } from './backend.actions';

/**
 * 🚀 MODULAR BOOKING STORE - Enterprise Architecture
 *
 * Combines all action modules into a single store while maintaining
 * clean separation of concerns and manageable file sizes.
 */
export const useBookingState = create<BookingState>((set, get) => ({
  // 🏗️ INITIAL STATE
  bookingType: 'oneway',
  tripConfiguration: createInitialTripConfiguration(),
  pricingState: createInitialPricingState(),
  ...initialWizardState,
  ...initialBackendState,

  // 🎯 BOOKING & STEPPER ACTIONS
  ...createBookingActions(set, get),

  // 📍 LOCATION ACTIONS
  ...createLocationActions(set, get),

  // 🕐 DATE & TIME ACTIONS
  ...createDateTimeActions(set, get),

  // 👥 PASSENGER & LOGISTICS ACTIONS
  ...createPassengerActions(set, get),

  // 🚗 VEHICLE SELECTION ACTIONS (single vehicle)
  ...createVehicleActions(set, get),

  // 🚛 FLEET SELECTION ACTIONS (multiple vehicles)
  ...createFleetActions(set, get),

  // 🎁 STEP 2: SERVICE PACKAGE ACTIONS
  ...createServicesActions(set, get),
  ...createPreferencesActions(set, get),
  ...createUpgradesActions(set, get),

  // 💰 PRICING ACTIONS
  ...createPricingActions(set, get),

  // 🆕 BACKEND INTEGRATION ACTIONS
  ...createBackendActions(set, get),

  // ✅ VALIDATION & UTILITY ACTIONS
  ...createValidationActions(set, get),
}));

// 🔧 RE-EXPORT ALL TYPES for easy access
export type {
  BookingType,
  LocationData,
  PickupDropoffField,
  SingleBooking,
  StopPoint,
  TripConfiguration,
  VehicleCategory,
  VehicleModel,
  VehicleSelection,
} from '../useBookingState/booking.types';
