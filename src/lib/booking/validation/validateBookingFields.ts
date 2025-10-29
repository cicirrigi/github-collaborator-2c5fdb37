/**
 * ✅ Booking Fields Validation
 * Enhanced validation cu field-level error mapping
 */

import type { TripConfiguration } from '../../../types/booking/index';
import type { BookingValidationError, ValidationResult } from './types';

/**
 * Supabase logging pentru debugging și analytics
 */
export const logValidationErrors = async (errors: BookingValidationError[]): Promise<void> => {
  if (errors.length === 0) return;
  
  try {
    // Only log in development or if explicit logging is enabled
    if (process.env.NODE_ENV === 'development' || process.env.ENABLE_VALIDATION_LOGGING === 'true') {
      // TODO: Uncomment when Supabase client is set up
      // const { supabase } = await import('@/lib/supabaseClient');
      // await supabase.from('booking_validation_logs').insert({
      //   timestamp: new Date().toISOString(),
      //   errors: errors,
      //   session_id: crypto.randomUUID(),
      //   user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      // });
      
      // Fallback to structured logging in development
      if (typeof window !== 'undefined') {
        interface WindowWithLogs extends Window {
          __BOOKING_VALIDATION_LOGS?: Array<{ timestamp: string; errors: BookingValidationError[] }>;
        }
        const windowWithLogs = window as WindowWithLogs;
        windowWithLogs.__BOOKING_VALIDATION_LOGS = [
          ...(windowWithLogs.__BOOKING_VALIDATION_LOGS || []),
          { timestamp: new Date().toISOString(), errors }
        ];
      }
    }
  } catch {
    // Silent fail pentru logging errors - no console output per ESLint rules
    // Error is intentionally ignored pentru production stability
  }
};

/**
 * Enhanced booking fields validation cu field-level error mapping
 * 
 * Features:
 * - Field-specific error targeting
 * - Severity levels (error/warning)
 * - Context-aware validation
 * - Automatic error logging
 * 
 * @param tripConfig - Trip configuration to validate
 * @returns Detailed validation result cu field-level errors
 */
export const validateBookingFields = (tripConfig: TripConfiguration): ValidationResult => {
  const errors: BookingValidationError[] = [];

  // Basic required fields
  if (!tripConfig.pickup) {
    errors.push({ 
      field: 'pickup', 
      message: 'Pickup location is required', 
      severity: 'error' 
    });
  }
  if (!tripConfig.dropoff && tripConfig.type !== 'hourly') {
    errors.push({ 
      field: 'dropoff', 
      message: 'Destination location is required', 
      severity: 'error' 
    });
  }
  if (!tripConfig.pickupDate) {
    errors.push({ 
      field: 'pickupDate', 
      message: 'Departure date is required', 
      severity: 'error' 
    });
  }
  if (!tripConfig.pickupTime) {
    errors.push({ 
      field: 'pickupTime', 
      message: 'Departure time is required', 
      severity: 'error' 
    });
  }

  // Return mode specific validation
  if (tripConfig.type === 'return') {
    if (!tripConfig.returnDate) {
      errors.push({ 
        field: 'returnDate', 
        message: 'Return date is required for return trips', 
        severity: 'error' 
      });
    }
    if (!tripConfig.returnTime) {
      errors.push({ 
        field: 'returnTime', 
        message: 'Return time is required for return trips', 
        severity: 'error' 
      });
    }
    
    // Date logic validation
    if (tripConfig.pickupDate && tripConfig.returnDate) {
      const pickup = tripConfig.pickupDate instanceof Date ? tripConfig.pickupDate : new Date(tripConfig.pickupDate);
      const returnD = tripConfig.returnDate instanceof Date ? tripConfig.returnDate : new Date(tripConfig.returnDate);
      
      if (returnD <= pickup) {
        errors.push({ 
          field: 'returnDate', 
          message: 'Return date must be after departure date', 
          severity: 'error' 
        });
      }
    }
  }

  // Hourly mode specific validation
  if (tripConfig.type === 'hourly') {
    if (!tripConfig.hoursRequested || tripConfig.hoursRequested < 2) {
      errors.push({ 
        field: 'hoursRequested', 
        message: 'Minimum 2 hours required for hourly service', 
        severity: 'error' 
      });
    }
  }

  // Fleet mode specific validation
  if (tripConfig.type === 'fleet') {
    if (!tripConfig.fleetSelection || tripConfig.fleetSelection.length === 0) {
      errors.push({ 
        field: 'fleetSelection', 
        message: 'At least one vehicle must be selected for fleet service', 
        severity: 'error' 
      });
    }
  }

  // Passenger validation
  if (tripConfig.passengers < 1) {
    errors.push({ 
      field: 'passengers', 
      message: 'At least 1 passenger is required', 
      severity: 'error' 
    });
  }

  // Warning-level validations
  if (tripConfig.passengers > 6) {
    errors.push({ 
      field: 'passengers', 
      message: 'Large groups may require vehicle upgrade', 
      severity: 'warning' 
    });
  }

  const result = {
    isValid: errors.filter(e => e.severity === 'error').length === 0,
    errors
  };
  
  // Log validation errors pentru debugging și analytics
  if (errors.length > 0) {
    logValidationErrors(errors).catch(() => {
      // Silent fail pentru logging
    });
  }
  
  return result;
};
