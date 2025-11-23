/**
 * 🎯 UI Conditional Logic Helpers - Enterprise
 * Derivate din BOOKING_RULES pentru componente UI
 */

import { getBookingRule, type BookingType, type Step1FieldId } from './booking-rules';

/**
 * 🔍 Helpers pentru conditional rendering în UI
 */
export const shouldShowPassengers = (bookingType: BookingType): boolean => {
  return getBookingRule(bookingType).showPassengers;
};

export const shouldShowFlightNumbers = (bookingType: BookingType): boolean => {
  return getBookingRule(bookingType).showFlightNumbers;
};

export const shouldShowReturnDate = (bookingType: BookingType): boolean => {
  return getBookingRule(bookingType).showReturn;
};

export const shouldShowDualTime = (bookingType: BookingType): boolean => {
  return getBookingRule(bookingType).showDualTime;
};

export const shouldShowStops = (bookingType: BookingType): boolean => {
  return getBookingRule(bookingType).showStops;
};

export const shouldShowDuration = (bookingType: BookingType): boolean => {
  return getBookingRule(bookingType).showDuration;
};

export const isDropoffOptional = (bookingType: BookingType): boolean => {
  return getBookingRule(bookingType).dropoffOptional;
};

/**
 * 🔍 Field presence checker
 */
export const isFieldRequired = (bookingType: BookingType, fieldId: Step1FieldId): boolean => {
  const rule = getBookingRule(bookingType);
  return rule.requiredFields.includes(fieldId);
};

/**
 * 🔍 Multi-field conditional helpers
 */
export const shouldShowReturnFlight = (bookingType: BookingType): boolean => {
  return bookingType === 'return' && shouldShowFlightNumbers(bookingType);
};

export const shouldShowPickupFlight = (bookingType: BookingType): boolean => {
  return shouldShowFlightNumbers(bookingType);
};
