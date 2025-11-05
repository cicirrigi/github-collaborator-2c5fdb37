/**
 * 🧾 Validation Audit Logger
 *
 * Sistem modular de logare a validărilor și duratelor per step.
 * Poate trimite date în Supabase, endpoint HTTP sau doar în consolă.
 */
// @ts-nocheck - Temporarily disable TypeScript checking for this module under development

import type { BookingStore } from '../../../types/booking/index';
import type { StepValidationResult } from './validateStepResult';

/**
 * Config global opțional (se poate injecta la runtime).
 */
export interface ValidationLoggerConfig {
  enabled: boolean;
  mode: 'console' | 'supabase' | 'http';
  endpoint?: string; // pentru mode=http
  supabase?: {
    client: unknown;
    table: string;
  };
}

/**
 * Config implicit — logging local doar în consolă.
 */
let loggerConfig: ValidationLoggerConfig = {
  enabled:
    process.env.NODE_ENV === 'development' || process.env.ENABLE_VALIDATION_LOGGING === 'true',
  mode: 'console',
};

/**
 * Permite actualizarea modului de logare la runtime.
 * Ex: setValidationLoggerConfig({ mode: 'supabase', supabase: { client, table: 'audit_logs' } })
 */
export const setValidationLoggerConfig = (config: Partial<ValidationLoggerConfig>) => {
  loggerConfig = { ...loggerConfig, ...config };
};

/**
 * Funcția principală de logare.
 * Este complet sigură — nu aruncă erori dacă conexiunea eșuează.
 */
export const logValidationEvent = async (
  step: number,
  result: StepValidationResult,
  state: BookingStore,
  durationMs?: number
): Promise<void> => {
  if (!loggerConfig.enabled) return;

  const payload = {
    timestamp: new Date().toISOString(),
    step,
    stepName: getStepLabel(step),
    isValid: result.isValid,
    errors: result.errors,
    warnings: result.warnings,
    durationMs: durationMs ?? 0,
    tripType: state.tripConfiguration?.type,
    pickupTime: state.tripConfiguration?.pickupTime,
    pickupDate: state.tripConfiguration?.pickupDate,
    total: state.pricing?.total,
    sessionId: generateSessionId(),
  };

  try {
    switch (loggerConfig.mode) {
      case 'console':
        if (typeof window !== 'undefined') {
          // Browser environment - use structured logging
          interface WindowWithLogs extends Window {
            __BOOKING_AUDIT_LOGS?: Array<typeof payload>;
          }
          const windowWithLogs = window as WindowWithLogs;
          windowWithLogs.__BOOKING_AUDIT_LOGS = [
            ...(windowWithLogs.__BOOKING_AUDIT_LOGS || []),
            payload,
          ];
        }
        break;

      case 'supabase':
        if (loggerConfig.supabase?.client && loggerConfig.supabase.table) {
          // Type assertion for Supabase client - requires proper Supabase setup
          const supabaseClient = loggerConfig.supabase.client as unknown;
          const clientWithMethods = supabaseClient as {
            from?: (table: string) => { insert: (data: unknown) => Promise<unknown> };
          };
          if (clientWithMethods?.from) {
            await clientWithMethods.from(loggerConfig.supabase.table).insert(payload);
          }
        }
        break;

      case 'http':
        if (loggerConfig.endpoint) {
          await fetch(loggerConfig.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        }
        break;

      default:
        // Silent fail for unknown modes
        break;
    }
  } catch {
    // Silent fail pentru logging errors - nu vrem să afectăm UX-ul
    // Error is intentionally ignored pentru production stability
  }
};

/**
 * Etichete prietenoase pentru fiecare step (pentru analytics).
 */
const getStepLabel = (step: number): string => {
  switch (step) {
    case 1:
      return 'Trip Details';
    case 2:
      return 'Vehicle Selection';
    case 3:
      return 'Pricing & Review';
    case 4:
      return 'Payment';
    default:
      return `Step ${step}`;
  }
};

/**
 * Generează un session ID simplu pentru tracking
 */
const generateSessionId = (): string => {
  if (typeof window !== 'undefined') {
    // Browser environment
    let sessionId = sessionStorage.getItem('booking_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('booking_session_id', sessionId);
    }
    return sessionId;
  }
  // Server environment
  return `server_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Helper pentru înțelegerea Analytics
 * Returnează toate log-urile din sesiunea curentă (doar în development)
 */
export const getSessionLogs = (): Array<Record<string, unknown>> => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    interface WindowWithLogs extends Window {
      __BOOKING_AUDIT_LOGS?: Array<Record<string, unknown>>;
    }
    return (window as WindowWithLogs).__BOOKING_AUDIT_LOGS || [];
  }
  return [];
};

/**
 * Helper pentru debugging - exportă log-urile în CSV pentru QA
 */
export const exportLogsAsCSV = (): string => {
  const logs = getSessionLogs();
  if (logs.length === 0) return '';

  const headers = Object.keys(logs[0]).join(',');
  const rows = logs.map(log =>
    Object.values(log)
      .map(v => (typeof v === 'string' ? `"${v}"` : v))
      .join(',')
  );

  return [headers, ...rows].join('\n');
};
