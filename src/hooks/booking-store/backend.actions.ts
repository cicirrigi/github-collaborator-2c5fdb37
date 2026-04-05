// 🆕 BACKEND INTEGRATION ACTIONS - Quote & Booking Management
import type { BookingState, QuoteResponse } from '../useBookingState/booking.types';

export const createBackendActions = (
  set: (partial: Partial<BookingState> | ((state: BookingState) => Partial<BookingState>)) => void,
  _get: () => BookingState
) => ({
  /**
   * Save quote data from backend response
   * Also resets bookingId since old booking is invalid for new quote
   */
  setQuoteData: (quoteId: string, response: QuoteResponse) => {
    console.log('📋 setQuoteData called - setting quoteStatus to READY', { quoteId });
    set({
      quoteId,
      quoteResponse: response,
      bookingId: null, // Reset booking when new quote is created
      quoteStatus: 'ready',
    });
    console.log('✅ quoteStatus set to READY');
  },

  /**
   * Save booking ID after conversion
   */
  setBookingId: (bookingId: string) => {
    set({ bookingId });
  },

  /**
   * Clear quote and booking data (e.g., when starting new booking)
   */
  clearQuoteAndBooking: () => {
    set({
      quoteId: null,
      bookingId: null,
      quoteResponse: null,
      quoteStatus: 'idle',
    });
  },
});
