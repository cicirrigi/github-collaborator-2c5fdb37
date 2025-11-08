export interface TripActionPayload<T = unknown> {
  type: string;
  payload?: T;
}

export type TripActionHandler = (payload: TripActionPayload) => void;

import type { TripType } from '../../../types/booking';

export interface TripActions {
  setTripType: (type: TripType) => void;
}

import type { BookingStore } from '@/types/booking';

type ZustandSet = (
  partial: Partial<BookingStore> | ((state: BookingStore) => Partial<BookingStore>)
) => void;
type ZustandGet = () => BookingStore;

export const createTripActions = (set: ZustandSet, _get: ZustandGet): TripActions => ({
  setTripType: (type: TripType) => {
    set(
      (state: BookingStore) =>
        ({
          tripConfiguration: {
            ...state.tripConfiguration,
            type,
          },
        }) as Partial<BookingStore>
    );
  },
});
