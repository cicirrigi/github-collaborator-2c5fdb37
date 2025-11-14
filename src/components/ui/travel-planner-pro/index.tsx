// Main component export
export { TravelPlannerPro } from './travel-planner-pro';

// Individual components for advanced usage
export { CalendarPro } from './calendar/calendar-pro';
export { TimeSlotsPro } from './calendar/time-slots-pro';

// Theme and constants (styling only)
export { TRAVEL_PLANNER_PRO_THEME } from './constants';
export type { TravelPlannerProTheme } from './constants';

// Logic (booking rules) - from lib/booking
export { BOOKING_RULES, getBookingRule } from '@/lib/booking/booking-rules';
export type { BookingRule, BookingType } from '@/lib/booking/booking-rules';

// Validation
export {
  getPrimaryErrorMessages,
  validateStep1,
  validateStep1Complete,
} from '@/lib/booking/validation/step1.validation';

// UI Helpers
export {
  shouldShowFlightNumbers,
  shouldShowPassengers,
  shouldShowReturnDate,
} from '@/lib/booking/ui-helpers';

// Step 1 Components (NEW)
export { TripDurationSelector } from './TripDurationSelector';
export { TripFlightNumbers } from './TripFlightNumbers';
export { TripLuggage } from './TripLuggage';
export { TripPassengers } from './TripPassengers';
