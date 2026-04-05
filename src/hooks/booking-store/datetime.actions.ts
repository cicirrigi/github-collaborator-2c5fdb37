// 🕐 DATETIME ACTIONS - Date & Time Management
import type { BookingState } from '../useBookingState/booking.types';

export const createDateTimeActions = (
  set: (partial: Partial<BookingState> | ((state: BookingState) => Partial<BookingState>)) => void,
  _get: () => BookingState
) => ({
  // 📅 PICKUP DATE & TIME
  setPickupDateTime: (dateTime: Date | null) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        pickupDateTime: dateTime,
        // Legacy compatibility
        pickupDate: dateTime,
        pickupTime: dateTime ? dateTime.toTimeString().slice(0, 5) : '',
      },
      // Invalidate quote when pickup datetime changes
      quoteStatus: 'stale',
    })),

  // 🔄 RETURN DATE & TIME
  setReturnDateTime: (dateTime: Date | null) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        returnDateTime: dateTime,
        // Legacy compatibility
        returnDate: dateTime,
        returnTime: dateTime ? dateTime.toTimeString().slice(0, 5) : '',
      },
      // Invalidate quote when return datetime changes
      quoteStatus: 'stale',
    })),

  // 📊 DAILY RANGE (for multi-day bookings)
  setDailyRange: (range: [Date | null, Date | null]) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        dailyRange: range,
      },
      // Invalidate quote when daily range changes
      quoteStatus: 'stale',
    })),

  // 🕒 LEGACY DATE SETTERS (for backward compatibility)
  setPickupDate: (date: Date | null) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        pickupDate: date,
      },
    })),

  setReturnDate: (date: Date | null) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        returnDate: date,
      },
    })),

  setPickupTime: (time: string) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        pickupTime: time,
      },
    })),

  setReturnTime: (time: string) =>
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        returnTime: time,
      },
    })),
});

// 🔧 TYPE DEFINITION
export interface DateTimeActions {
  setPickupDateTime: (dateTime: Date | null) => void;
  setReturnDateTime: (dateTime: Date | null) => void;
  setDailyRange: (range: [Date | null, Date | null]) => void;
  setPickupDate: (date: Date | null) => void;
  setReturnDate: (date: Date | null) => void;
  setPickupTime: (time: string) => void;
  setReturnTime: (time: string) => void;
}
