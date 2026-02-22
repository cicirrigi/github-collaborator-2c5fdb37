import { z } from 'zod';

// 🎯 STRICT WHITELISTS - Based on service-config.ts inventory

const INCLUDED_SERVICE_CODES = [
  'meet-greet',
  'onboard-wifi',
  'phone-chargers',
  'refreshments',
  'luggage-assistance',
  'pet-friendly',
  'airport-wait-time',
  'extra-stops',
] as const;

// 🎯 KEBAB-CASE NORMALIZED CODES (enterprise standard)
const PREMIUM_FEATURE_CODES = [
  'paparazzi-safe-mode',
  'front-seat-request',
  'comfort-ride-mode',
  'personal-luggage-privacy',
] as const;

// 🔗 UI MAPPING (if UI still uses camelCase)
export const UI_PREMIUM_FEATURE_KEY_TO_CODE = {
  paparazziSafeMode: 'paparazzi-safe-mode',
  frontSeatRequest: 'front-seat-request',
  comfortRideMode: 'comfort-ride-mode',
  personalLuggagePrivacy: 'personal-luggage-privacy',
} as const;

// 🎯 ENTERPRISE: Static validation to prevent drift between codes and mapping
const mappingValues = Object.values(UI_PREMIUM_FEATURE_KEY_TO_CODE);
const expectedCodes = [...PREMIUM_FEATURE_CODES];

// Ensure mapping covers all premium feature codes (compile-time check)
if (
  mappingValues.length !== expectedCodes.length ||
  !mappingValues.every(code => expectedCodes.includes(code))
) {
  throw new Error('UI_PREMIUM_FEATURE_KEY_TO_CODE must cover exactly all PREMIUM_FEATURE_CODES');
}

const MUSIC_PREFERENCE_VALUES = [
  'no-preference',
  'classical',
  'jazz',
  'pop',
  'rock',
  'silence',
] as const;

const TEMPERATURE_PREFERENCE_VALUES = ['no-preference', 'cool', 'comfortable', 'warm'] as const;

const COMMUNICATION_PREFERENCE_VALUES = [
  'no-preference',
  'friendly',
  'professional',
  'minimal',
] as const;

const FLOWERS_UPGRADE_VALUES = ['standard', 'exclusive'] as const;

const CHAMPAGNE_UPGRADE_VALUES = ['moet', 'dom-perignon'] as const;

// 🏗️ ZOD SCHEMA DEFINITIONS

const IncludedServicesSchema = z
  .array(z.enum(INCLUDED_SERVICE_CODES))
  .max(20, 'Too many included services')
  .superRefine((services, ctx) => {
    // Enforce uniqueness
    const seen = new Set<string>();
    services.forEach((service, index) => {
      if (seen.has(service)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate service: ${service}`,
          path: [index],
        });
      }
      seen.add(service);
    });
  });

// 🎯 PROGRAMMATIC SCHEMA (enterprise: zero drift between codes and schema)
const PremiumFeaturesSchema = z
  .object(
    Object.fromEntries(
      Object.entries(UI_PREMIUM_FEATURE_KEY_TO_CODE).map(([uiKey]) => [uiKey, z.boolean()])
    )
  )
  .strict();

const TripPreferencesSchema = z
  .object({
    music: z.enum(MUSIC_PREFERENCE_VALUES),
    temperature: z.enum(TEMPERATURE_PREFERENCE_VALUES),
    communication: z.enum(COMMUNICATION_PREFERENCE_VALUES),
  })
  .strict();

const PaidUpgradesSchema = z
  .object({
    flowers: z.enum(FLOWERS_UPGRADE_VALUES).nullable(),
    champagne: z.enum(CHAMPAGNE_UPGRADE_VALUES).nullable(),
    securityEscort: z.boolean(),
  })
  .strict();

// 🎯 MAIN SERVICE PACKAGES SCHEMA (STRICT)
export const ServicePackagesSchema = z
  .object({
    includedServices: IncludedServicesSchema,
    premiumFeatures: PremiumFeaturesSchema,
    tripPreferences: TripPreferencesSchema,
    paidUpgrades: PaidUpgradesSchema,
  })
  .strict(); // Reject unknown properties

// 📝 TYPESCRIPT TYPE INFERENCE
export type ServicePackages = z.infer<typeof ServicePackagesSchema>;
export type IncludedServices = z.infer<typeof IncludedServicesSchema>;
export type PremiumFeatures = z.infer<typeof PremiumFeaturesSchema>;
export type TripPreferences = z.infer<typeof TripPreferencesSchema>;
export type PaidUpgrades = z.infer<typeof PaidUpgradesSchema>;

// 🔍 EXPORT CONSTANTS FOR VALIDATION
export {
  CHAMPAGNE_UPGRADE_VALUES,
  COMMUNICATION_PREFERENCE_VALUES,
  FLOWERS_UPGRADE_VALUES,
  INCLUDED_SERVICE_CODES,
  MUSIC_PREFERENCE_VALUES,
  PREMIUM_FEATURE_CODES,
  TEMPERATURE_PREFERENCE_VALUES,
};
