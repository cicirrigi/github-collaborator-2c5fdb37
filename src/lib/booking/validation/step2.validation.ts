import type { TripConfiguration } from '../../../hooks/useBookingState';
import type { BookingType } from '../booking-rules';

/**
 * 🚗 STEP 2 VALIDATION ENGINE - Vehicle Selection & Services
 * Similar cu Step 1, validări enterprise pentru Step 2
 */

/**
 * Coduri de eroare pentru Step 2
 */
export type Step2ErrorCode =
  | 'MISSING_VEHICLE_CATEGORY'
  | 'MISSING_VEHICLE_MODEL'
  | 'INVALID_VEHICLE_FOR_BOOKING_TYPE'
  | 'INVALID_PREMIUM_FEATURES_FOR_CATEGORY'
  | 'INVALID_PASSENGER_CAPACITY'
  | 'FLEET_REQUIRES_LARGE_VEHICLE'
  | 'BESPOKE_REQUIRES_LUXURY';

export type Step2ErrorSeverity = 'error' | 'warning';

export interface Step2ValidationError {
  code: Step2ErrorCode;
  field: Step2FieldId;
  message: string;
  severity: Step2ErrorSeverity;
}

export interface Step2ValidationResult {
  isValid: boolean;
  errors: Step2ValidationError[];
  missingFields: Step2FieldId[];
}

/**
 * Câmpuri validabile pentru Step 2
 */
export type Step2FieldId =
  | 'vehicleCategory'
  | 'vehicleModel'
  | 'premiumFeatures'
  | 'tripPreferences'
  | 'paidUpgrades';

/**
 * Reguli de vehicule per booking type
 */
const VEHICLE_RULES_BY_BOOKING_TYPE: Record<
  BookingType,
  {
    allowedCategories: string[];
    minPassengers?: number;
    requiresLuxury?: boolean;
    recommendedCategories?: string[];
  }
> = {
  oneway: {
    allowedCategories: ['executive', 'luxury', 'suv', 'mpv'],
  },
  return: {
    allowedCategories: ['executive', 'luxury', 'suv', 'mpv'],
  },
  hourly: {
    allowedCategories: ['executive', 'luxury', 'suv', 'mpv'],
    recommendedCategories: ['luxury', 'suv'], // Pentru comfort în timp îndelungat
  },
  daily: {
    allowedCategories: ['luxury', 'suv', 'mpv'], // Pentru confort pe termen lung
    recommendedCategories: ['luxury', 'suv'],
  },
  fleet: {
    allowedCategories: ['suv', 'mpv'], // Doar vehicule mari pentru grup
    minPassengers: 5,
  },
  bespoke: {
    allowedCategories: ['luxury', 'suv'], // Doar premium pentru bespoke
    requiresLuxury: true,
  },
  events: {
    allowedCategories: ['luxury', 'suv', 'mpv'], // Pentru evenimente speciale
    recommendedCategories: ['luxury'],
  },
  corporate: {
    allowedCategories: ['executive', 'luxury'], // Professional appearance
    recommendedCategories: ['executive'],
  },
};

/**
 * Categorii care permit Premium Features
 */
const PREMIUM_FEATURES_ALLOWED_CATEGORIES = ['luxury', 'suv', 'mpv'];

/**
 * Etichete umane pentru câmpuri
 */
const FIELD_LABELS: Record<Step2FieldId, string> = {
  vehicleCategory: 'Vehicle category',
  vehicleModel: 'Vehicle model',
  premiumFeatures: 'Premium features',
  tripPreferences: 'Trip preferences',
  paidUpgrades: 'Paid upgrades',
};

/**
 * Mapare câmp → cod de eroare
 */
const FIELD_ERROR_CODE_MAP: Record<Step2FieldId, Step2ErrorCode> = {
  vehicleCategory: 'MISSING_VEHICLE_CATEGORY',
  vehicleModel: 'MISSING_VEHICLE_MODEL',
  premiumFeatures: 'INVALID_PREMIUM_FEATURES_FOR_CATEGORY',
  tripPreferences: 'MISSING_VEHICLE_CATEGORY', // Nu are eroare proprie
  paidUpgrades: 'MISSING_VEHICLE_CATEGORY', // Nu are eroare proprie
};

/**
 * Verifică dacă categoria de vehicul e validă pentru booking type
 */
const isValidVehicleCategoryForBookingType = (
  bookingType: BookingType,
  category: string | null
): boolean => {
  if (!category) return false;

  const rules = VEHICLE_RULES_BY_BOOKING_TYPE[bookingType];
  return rules.allowedCategories.includes(category);
};

/**
 * Verifică dacă premium features sunt valide pentru categoria selectată
 */
const areValidPremiumFeaturesForCategory = (
  category: string | null,
  premiumFeatures: Record<string, boolean>
): boolean => {
  if (!category) return true; // Nu validăm dacă nu e selectată categoria

  const hasPremiumFeatures = Object.values(premiumFeatures).some(Boolean);

  // Dacă nu are premium features selectate, e valid
  if (!hasPremiumFeatures) return true;

  // Dacă are premium features, categoria trebuie să le permită
  return PREMIUM_FEATURES_ALLOWED_CATEGORIES.includes(category);
};

/**
 * Verifică capacitatea de pasageri față de vehiculul selectat
 */
