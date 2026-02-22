// 🎯 SERVICE CATALOG CANON - Single Source of Truth
// Based on src/features/booking/components/step2/service-config.ts inventory

export type ServiceType = 'included' | 'conditional_free' | 'paid';
export type PricingType = 'none' | 'flat';

export interface ServiceCatalogItem {
  code: string;
  label: string;
  description: string;
  type: ServiceType;
  pricing: {
    type: PricingType; // 'none' for included/conditional_free, 'flat' for paid
    // NOTE: amountPence/currency removed - DB is source of truth
  };
  eligibility?: {
    vehicleCategoryCodes?: string[];
  };
}

// 🎯 MASTER SERVICE CATALOG
export const SERVICE_CATALOG: ServiceCatalogItem[] = [
  // A. INCLUDED SERVICES (ALL CLASSES) - 8 services
  {
    code: 'meet-greet',
    label: 'Greeting',
    description: 'Personal welcome service at pickup location',
    type: 'included',
    pricing: { type: 'none' },
  },
  {
    code: 'onboard-wifi',
    label: 'WiFi',
    description: 'Stay connected during your journey',
    type: 'included',
    pricing: { type: 'none' },
  },
  {
    code: 'phone-chargers',
    label: 'Chargers',
    description: 'Charging cables for all major devices',
    type: 'included',
    pricing: { type: 'none' },
  },
  {
    code: 'refreshments',
    label: 'Refreshments',
    description: 'Premium bottled water (still or sparkling)',
    type: 'included',
    pricing: { type: 'none' },
  },
  {
    code: 'luggage-assistance',
    label: 'Assistance',
    description: 'Help with your bags',
    type: 'included',
    pricing: { type: 'none' },
  },
  {
    code: 'pet-friendly',
    label: 'Pet-Friendly',
    description: 'Small pets (up to 8kg) in carriers',
    type: 'included',
    pricing: { type: 'none' },
  },
  {
    code: 'airport-wait-time',
    label: 'Waiting Time',
    description: 'Complimentary included waiting time',
    type: 'included',
    pricing: { type: 'none' },
  },
  {
    code: 'extra-stops',
    label: 'Extra Stops',
    description: 'Short stops on-route within reasonable time',
    type: 'included',
    pricing: { type: 'none' },
  },

  // B. FREE PREMIUM OPTIONS (Luxury/SUV/MPV only) - 4 features (KEBAB-CASE)
  {
    code: 'paparazzi-safe-mode',
    label: 'Paparazzi Safe Mode',
    description: 'Lights off, no photos, no public name calling, driver stays inside',
    type: 'conditional_free',
    pricing: { type: 'none' },
    eligibility: {
      vehicleCategoryCodes: ['luxury', 'suv', 'mpv'],
    },
  },
  {
    code: 'front-seat-request',
    label: 'Front Seat Request',
    description: 'Ride in the front passenger seat for comfort or sensitivity',
    type: 'conditional_free',
    pricing: { type: 'none' },
    eligibility: {
      vehicleCategoryCodes: ['luxury', 'suv', 'mpv'],
    },
  },
  {
    code: 'comfort-ride-mode',
    label: 'Comfort Ride Mode',
    description: 'Smoother, gentle driving with soft acceleration & minimal braking',
    type: 'conditional_free',
    pricing: { type: 'none' },
    eligibility: {
      vehicleCategoryCodes: ['luxury', 'suv', 'mpv'],
    },
  },
  {
    code: 'personal-luggage-privacy',
    label: 'Personal Luggage Privacy',
    description: 'Driver will NOT touch bags or doors. Full privacy',
    type: 'conditional_free',
    pricing: { type: 'none' },
    eligibility: {
      vehicleCategoryCodes: ['luxury', 'suv', 'mpv'],
    },
  },

  // C. PAID PREMIUM UPGRADES (ALL CLASSES) - 5 upgrades (prices from DB)
  {
    code: 'flowers-standard',
    label: 'Standard Luxury Bouquet',
    description: 'Hand-tied seasonal bouquet',
    type: 'paid',
    pricing: { type: 'flat' },
  },
  {
    code: 'flowers-exclusive',
    label: 'Exclusive Grand Bouquet',
    description: 'Luxury roses & exotic flowers',
    type: 'paid',
    pricing: { type: 'flat' },
  },
  {
    code: 'champagne-moet',
    label: 'Moët & Chandon Brut Imperial',
    description: 'Chilled 750ml, 4h notice',
    type: 'paid',
    pricing: { type: 'flat' },
  },
  {
    code: 'champagne-dom-perignon',
    label: 'Dom Pérignon 2015',
    description: 'Prestige champagne, limited availability',
    type: 'paid',
    pricing: { type: 'flat' },
  },
  {
    code: 'security-escort',
    label: 'Security Escort',
    description: 'SIA-certified protection 6–8h',
    type: 'paid',
    pricing: { type: 'flat' },
  },
];

// 🗂️ SERVICE BY CODE MAP (for fast lookup)
export const SERVICE_BY_CODE = Object.fromEntries(
  SERVICE_CATALOG.map(service => [service.code, service])
) as Record<string, ServiceCatalogItem>;

// 🏷️ CONVENIENCE GETTERS
export const getServiceByCode = (code: string): ServiceCatalogItem | undefined => {
  return SERVICE_BY_CODE[code];
};

export const getIncludedServices = (): ServiceCatalogItem[] => {
  return SERVICE_CATALOG.filter(service => service.type === 'included');
};

export const getPremiumFeatures = (): ServiceCatalogItem[] => {
  return SERVICE_CATALOG.filter(service => service.type === 'conditional_free');
};

export const getPaidUpgrades = (): ServiceCatalogItem[] => {
  return SERVICE_CATALOG.filter(service => service.type === 'paid');
};

export const getEligibleServices = (vehicleCategoryCode: string): ServiceCatalogItem[] => {
  return SERVICE_CATALOG.filter(service => {
    if (!service.eligibility?.vehicleCategoryCodes) {
      return true; // No eligibility restriction
    }
    return service.eligibility.vehicleCategoryCodes.includes(vehicleCategoryCode);
  });
};
