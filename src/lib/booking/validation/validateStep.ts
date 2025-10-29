/**
 * ✅ Step-by-Step Validation
 * Enhanced step validation cu detailed feedback
 */

import type { BookingStore } from '../../../types/booking/index';
import type { StepValidationResult } from './types';
import { validateBookingFields } from './validateBookingFields';

/**
 * Enhanced step validation cu detailed feedback pentru stepper UI
 * 
 * Features:
 * - Step-specific validation logic
 * - Separate errors și warnings
 * - Context-aware validation rules
 * - Passenger capacity checks
 * 
 * @param step - Step number (1-4)
 * @param state - Complete booking state
 * @returns Detailed validation result cu errors și warnings
 */
export const validateStep = (step: number, state: BookingStore): StepValidationResult => {
  switch (step) {
    case 1: {
      const validation = validateBookingFields(state.tripConfiguration);
      return {
        isValid: validation.isValid,
        errors: validation.errors.filter(e => e.severity === 'error').map(e => e.message),
        warnings: validation.errors.filter(e => e.severity === 'warning').map(e => e.message),
      };
    }
    
    case 2: {
      const errors: string[] = [];
      const warnings: string[] = [];
      
      if (state.tripConfiguration.type === 'fleet') {
        if (!state.tripConfiguration.fleetSelection || state.tripConfiguration.fleetSelection.length === 0) {
          errors.push('Select at least one vehicle for fleet service');
        }
      } else if (!state.vehicleSelection) {
        errors.push('Select a vehicle to continue');
      }
      
      // Passenger capacity warning
      if (state.vehicleSelection && state.tripConfiguration.passengers > (state.vehicleSelection.model?.maxPassengers || 4)) {
        warnings.push('Selected vehicle may not accommodate all passengers');
      }
      
      return {
        isValid: errors.length === 0,
        errors,
        warnings,
      };
    }
    
    case 3: {
      const errors: string[] = [];
      
      if (!state.pricing || state.pricing.total <= 0) {
        errors.push('Price calculation failed - please review your booking details');
      }
      
      return {
        isValid: errors.length === 0,
        errors,
        warnings: [],
      };
    }
    
    case 4: {
      const errors: string[] = [];
      
      if (!state.paymentDetails) {
        errors.push('Payment details are required to complete booking');
      }
      
      return {
        isValid: errors.length === 0,
        errors,
        warnings: [],
      };
    }
    
    default:
      return {
        isValid: true,
        errors: [],
        warnings: [],
      };
  }
};
