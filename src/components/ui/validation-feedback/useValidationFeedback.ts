/**
 * 🎯 useValidationFeedback Hook
 * Smart integration cu validateStepResult din @/lib/booking
 */

import { useState, useEffect, useCallback } from 'react';
import type { BookingStore } from '@/types/booking';
import { validateStepResult } from '@/lib/booking';

export interface ValidationFeedbackState {
  errors: string[];
  warnings: string[];
  success: string[];
  isLoading: boolean;
  isValid: boolean;
}

/**
 * Hook pentru validare automată cu feedback UI
 * 
 * @param step - Step number to validate
 * @param bookingStore - Complete booking store
 * @param options - Configuration options
 */
export const useValidationFeedback = (
  step: number,
  bookingStore: BookingStore,
  options: {
    autoValidate?: boolean;
    successMessage?: string;
    debounceMs?: number;
  } = {}
) => {
  const { 
    autoValidate = true, 
    successMessage = 'All information is valid and complete.',
    debounceMs = 300 
  } = options;

  const [state, setState] = useState<ValidationFeedbackState>({
    errors: [],
    warnings: [],
    success: [],
    isLoading: false,
    isValid: false,
  });

  // Validate function cu debouncing
  const validate = useCallback(
    async (forceRevalidate = false) => {
      setState(prev => ({ ...prev, isLoading: true }));

      try {
        const result = await validateStepResult(step, bookingStore, forceRevalidate);
        
        const newState: ValidationFeedbackState = {
          errors: result.errors,
          warnings: result.warnings,
          success: result.isValid && result.errors.length === 0 && successMessage 
            ? [successMessage] 
            : [],
          isLoading: false,
          isValid: result.isValid,
        };

        setState(newState);
        return result;
      } catch {
        setState({
          errors: ['Validation failed due to an unexpected error'],
          warnings: [],
          success: [],
          isLoading: false,
          isValid: false,
        });
        return { isValid: false, errors: ['Validation failed'], warnings: [] };
      }
    },
    [step, bookingStore, successMessage]
  );

  // Auto-validate with debouncing
  useEffect(() => {
    if (!autoValidate) return;

    const timer = setTimeout(() => {
      validate();
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [validate, autoValidate, debounceMs]);

  // Manual validation controls
  const clearErrors = useCallback(() => {
    setState(prev => ({ ...prev, errors: [] }));
  }, []);

  const clearWarnings = useCallback(() => {
    setState(prev => ({ ...prev, warnings: [] }));
  }, []);

  const clearSuccess = useCallback(() => {
    setState(prev => ({ ...prev, success: [] }));
  }, []);

  const clearAll = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      errors: [], 
      warnings: [], 
      success: [] 
    }));
  }, []);

  const forceRevalidate = useCallback(() => {
    return validate(true);
  }, [validate]);

  return {
    // State
    ...state,
    
    // Actions
    validate,
    forceRevalidate,
    clearErrors,
    clearWarnings,
    clearSuccess,
    clearAll,
    
    // Convenience getters
    hasErrors: state.errors.length > 0,
    hasWarnings: state.warnings.length > 0,
    hasSuccess: state.success.length > 0,
    hasFeedback: state.errors.length > 0 || state.warnings.length > 0 || state.success.length > 0,
  };
};

/**
 * Simplified hook pentru doar boolean validation
 */
export const useStepValidation = (step: number, bookingStore: BookingStore) => {
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validate = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await validateStepResult(step, bookingStore);
      setIsValid(result.isValid);
      return result.isValid;
    } catch {
      setIsValid(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [step, bookingStore]);

  useEffect(() => {
    validate();
  }, [validate]);

  return {
    isValid,
    isLoading,
    validate,
  };
};
