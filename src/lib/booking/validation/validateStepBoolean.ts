/**
 * ✅ Boolean Step Validation
 * Backward compatibility helper pentru existing code
 */

import type { BookingStore } from '../../../types/booking/index';
import { validateStep } from './validateStep';

/**
 * Backward compatibility helper pentru existing code
 * Returns simple boolean instead of detailed validation result
 * 
 * @param step - Step number to validate
 * @param state - Booking state
 * @returns Boolean indicating if step is valid
 */
export const validateStepBoolean = (step: number, state: BookingStore): boolean => {
  return validateStep(step, state).isValid;
};
