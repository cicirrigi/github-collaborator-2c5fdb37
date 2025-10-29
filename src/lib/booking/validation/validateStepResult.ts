/**
 * ✅ Step Validation Helper (Smart Cache + Full Result)
 * 
 * - Returnează `isValid`, `errors`, și `warnings` 
 * - Folosește un sistem de cache inteligent bazat pe WeakMap pentru performanță
 * - Cache-ul se invalidează automat dacă se modifică:
 *   - ora / data pickupului
 *   - distanța totală
 *   - prețul calculat (dinamic)
 * - Compatibil 100% cu `validateStep` și `validateStepBoolean` 
 */

import type { BookingStore } from '../../../types/booking/index';
import { validateStep } from './validateStep';

/**
 * Tip de rezultat complet pentru o validare de pas.
 */
export interface StepValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Cache intern:
 * WeakMap<BookingStore, Map<string, StepValidationResult>>
 * - Cache per instanță de store (nu persistă între utilizatori)
 * - Se eliberează automat când store-ul este garbage-collected
 */
const validationCache = new WeakMap<BookingStore, Map<string, StepValidationResult>>();

/**
 * Generează o cheie unică pentru caching bazată pe parametrii dinamici care afectează prețul și validarea.
 * Astfel, cache-ul e invalidat automat dacă userul schimbă ora, data, distanța sau totalul calculat.
 */
const getValidationKey = (step: number, state: BookingStore): string => {
  const { pickupDate, pickupTime, distanceKm } = state.tripConfiguration || {};
  const { total } = state.pricing || {};
  const tripType = state.tripConfiguration?.type || 'unknown';

  return JSON.stringify({
    step,
    tripType,
    pickupDate,
    pickupTime,
    distanceKm,
    total,
  });
};

/**
 * 🔍 Validare memoizată per step și store.
 * Poți folosi rezultatul pentru:
 *  - boolean simplu (isValid)
 *  - afișare erori și avertismente (errors / warnings)
 *
 * @param step - Numărul pasului de validat (1–4)
 * @param state - Obiectul complet al booking store-ului
 * @param force - Dacă este `true`, ignoră cache-ul și recalculează
 * @returns Obiect complet cu { isValid, errors, warnings }
 */
export const validateStepResult = async (
  step: number,
  state: BookingStore,
  force = false
): Promise<StepValidationResult> => {
  // ✅ Validare defensivă pentru parametri invalizi
  if (!state || typeof step !== 'number' || step < 1) {
    return { isValid: false, errors: ['Invalid step or state'], warnings: [] };
  }

  try {
    // Obține cache-ul per store
    let stepCache = validationCache.get(state);
    if (!stepCache) {
      stepCache = new Map<string, StepValidationResult>();
      validationCache.set(state, stepCache);
    }

    // Generează cheia bazată pe starea curentă (inclusiv preț)
    const key = getValidationKey(step, state);

    // Returnează din cache dacă e valid și nu s-a cerut recalcularea
    if (!force && stepCache.has(key)) {
      return stepCache.get(key)!;
    }

    // Execută validarea reală cu măsurarea timpului
    const start = performance.now();
    const validation = validateStep(step, state);
    const durationMs = performance.now() - start;

    const result: StepValidationResult = {
      isValid: validation.isValid,
      errors: validation.errors ?? [],
      warnings: validation.warnings ?? [],
    };

    // Actualizează cache-ul
    stepCache.set(key, result);

    // Audit automat (durată + rezultat) - static import (simplified)
    try {
      // Pentru moment, disable logging to avoid module complexity
      // În production, se poate replace cu proper logging solution
      if (typeof window !== 'undefined' && window.console) {
        console.log(`Validation step ${step}: ${result.isValid ? 'PASS' : 'FAIL'} (${durationMs}ms)`);
      }
    } catch {
      // Silent fail pentru logging - nu afectăm validarea principală
    }

    return result;
  } catch {
    // Return safe fallback pentru orice eroare de validare
    return {
      isValid: false,
      errors: ['Unexpected validation error'],
      warnings: [],
    };
  }
};

/**
 * ✅ Shortcut pentru compatibilitate cu codul existent
 * Returnează doar booleanul `isValid`, folosind același cache intern.
 *
 * @param step - Numărul pasului
 * @param state - Store-ul complet
 * @returns boolean
 */
export const validateStepResultBoolean = async (step: number, state: BookingStore): Promise<boolean> => {
  const result = await validateStepResult(step, state);
  return result.isValid;
};
