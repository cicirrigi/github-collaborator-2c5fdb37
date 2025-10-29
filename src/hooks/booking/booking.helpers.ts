/**
 * 🧮 booking.helpers.ts
 * DEPRECATED — replaced by modular booking system (v2)
 * Still exports backward-compatible functions for legacy references.
 */

import { validateBookingFields } from '@/lib/booking';
import { calculateBookingPricing } from '@/lib/booking/pricing/calculateBookingPricing';
import { getInitialTripConfiguration } from '@/lib/booking/state/getInitialTripConfiguration';

export const bookingHelpers = {
  validateBookingFields,
  calculateBookingPricing,
  getInitialTripConfiguration,
};
