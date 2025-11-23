import type { TripConfiguration } from '@/hooks/useBookingState';
import { getBookingRule, type BookingType, type Step1FieldId } from '../booking-rules';

/**
 * Coduri de eroare clare (bune pentru logging & analytics)
 */
export type Step1ErrorCode =
  | 'MISSING_PICKUP'
  | 'MISSING_DROPOFF'
  | 'MISSING_PICKUP_DATETIME'
  | 'MISSING_RETURN_DATETIME'
  | 'MISSING_PASSENGERS'
  | 'MISSING_LUGGAGE'
  | 'MISSING_FLIGHT_PICKUP'
  | 'MISSING_FLIGHT_RETURN'
  | 'MISSING_HOURS_REQUESTED'
  | 'MISSING_DAILY_RANGE'
  | 'MISSING_CUSTOM_REQUIREMENTS';

export type Step1ErrorSeverity = 'error' | 'warning';

export interface Step1ValidationError {
  code: Step1ErrorCode;
  field: Step1FieldId;
  message: string;
  severity: Step1ErrorSeverity;
}

export interface Step1ValidationResult {
  isValid: boolean;
  errors: Step1ValidationError[];
  missingFields: Step1FieldId[];
}

/**
 * Etichete umane pentru UI
 */
const FIELD_LABELS: Record<Step1FieldId, string> = {
  pickup: 'Pickup location',
  dropoff: 'Drop-off location',
  pickupDateTime: 'Pickup date & time',
  returnDateTime: 'Return date & time',
  passengers: 'Number of passengers',
  luggage: 'Number of luggage',
  flightNumberPickup: 'Pickup flight number',
  flightNumberReturn: 'Return flight number',
  hoursRequested: 'Number of hours',
  dailyRange: 'Daily date range',
  customRequirements: 'Custom requirements',
};

/**
 * Mapare câmp → cod de eroare
 */
const FIELD_ERROR_CODE_MAP: Record<Step1FieldId, Step1ErrorCode> = {
  pickup: 'MISSING_PICKUP',
  dropoff: 'MISSING_DROPOFF',
  pickupDateTime: 'MISSING_PICKUP_DATETIME',
  returnDateTime: 'MISSING_RETURN_DATETIME',
  passengers: 'MISSING_PASSENGERS',
  luggage: 'MISSING_LUGGAGE',
  flightNumberPickup: 'MISSING_FLIGHT_PICKUP',
  flightNumberReturn: 'MISSING_FLIGHT_RETURN',
  hoursRequested: 'MISSING_HOURS_REQUESTED',
  dailyRange: 'MISSING_DAILY_RANGE',
  customRequirements: 'MISSING_CUSTOM_REQUIREMENTS',
};

/**
 * Extrage "prezența" câmpurilor din TripConfiguration
 * într-o formă generică booleană.
 */
const buildPresenceMap = (config: TripConfiguration): Record<Step1FieldId, boolean> => ({
  pickup: Boolean(config.pickup),
  dropoff: Boolean(config.dropoff),
  pickupDateTime: Boolean(config.pickupDateTime),
  returnDateTime: Boolean(config.returnDateTime),
  passengers: config.passengers > 0,
  luggage: config.luggage >= 0,
  flightNumberPickup: Boolean(config.flightNumberPickup?.trim()),
  flightNumberReturn: Boolean(config.flightNumberReturn),
  hoursRequested: config.hoursRequested !== null && config.hoursRequested > 0,
  dailyRange: config.dailyRange[0] !== null && config.dailyRange[1] !== null,
  customRequirements: Boolean(config.customRequirements?.trim()),
});

/**
 * ✅ Validator full pentru Step 1
 */
export const validateStep1 = (
  bookingType: BookingType,
  config: TripConfiguration
): Step1ValidationResult => {
  const rule = getBookingRule(bookingType);
  const presence = buildPresenceMap(config);

  const missingFields: Step1FieldId[] = [];
  const errors: Step1ValidationError[] = [];

  // 1) Required fields din BOOKING_RULES
  for (const field of rule.requiredFields) {
    if (!presence[field]) {
      missingFields.push(field);

      errors.push({
        code: FIELD_ERROR_CODE_MAP[field],
        field,
        message: `${FIELD_LABELS[field]} is required.`,
        severity: 'error',
      });
    }
  }

  // 2) Flight number logic "nice to have" (exemplu de warning)
  if (rule.showFlightNumbers) {
    if (!presence.flightNumberPickup && config.pickup?.type === 'airport') {
      errors.push({
        code: 'MISSING_FLIGHT_PICKUP',
        field: 'flightNumberPickup',
        message: 'Please add your flight number so we can track delays.',
        severity: 'warning',
      });
    }

    if (
      bookingType === 'return' &&
      !presence.flightNumberReturn &&
      config.dropoff?.type === 'airport'
    ) {
      errors.push({
        code: 'MISSING_FLIGHT_RETURN',
        field: 'flightNumberReturn',
        message: 'Adding the return flight number helps us coordinate your pickup.',
        severity: 'warning',
      });
    }
  }

  return {
    isValid: missingFields.length === 0,
    errors,
    missingFields,
  };
};

/**
 * Helper simplu pentru UI – doar mesaje de eroare "hard"
 */
export const getPrimaryErrorMessages = (result: Step1ValidationResult): string[] => {
  return result.errors.filter(err => err.severity === 'error').map(err => err.message);
};

/**
 * 🔥 Helper simplu pentru validare Step 1 (wrapper peste validateStep1)
 */
export const validateStep1Complete = (
  bookingType: BookingType,
  tripConfiguration: TripConfiguration
): { isValid: boolean; missingFields: string[] } => {
  const result = validateStep1(bookingType, tripConfiguration);
  return {
    isValid: result.isValid,
    missingFields: result.missingFields,
  };
};
