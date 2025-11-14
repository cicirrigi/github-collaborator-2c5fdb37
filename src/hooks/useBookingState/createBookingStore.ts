import { create } from 'zustand';
import type { BookingState, PickupDropoffField, StopPoint, TripConfiguration } from './types';

const initialConfig: TripConfiguration = {
  pickup: null,
  dropoff: null,

  additionalStops: [],

  pickupDate: null,
  returnDate: null,

  pickupTime: '',
  returnTime: '',

  passengers: 1,
  luggage: 0,

  flightNumberPickup: '',
  flightNumberReturn: '',

  hoursRequested: null,
};

export const createBookingStore = create<BookingState>(set => ({
  // BOOKING TYPE (default oneway)
  bookingType: 'oneway',
  setBookingType: type => set({ bookingType: type }),

  // TRIP CONFIGURATION
  tripConfiguration: initialConfig,

  // Basic fields
  setPickup: (location: PickupDropoffField) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        pickup: location,
      },
    })),

  setDropoff: (location: PickupDropoffField) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        dropoff: location,
      },
    })),

  // Stops
  setAdditionalStops: (stops: StopPoint[]) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        additionalStops: stops,
      },
    })),

  // Dates & times
  setPickupDateTime: (date, time) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        pickupDate: date,
        pickupTime: time,
      },
    })),

  setReturnDateTime: (date, time) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        returnDate: date,
        returnTime: time,
      },
    })),

  // Passengers & luggage
  setPassengers: value =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        passengers: value,
      },
    })),

  setLuggage: value =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        luggage: value,
      },
    })),

  // Flight numbers
  setFlightNumberPickup: value =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        flightNumberPickup: value,
      },
    })),

  setFlightNumberReturn: value =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        flightNumberReturn: value,
      },
    })),

  // Hourly
  setHoursRequested: value =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        hoursRequested: value,
      },
    })),

  // 🔥 RESET
  resetTrip: () => set({ tripConfiguration: initialConfig }),
}));
