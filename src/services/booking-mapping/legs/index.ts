/**
 * 🚗 Booking Legs - Modular Exports
 *
 * MIGRATION PLAN:
 * 1. Keep all original exports from ../booking-legs.ts working ✅
 * 2. Gradually move functions to separate files
 * 3. Re-export everything here for compatibility
 * 4. Update imports only after everything is moved
 */

// Modular exports - all functions migrated
export { mapOnewayBookingToLegs } from './oneway-legs';
export { mapReturnBookingToLegs } from './return-legs';
