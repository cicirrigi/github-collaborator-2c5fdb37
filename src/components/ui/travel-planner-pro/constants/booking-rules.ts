/**
 * 📋 Booking Rules - Conditional Logic pentru Step 1
 * Controlează vizibilitatea și validarea pentru fiecare tip de booking
 */

import type { BookingTabType } from '@/components/ui/booking-tabs-pro/types';

export interface BookingRule {
  /** Afișează calendar cu range selection */
  showReturn: boolean;
  /** Afișează dual time selection (departure + return) */
  showDualTime: boolean;
  /** Afișează stops counter */
  showStops: boolean;
  /** Afișează duration selector (pentru hourly) */
  showDuration: boolean;
  /** Drop-off devine opțional */
  dropoffOptional: boolean;
  /** Câmpuri obligatorii pentru validare */
  requiredFields: string[];
}

/**
 * Reguli pentru fiecare tip de booking
 */
export const BOOKING_RULES: Record<BookingTabType, BookingRule> = {
  oneway: {
    showReturn: false,
    showDualTime: false,
    showStops: true,
    showDuration: false,
    dropoffOptional: false,
    requiredFields: ['pickup', 'dropoff', 'pickupDate', 'pickupTime']
  },
  
  return: {
    showReturn: true,
    showDualTime: true,
    showStops: true,
    showDuration: false,
    dropoffOptional: false,
    requiredFields: ['pickup', 'dropoff', 'pickupDate', 'returnDate', 'pickupTime', 'returnTime']
  },
  
  hourly: {
    showReturn: false,
    showDualTime: false,
    showStops: false,
    showDuration: true,
    dropoffOptional: true,
    requiredFields: ['pickup', 'pickupDate', 'pickupTime', 'duration']
  },
  
  fleet: {
    showReturn: false,
    showDualTime: false,
    showStops: false,
    showDuration: false,
    dropoffOptional: false,
    requiredFields: ['pickup', 'dropoff', 'pickupDate', 'pickupTime']
  }
} as const;

/**
 * Helper pentru a obține regula unui booking type
 */
export const getBookingRule = (bookingType: BookingTabType): BookingRule => {
  return BOOKING_RULES[bookingType];
};

/**
 * Helper pentru validarea câmpurilor obligatorii (UI conditional rendering)
 */
export const validateBookingRequiredFields = (
  bookingType: BookingTabType, 
  data: Record<string, unknown>
): boolean => {
  const rule = getBookingRule(bookingType);
  return rule.requiredFields.every(field => Boolean(data[field]));
};
