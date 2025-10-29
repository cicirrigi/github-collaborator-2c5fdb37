/**
 * ✅ Validation Types
 * Enhanced validation types pentru field-level feedback
 */

import type { TripConfiguration } from '../../../types/booking/index';

/**
 * Enhanced validation error pentru field-level feedback în UI
 */
export type BookingValidationError = {
  field: keyof TripConfiguration;
  message: string;
  severity: 'error' | 'warning';
};

/**
 * Result structure pentru comprehensive validation
 */
export type ValidationResult = {
  isValid: boolean;
  errors: BookingValidationError[];
};

/**
 * Enhanced step validation cu detailed feedback
 */
export type StepValidationResult = {
  isValid: boolean;
  errors: string[];
  warnings: string[];
};

/**
 * Re-export pentru compatibility cu validateStepResult
 */
export type { StepValidationResult as SmartStepValidationResult } from './validateStepResult';
