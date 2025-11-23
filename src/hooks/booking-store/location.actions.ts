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
    })),

  setDropoff: (location: LocationData | null) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        dropoff: location,
      },
    })),

  setAdditionalStops: (stops: LocationData[]) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        additionalStops: stops,
      },
    })),

  // 🔄 RETURN TRIP LOCATIONS
  setReturnPickup: (location: LocationData | null) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        returnPickup: location,
      },
    })),

  setReturnDropoff: (location: LocationData | null) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        returnDropoff: location,
      },
    })),

  setReturnAdditionalStops: (stops: LocationData[]) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        returnAdditionalStops: stops,
      },
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