const isValidPassengerCapacity = (
  bookingType: BookingType,
  passengers: number,
  category: string | null
): boolean => {
  const rules = VEHICLE_RULES_BY_BOOKING_TYPE[bookingType];

  // Verifică minimum per booking type
  if (rules.minPassengers && passengers < rules.minPassengers) {
    return false;
  }

  // Verifică capacitatea vehiculului (aproximativ)
  if (category === 'executive' && passengers > 4) return false;
  if (category === 'luxury' && passengers > 4) return false;
  if (category === 'suv' && passengers > 7) return false;
  if (category === 'mpv' && passengers > 8) return false;

  return true;
};

/**
 * ✅ Validator principal pentru Step 2
 */
export const validateStep2 = (
  bookingType: BookingType,
  config: TripConfiguration
): Step2ValidationResult => {
  const errors: Step2ValidationError[] = [];
  const missingFields: Step2FieldId[] = [];

  const { selectedVehicle, servicePackages } = config;
  const category = selectedVehicle.category?.id || null;
  const model = selectedVehicle.model;

  // 1. VALIDARE VEHICUL OBLIGATORIU
  if (!category) {
    missingFields.push('vehicleCategory');
    errors.push({
      code: 'MISSING_VEHICLE_CATEGORY',
      field: 'vehicleCategory',
      message: 'Please select a vehicle category.',
      severity: 'error',
    });
  }

  if (!model) {
    missingFields.push('vehicleModel');
    errors.push({
      code: 'MISSING_VEHICLE_MODEL',
      field: 'vehicleModel',
      message: 'Please select a specific vehicle model.',
      severity: 'error',
    });
  }

  // 2. VALIDARE VEHICUL PER BOOKING TYPE
  if (category && !isValidVehicleCategoryForBookingType(bookingType, category)) {
    errors.push({
      code: 'INVALID_VEHICLE_FOR_BOOKING_TYPE',
      field: 'vehicleCategory',
      message: `${VEHICLE_RULES_BY_BOOKING_TYPE[bookingType].allowedCategories.join(', ')} vehicles are recommended for ${bookingType} bookings.`,
      severity: bookingType === 'fleet' || bookingType === 'bespoke' ? 'error' : 'warning',
    });
  }

  // 3. VALIDARE PREMIUM FEATURES PER CATEGORIE
  if (!areValidPremiumFeaturesForCategory(category, servicePackages.premiumFeatures)) {
    errors.push({
      code: 'INVALID_PREMIUM_FEATURES_FOR_CATEGORY',
      field: 'premiumFeatures',
      message: `Premium features are only available for ${PREMIUM_FEATURES_ALLOWED_CATEGORIES.join(', ')} vehicles.`,
      severity: 'error',
    });
  }

  // 4. VALIDARE CAPACITATE PASAGERI
  if (!isValidPassengerCapacity(bookingType, config.passengers, category)) {
    const rules = VEHICLE_RULES_BY_BOOKING_TYPE[bookingType];
    if (rules.minPassengers && config.passengers < rules.minPassengers) {
      errors.push({
        code: 'FLEET_REQUIRES_LARGE_VEHICLE',
        field: 'vehicleCategory',
        message: `${bookingType} bookings require at least ${rules.minPassengers} passengers. Please select SUV or MPV.`,
        severity: 'error',
      });
    } else {
      errors.push({
        code: 'INVALID_PASSENGER_CAPACITY',
        field: 'vehicleCategory',
        message: `Selected vehicle may not accommodate ${config.passengers} passengers comfortably.`,
        severity: 'warning',
      });
    }
  }

  // 5. VALIDĂRI SPECIFICE PER BOOKING TYPE
  switch (bookingType) {
    case 'bespoke':
      if (category && !['luxury', 'suv'].includes(category)) {
        errors.push({
          code: 'BESPOKE_REQUIRES_LUXURY',
          field: 'vehicleCategory',
          message: 'Bespoke services require luxury or SUV vehicles for premium experience.',
          severity: 'error',
        });
      }
      break;

    case 'fleet':
      if (category && !['suv', 'mpv'].includes(category)) {
        errors.push({
          code: 'FLEET_REQUIRES_LARGE_VEHICLE',
          field: 'vehicleCategory',
          message: 'Fleet bookings require SUV or MPV vehicles for group capacity.',
          severity: 'error',
        });
      }
      break;
  }

  return {
    isValid: errors.filter(e => e.severity === 'error').length === 0,
    errors,
    missingFields,
  };
};

/**
 * Helper pentru mesaje de eroare critice
 */
export const getPrimaryStep2ErrorMessages = (result: Step2ValidationResult): string[] => {
  return result.errors.filter(err => err.severity === 'error').map(err => err.message);
};

/**
 * Helper pentru validare Step 2 completă
 */
export const validateStep2Complete = (
  bookingType: BookingType,
  tripConfiguration: TripConfiguration
): { isValid: boolean; missingFields: string[]; warnings: string[] } => {
  const result = validateStep2(bookingType, tripConfiguration);

  const errorMessages = result.errors.filter(e => e.severity === 'error').map(e => e.message);

  const warningMessages = result.errors.filter(e => e.severity === 'warning').map(e => e.message);

  return {
    isValid: result.isValid,
    missingFields: errorMessages,
    warnings: warningMessages,
  };
};
