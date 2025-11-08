/**
 * 🗺️ Trip Basic Actions
 * Locations, trip type, datetime (<200 linii)
 */

import type { TripType, FleetSelection } from '../../../types/booking/index';
import { BOOKING_CONSTANTS } from '../../../types/booking/index';
import type { GooglePlace } from '../../../components/ui/location-picker/types';

import type { BookingStore, BookingActions } from '@/types/booking';

type ZustandSet = (
  partial: Partial<BookingStore> | ((state: BookingStore) => Partial<BookingStore>)
) => void;
type ZustandGet = () => BookingStore & BookingActions;

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

  onTripTypeChange: (_type: TripType) => {
    set({ currentStep: 1 });
    const state = get();
    if (state.completedSteps.length > 0) {
      set({ completedSteps: [] });
    }
    // TODO: Fix clearAllStepErrors method
    // if (get().clearAllStepErrors) {
    //   get().clearAllStepErrors();
    // }
  },

  setTripType: (type: TripType) => {
    // TODO: Fix clearAllStepErrors method
    // if (get().clearAllStepErrors) {
    //   get().clearAllStepErrors();
    // }

    set(
      (state: BookingStore) =>
        ({
          tripConfiguration: {
            ...state.tripConfiguration,
            type,
            ...(type !== 'return' && {
              returnFlight: undefined as string | undefined,
              returnDate: undefined as Date | undefined,
              returnTime: undefined as string | undefined,
              returnAdditionalStops: [] as GooglePlace[],
            }),
            ...(type !== 'hourly' && {
              hoursRequested: undefined as number | undefined,
            }),
            ...(type !== 'fleet' && {
              fleetSelection: [] as FleetSelection[],
              isFleetByHour: false,
            }),
            ...(type === 'hourly' && {
              additionalStops: [] as GooglePlace[],
            }),
          },
          isDirty: true,
        }) as Partial<BookingStore>
    );

    // get().onTripTypeChange(type); // TODO: implement this method
    get().calculatePricing();
  },

  setPickupLocation: (location: GooglePlace | null) => {
    set(
      (state: BookingStore) =>
        ({
          tripConfiguration: {
            ...state.tripConfiguration,
            pickup: location,
          },
          isDirty: true,
        }) as Partial<BookingStore>
    );
    get().calculatePricing();
  },

  setDropoffLocation: (location: GooglePlace | null) => {
    set(
      (state: BookingStore) =>
        ({
          tripConfiguration: {
            ...state.tripConfiguration,
            dropoff: location,
          },
          isDirty: true,
        }) as Partial<BookingStore>
    );
    get().calculatePricing();
  },

  setAdditionalStops: (stops: GooglePlace[]) => {
    set(
      (state: BookingStore) =>
        ({
          tripConfiguration: {
            ...state.tripConfiguration,
            additionalStops: stops.slice(0, BOOKING_CONSTANTS.MAX_ADDITIONAL_STOPS),
          },
          isDirty: true,
        }) as Partial<BookingStore>
    );
    get().calculatePricing();
  },

  setFleetSelection: (selection: FleetSelection[]) => {
    set(
      (state: BookingStore) =>
        ({
          tripConfiguration: {
            ...state.tripConfiguration,
            fleetSelection: selection,
          },
          isDirty: true,
        }) as Partial<BookingStore>
    );

    // TODO: implement these methods
    // get().updateLimitsFromVehicle();
    // get().validatePassengerLimits();
    get().calculatePricing();
  },

  setDateTime: (date: Date | null, time: string) => {
    set(
      (state: BookingStore) =>
        ({
          tripConfiguration: {
            ...state.tripConfiguration,
            pickupDate: date,
            pickupTime: time,
          },
          isDirty: true,
        }) as Partial<BookingStore>
    );
    get().calculatePricing();
  },
});
