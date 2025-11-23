/**
 * 🚗 Booking Legs - Modular Exports
 *
 * MIGRATION PLAN:
 * 1. Keep all original exports from ../booking-legs.ts working ✅
 * 2. Gradually move functions to separate files
 * 3. Re-export everything here for compatibility
 * 4. Update imports only after everything is moved
 */

// Modular exports - migrating booking types one by one
export { mapDailyBookingToLegs } from './daily-legs';
export { mapHourlyBookingToLegs } from './hourly-legs';
export { mapOnewayBookingToLegs } from './oneway-legs';
export { mapReturnBookingToLegs } from './return-legs';
