/**
 * 📦 Booking Module - Central Exports
 * Clean barrel export pentru modular booking system
 */

// State Management
export { getInitialTripConfiguration } from './state/getInitialTripConfiguration';

// Pricing Engine
export { estimateDistanceFare } from './pricing/estimateDistanceFare';
export { calculateBookingPricing } from './pricing/calculateBookingPricing';

// Validation Engine
export { validateBookingFields, logValidationErrors } from './validation/validateBookingFields';
export { validateStep } from './validation/validateStep';
export { validateStepBoolean } from './validation/validateStepBoolean';

// Smart Validation with Cache + Audit (Enterprise Features)
export { validateStepResult, validateStepResultBoolean } from './validation/validateStepResult';
export { setValidationLoggerConfig, getSessionLogs, exportLogsAsCSV } from './validation/validationLogger';

// Actions (optional - for direct access to modular actions)
export { createBookingActions } from '../../hooks/booking/booking.actions';
export type { BookingActionsMethods } from '../../hooks/booking/booking.actions';

// Types
export type { 
  BookingValidationError, 
  ValidationResult, 
  StepValidationResult 
} from './validation/types';

export type { ValidationLoggerConfig } from './validation/validationLogger';

// Re-export common booking types pentru convenience
export type {
  TripConfiguration,
  VehicleSelection,
  SelectedService,
  PricingBreakdown,
  BookingStore,
  VehicleClass,
  BookingSummary,
} from '../../types/booking/index';
