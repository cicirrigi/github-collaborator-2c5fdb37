// 👥 PASSENGER ACTIONS - Passengers, Luggage & Special Requirements
import type { BookingState } from '../useBookingState/booking.types';

export const createPassengerActions = (
  set: (partial: Partial<BookingState> | ((state: BookingState) => Partial<BookingState>)) => void,
  _get: () => BookingState
) => ({
  // 👤 PASSENGER COUNT
  setPassengers: (value: number) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        passengers: Math.max(1, Math.min(8, value)), // Clamp between 1-8
      },
    })),

  // 🧳 LUGGAGE COUNT
  setLuggage: (value: number) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        luggage: Math.max(0, Math.min(10, value)), // Clamp between 0-10
      },
    })),

  // ✈️ FLIGHT NUMBERS
  setFlightNumberPickup: (value: string) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        flightNumberPickup: value,
      },
    })),

  setFlightNumberReturn: (value: string) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        flightNumberReturn: value,
      },
    })),

  // ⏰ HOURLY BOOKINGS
  setHoursRequested: (value: number | null) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        hoursRequested: value ? Math.max(1, Math.min(24, value)) : null, // Clamp 1-24 hours
      },
    })),

  // 📅 DAILY BOOKINGS
  setDaysRequested: (value: number | null) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        daysRequested: value ? Math.max(1, Math.min(30, value)) : null, // Clamp 1-30 days
      },
    })),

  // 📝 BESPOKE REQUIREMENTS
  setCustomRequirements: (value: string) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        customRequirements: value,
      },
    })),
});

// 🔧 TYPE DEFINITION
export interface PassengerActions {
  setPassengers: (value: number) => void;
  setLuggage: (value: number) => void;
  setFlightNumberPickup: (value: string) => void;
  setFlightNumberReturn: (value: string) => void;
  setHoursRequested: (value: number | null) => void;
  setDaysRequested: (value: number | null) => void;
  setCustomRequirements: (value: string) => void;
}
