export interface TripActionPayload {
  type: string;
  payload?: any;
}

export type TripActionHandler = (payload: TripActionPayload) => void;

export interface TripActions {
  setTripType: (type: string) => void;
}

export const createTripActions = (set: any, _get: any): TripActions => ({
  setTripType: (type: string) => {
    set((state: any) => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        type,
      },
    }));
  },
});
