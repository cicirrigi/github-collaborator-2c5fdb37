/**
 * 🚗 Step 2 Types - Vehicles & Services
 * Selecția mașinilor și serviciilor
 */

import type { VehicleClass, VehicleModel } from './step1.types';

// Services - Pasul 2
export interface BookingService {
  id: string;
  name: string;
  description: string;
  price: number;
  isIncluded: boolean;
  category: 'champagne' | 'flowers' | 'security' | 'comfort' | 'convenience';

  // Pentru servicii cu variante (champagne, flowers)
  variants?: ServiceVariant[];
}

export interface ServiceVariant {
  id: string;
  name: string;
  description: string;
  priceAdjustment: number; // +/- față de prețul de bază
  imageUrl?: string;
}

export interface SelectedService extends BookingService {
  isSelected: boolean;
}

// Vehicle Selection - Pasul 2 (dacă nu e Fleet)
export interface VehicleSelection {
  class: VehicleClass;
  model: VehicleModel;
  services: SelectedService[];
}

// Special Requests - Pasul 2
export interface SpecialRequest {
  id: string;
  text: string;
  category: 'accessibility' | 'child_seats' | 'other';
}

// Ride Preferences - Pasul 2
export interface RidePreferences {
  music: {
    enabled: boolean;
    genre?: 'classical' | 'jazz' | 'pop' | 'none' | 'custom';
    customRequest?: string;
  };
  temperature: {
    enabled: boolean;
    value?: number; // Celsius
  };
  newspapers: {
    enabled: boolean;
    preferences?: string[];
  };
  refreshments: {
    enabled: boolean;
    waterType?: 'still' | 'sparkling' | 'both';
    snacks?: boolean;
  };
}
