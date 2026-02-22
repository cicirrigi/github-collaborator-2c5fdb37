import { SERVICE_BY_CODE } from './serviceCatalog';
import { ServicePackagesSchema, UI_PREMIUM_FEATURE_KEY_TO_CODE } from './servicePackages.schema';

// 🎯 INPUT/OUTPUT TYPES
export interface ResolveInput {
  servicePackages: unknown; // Raw input from tripConfiguration.servicePackages
  vehicleCategoryCode: string; // 'executive' | 'luxury' | 'suv' | 'mpv'
}

export interface ResolvedService {
  code: string;
  source: 'included_auto' | 'user_selected';
  isComplimentary: boolean;
  // NOTE: unitPricePence/currency removed - server looks up from DB
  configuration?: Record<string, unknown>;
}

export type ResolvedResult =
  | {
      ok: true;
      preferences: {
        music: string;
        temperature: string;
        communication: string;
      };
      services: ResolvedService[];
    }
  | {
      ok: false;
      errors: unknown;
      preferences: null;
      services: ResolvedService[];
    };

// ENTERPRISE RESOLVER FUNCTION (BULLETPROOF)
export function resolveBookingServices(input: ResolveInput): ResolvedResult {
  const { servicePackages, vehicleCategoryCode } = input;

  // VALIDATE INPUT WITH ZOD SCHEMA
  const parseResult = ServicePackagesSchema.safeParse(servicePackages);

  if (!parseResult.success) {
    // 🚨 ENTERPRISE: Hard fail on invalid schema (no fallback behavior)
    return {
      ok: false,
      errors: parseResult.error,
      preferences: null,
      services: [] as ResolvedService[], // Enterprise: explicit type for consistency
    };
  }

  const validatedPackages = parseResult.data;

  // 🎯 ENTERPRISE: Use Map for guaranteed deduplication by service code
  const serviceMap = new Map<string, ResolvedService>();

  // ✅ 1. INCLUDED SERVICES (Always auto-included)
  validatedPackages.includedServices.forEach(serviceCode => {
    const catalogItem = SERVICE_BY_CODE[serviceCode];
    if (catalogItem) {
      serviceMap.set(serviceCode, {
        code: serviceCode,
        source: 'included_auto',
        isComplimentary: true,
      });
    }
  });

  // 🎁 2. PREMIUM FEATURES (Eligibility-based) - KEBAB-CASE MAPPING
  const isPremiumEligible = ['luxury', 'suv', 'mpv'].includes(vehicleCategoryCode);

  if (isPremiumEligible) {
    Object.entries(validatedPackages.premiumFeatures).forEach(([uiKey, isEnabled]) => {
      if (isEnabled) {
        // Map UI camelCase key to kebab-case service code (enterprise: single source)
        const serviceCode =
          UI_PREMIUM_FEATURE_KEY_TO_CODE[uiKey as keyof typeof UI_PREMIUM_FEATURE_KEY_TO_CODE];

        if (serviceCode) {
          const catalogItem = SERVICE_BY_CODE[serviceCode];
          if (catalogItem && catalogItem.type === 'conditional_free') {
            serviceMap.set(serviceCode, {
              code: serviceCode,
              source: 'included_auto',
              isComplimentary: true,
            });
          }
        }
      }
    });
  }
  // Note: If not premium eligible, premium features are silently ignored (no error)

  // 💰 3. PAID UPGRADES
  const { paidUpgrades } = validatedPackages;

  // Flowers upgrade
  if (paidUpgrades.flowers) {
    const flowerCode = `flowers-${paidUpgrades.flowers}`;
    const catalogItem = SERVICE_BY_CODE[flowerCode];
    if (catalogItem) {
      serviceMap.set(flowerCode, {
        code: flowerCode,
        source: 'user_selected',
        isComplimentary: false,
        configuration: { tier: paidUpgrades.flowers },
      });
    }
  }

  // Champagne upgrade
  if (paidUpgrades.champagne) {
    const champagneCode = `champagne-${paidUpgrades.champagne}`;
    const catalogItem = SERVICE_BY_CODE[champagneCode];
    if (catalogItem) {
      serviceMap.set(champagneCode, {
        code: champagneCode,
        source: 'user_selected',
        isComplimentary: false,
        configuration: { type: paidUpgrades.champagne },
      });
    }
  }

  // Security escort
  if (paidUpgrades.securityEscort) {
    const catalogItem = SERVICE_BY_CODE['security-escort'];
    if (catalogItem) {
      serviceMap.set('security-escort', {
        code: 'security-escort',
        source: 'user_selected',
        isComplimentary: false,
      });
    }
  }

  // 🎯 ENTERPRISE SUCCESS: Convert Map to Array (guaranteed unique) + canonical order
  const resolvedServices = Array.from(serviceMap.values()).sort((a, b) =>
    a.code.localeCompare(b.code)
  ); // Stable output for tests/snapshots

  // 🎵 4. TRIP PREFERENCES (Always included)
  const preferences = {
    music: validatedPackages.tripPreferences.music,
    temperature: validatedPackages.tripPreferences.temperature,
    communication: validatedPackages.tripPreferences.communication,
  };

  return {
    ok: true,
    preferences,
    services: resolvedServices,
  };
}

// 🧮 UTILITY FUNCTIONS
// NOTE: calculateTotalUpgradesCost moved to server-side since pricing comes from DB
export function getPaidUpgradeCodes(resolved: ResolvedResult): string[] {
  if (!resolved.ok) return [];
  return resolved.services
    .filter((service: ResolvedService) => !service.isComplimentary)
    .map((service: ResolvedService) => service.code);
}

export function getServicesBySource(
  resolved: ResolvedResult,
  source: 'included_auto' | 'user_selected'
): ResolvedService[] {
  if (!resolved.ok) return [];
  return resolved.services.filter((service: ResolvedService) => service.source === source);
}

export function hasService(resolved: ResolvedResult, serviceCode: string): boolean {
  if (!resolved.ok) return false;
  return resolved.services.some((service: ResolvedService) => service.code === serviceCode);
}
