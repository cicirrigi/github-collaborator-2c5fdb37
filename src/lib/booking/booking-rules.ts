/**
 * � BOOKING RULES ENTERPRISE v3.0 - Single Source of Truth
 * Controlează Step 1 complet: UI visibility + validation + field mapping
 */

import type { TripConfiguration } from '@/hooks/useBookingState/types';

export type BookingType = 'oneway' | 'return' | 'hourly' | 'fleet';

/**
 * 🔑 Field IDs derivate STRICT din TripConfiguration (zero mismatch!)
 */
export type Step1FieldId = keyof Pick<
  TripConfiguration,
  | 'pickup'
  | 'dropoff'
  | 'pickupDate'
  | 'returnDate'
  | 'pickupTime'
  | 'returnTime'
  | 'passengers'
  | 'luggage'
  | 'flightNumberPickup'
  | 'flightNumberReturn'
  | 'hoursRequested'
>;

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
  /** Afișează passengers & luggage */
  showPassengers: boolean;
  /** Afișează flight number fields */
  showFlightNumbers: boolean;
  /** Câmpuri obligatorii pentru validare (SYNCHRONIZED cu TripConfiguration) */
  requiredFields: readonly Step1FieldId[];
}

export const BOOKING_RULES: Record<BookingType, BookingRule> = {
  oneway: {
    showReturn: false,
    showDualTime: false,
    showStops: true,
    showDuration: false,
    dropoffOptional: false,
    showPassengers: true,
    showFlightNumbers: true, // doar pickup flight
    requiredFields: ['pickup', 'dropoff', 'pickupDate', 'pickupTime', 'passengers'],
  },
  return: {
    showReturn: true,
    showDualTime: true,
    showStops: true,
    showDuration: false,
    dropoffOptional: false,
    showPassengers: true,
    showFlightNumbers: true, // pickup + return flights
    requiredFields: [
      'pickup',
      'dropoff',
      'pickupDate',
      'returnDate',
      'pickupTime',
      'returnTime',
      'passengers',
    ],
  },
  hourly: {
    showReturn: false,
    showDualTime: false,
    showStops: false,
    showDuration: true,
    dropoffOptional: true,
    showPassengers: true,
    showFlightNumbers: false,
    requiredFields: ['pickup', 'pickupDate', 'pickupTime', 'hoursRequested', 'passengers'],
  },
  fleet: {
    showReturn: false,
    showDualTime: false,
    showStops: false, // Fleet nu are additional stops
    showDuration: false,
    dropoffOptional: false,
    showPassengers: true,
    showFlightNumbers: true, // de obicei doar pickup flight
    requiredFields: ['pickup', 'dropoff', 'pickupDate', 'pickupTime', 'passengers'],
  },
} as const;

/**
 * Helper pentru a obține regula unui booking type
 */
export const getBookingRule = (bookingType: BookingType): BookingRule => {
  return BOOKING_RULES[bookingType];
};
