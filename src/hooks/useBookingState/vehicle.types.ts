// 🚗 VEHICLE TYPES - Step 2 Vehicle Selection Types

export type VehicleCategoryId = 'executive' | 'luxury' | 'mpv' | 'suv';

export interface VehicleModel {
  id: string;
  name: string; // "Mercedes E-Class"
  brand: string; // "Mercedes"
  model: string; // "E-Class"
  image: string; // URL/path to image
  features: string[]; // ["Leather seats", "WiFi", "Climate control"]
  capacity: {
    passengers: number; // 4
    luggage: number; // 2 large bags
  };
  specifications: {
    fuelType: string; // "Hybrid" | "Petrol" | "Electric"
    transmission: string; // "Automatic"
    year?: number; // 2024
  };
  priceMultiplier: number; // 1.0 for base, 1.5 for luxury, etc.
}

export interface VehicleCategory {
  id: VehicleCategoryId;
  name: string; // "Executive"
  description: string; // "Perfect for business travel"
  tagline: string; // "Professional & Comfortable"
  icon: string; // Lucide icon name
  models: VehicleModel[];
  basePrice: number; // Base price for this category
  priceMultiplier: number;
  features: string[]; // Category-wide features
  recommended: boolean; // Is this the recommended option?
}

export interface VehicleSelection {
  category: VehicleCategory | null;
  model: VehicleModel | null;
  selectedAt: Date | null;
}

// 🎯 AVAILABILITY RULES (for different booking types)
export interface VehicleAvailabilityRule {
  bookingTypes: ('oneway' | 'return' | 'hourly' | 'daily' | 'fleet' | 'bespoke')[];
  availableCategories: VehicleCategoryId[];
  defaultCategory?: VehicleCategoryId;
  restrictions?: {
    minPassengers?: number;
    maxPassengers?: number;
    requiresSpecialLicense?: boolean;
  };
}
