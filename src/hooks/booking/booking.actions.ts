/**
 * 🎬 Booking Actions - Main Combiner
 * Combină toate modules sub 50 linii
 */

import type { BookingStore } from '../../types/booking/index';
import { createNavigationActions, type NavigationActions } from './actions/navigation.actions';
import { createUIActions, type UIActions } from './actions/ui.actions';
import { createTripActions, type TripActions } from './actions/trip.actions';
import { createTripExtendedActions, type TripExtendedActions } from './actions/trip-extended.actions';
import { createVehicleActions, type VehicleActions } from './actions/vehicle.actions';
import { createUtilityActions, type UtilityActions } from './actions/utility.actions';

// Zustand types
type ZustandSet = (partial: Partial<BookingStore> | ((state: BookingStore) => Partial<BookingStore>)) => void;
type ZustandGet = () => BookingStore;

// Combined type
export type BookingActionsMethods = NavigationActions &
  UIActions &
  TripActions &
  TripExtendedActions &
  VehicleActions &
  UtilityActions;

// Main factory cu type safety
export const createBookingActions = (set: ZustandSet, get: ZustandGet): BookingActionsMethods => ({
  // Combine all modules
  ...createNavigationActions(set, get),
  ...createUIActions(set, get),
  ...createTripActions(set, get),
  ...createTripExtendedActions(set, get),
  ...createVehicleActions(set, get),
  ...createUtilityActions(set, get),
});
