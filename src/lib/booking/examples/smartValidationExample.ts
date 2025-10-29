/**
 * 📖 Smart Validation Example
 * Demonstrează cum să folosești sistemul complet de validare cu cache și audit
 */

import type { BookingStore } from '@/types/booking';
import { 
  validateStepResult, 
  validateStepResultBoolean, 
  setValidationLoggerConfig,
  getSessionLogs,
  exportLogsAsCSV,
  type ValidationLoggerConfig 
} from '@/lib/booking';

// ===== EXEMPLU 1: Setup Audit Logger =====

/**
 * Configurează logging în Supabase pentru producție
 */
export const setupSupabaseLogging = (supabaseClient: unknown) => {
  const config: ValidationLoggerConfig = {
    enabled: true,
    mode: 'supabase',
    supabase: {
      client: supabaseClient,
      table: 'booking_audit_logs'
    }
  };
  setValidationLoggerConfig(config);
};

/**
 * Configurează logging prin HTTP pentru microservices
 */
export const setupHttpLogging = (endpoint: string) => {
  const config: ValidationLoggerConfig = {
    enabled: true,
    mode: 'http',
    endpoint
  };
  setValidationLoggerConfig(config);
};

// ===== EXEMPLU 2: Validare în Aplicații JavaScript/TypeScript =====

/**
 * Validare asincronă într-o funcție simplă
 */
export const validateStepAsync = async (step: number, bookingStore: BookingStore) => {
  try {
    const result = await validateStepResult(step, bookingStore);
    return {
      success: true,
      isValid: result.isValid,
      errors: result.errors,
      warnings: result.warnings
    };
  } catch {
    return {
      success: false,
      isValid: false,
      errors: ['Validation failed'],
      warnings: []
    };
  }
};

/**
 * Validare cu rezultat boolean simplu (pentru logica de business)
 */
export const canProceedToNextStep = async (bookingStore: BookingStore) => {
  const currentStep = bookingStore.currentStep;
  return await validateStepResultBoolean(currentStep, bookingStore);
};

/**
 * Creează un obiect de validare pentru display în UI
 */
export const createValidationDisplay = async (step: number, bookingStore: BookingStore) => {
  const result = await validateStepResult(step, bookingStore);
  
  return {
    hasErrors: result.errors.length > 0,
    hasWarnings: result.warnings.length > 0,
    errorMessages: result.errors,
    warningMessages: result.warnings,
    canProceed: result.isValid,
    displayClass: result.isValid ? 'validation-success' : 'validation-error'
  };
};

// ===== EXEMPLU 3: Validare în Actions =====

/**
 * Exemplu de validare în Zustand actions
 */
export const createValidatedBookingAction = (set: (state: Partial<BookingStore>) => void, get: () => BookingStore) => ({
  async proceedToNextStep() {
    const state = get();
    const currentStep = state.currentStep;
    
    // Validare cu cache și audit automat
    const validation = await validateStepResult(currentStep, state);
    
    if (validation.isValid) {
      set({ currentStep: currentStep + 1 });
      return { success: true };
    } else {
      // Setează erorile în state pentru UI
      set({ 
        stepErrors: {
          ...state.stepErrors,
          [currentStep]: validation.errors
        }
      });
      return { 
        success: false, 
        errors: validation.errors,
        warnings: validation.warnings 
      };
    }
  },

  async validateCurrentStep() {
    const state = get();
    // Folosește cache pentru performance
    const isValid = await validateStepResultBoolean(state.currentStep, state);
    
    set({ isValid });
    return isValid;
  },

  async forceRevalidateStep(step: number) {
    const state = get();
    // Forțează recalcularea, ignorând cache-ul
    const validation = await validateStepResult(step, state, true);
    
    set({
      stepErrors: {
        ...state.stepErrors,
        [step]: validation.errors
      }
    });
    
    return validation;
  }
});

// ===== EXEMPLU 4: Analytics și QA =====

/**
 * Helper pentru QA - exportă toate log-urile sesiunii în CSV
 */
export const downloadSessionAnalytics = () => {
  const csv = exportLogsAsCSV();
  if (!csv) {
    alert('No validation logs found in current session');
    return;
  }

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `booking-validation-logs-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Helper pentru debugging - afișează statistici despre validări
 */
export const getValidationStats = () => {
  const logs = getSessionLogs();
  
  const stats = {
    totalValidations: logs.length,
    failedValidations: logs.filter(log => !log.isValid).length,
    averageDuration: logs.reduce((sum, log) => sum + (Number(log.durationMs) || 0), 0) / logs.length,
    errorsByStep: {} as Record<number, number>,
    slowestValidations: logs
      .sort((a, b) => (Number(b.durationMs) || 0) - (Number(a.durationMs) || 0))
      .slice(0, 5)
  };

  logs.forEach(log => {
    const step = log.step as number;
    if (!log.isValid) {
      stats.errorsByStep[step] = (stats.errorsByStep[step] || 0) + 1;
    }
  });

  return stats;
};

// ===== EXEMPLU 5: Configurare pentru Different Environments =====

/**
 * Setup pentru development environment
 */
export const setupDevelopmentLogging = () => {
  setValidationLoggerConfig({
    enabled: true,
    mode: 'console'
  });
  
  // Development-only: Afișează statistici la sfârșitul sesiunii
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      const stats = getValidationStats();
      // Development stats logging
      if (typeof document !== 'undefined') {
        interface WindowWithStats extends Window {
          __BOOKING_STATS?: typeof stats;
        }
        (window as WindowWithStats).__BOOKING_STATS = stats;
      }
    });
  }
};

/**
 * Setup pentru production environment
 */
export const setupProductionLogging = (endpoint: string) => {
  setValidationLoggerConfig({
    enabled: true,
    mode: 'http',
    endpoint
  });
};

/**
 * Disable logging complet (pentru testing)
 */
export const disableLogging = () => {
  setValidationLoggerConfig({
    enabled: false,
    mode: 'console'
  });
};
