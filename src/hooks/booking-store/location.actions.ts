// 📍 LOCATION ACTIONS - Pickup, Dropoff, Stops Management
import type { BookingState, LocationData } from '../useBookingState/booking.types';

export const createLocationActions = (
  set: (partial: Partial<BookingState> | ((state: BookingState) => Partial<BookingState>)) => void,
  _get: () => BookingState
) => ({
  // 🎯 PRIMARY TRIP LOCATIONS
  setPickup: (location: LocationData | null) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        pickup: location,
      },
      // FIX 9: Invalidate quote when pickup changes
      quoteStatus: 'stale',
    })),

  setDropoff: (location: LocationData | null) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        dropoff: location,
      },
      // FIX 9: Invalidate quote when dropoff changes
      quoteStatus: 'stale',
    })),

  setAdditionalStops: (stops: LocationData[]) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        additionalStops: stops,
      },
      // FIX 9: Invalidate quote when stops change
      quoteStatus: 'stale',
    })),

  // 🔄 RETURN TRIP LOCATIONS
  setReturnPickup: (location: LocationData | null) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        returnPickup: location,
      },
      // FIX 9: Invalidate quote when return pickup changes
      quoteStatus: 'stale',
    })),

  setReturnDropoff: (location: LocationData | null) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        returnDropoff: location,
      },
      // FIX 9: Invalidate quote when return dropoff changes
      quoteStatus: 'stale',
    })),

  setReturnAdditionalStops: (stops: LocationData[]) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        returnAdditionalStops: stops,
      },
      // FIX 9: Invalidate quote when return stops change
      quoteStatus: 'stale',
    })),

  setIsDifferentReturnLocation: (isDifferent: boolean) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        isDifferentReturnLocation: isDifferent,
      },
    })),
});

// 🔧 TYPE DEFINITION
export interface LocationActions {
  setPickup: (location: LocationData | null) => void;
  setDropoff: (location: LocationData | null) => void;
  setAdditionalStops: (stops: LocationData[]) => void;
  setReturnPickup: (location: LocationData | null) => void;
  setReturnDropoff: (location: LocationData | null) => void;
  setReturnAdditionalStops: (stops: LocationData[]) => void;
  setIsDifferentReturnLocation: (isDifferent: boolean) => void;
}
