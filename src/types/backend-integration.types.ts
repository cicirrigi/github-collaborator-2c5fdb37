// 🆕 BACKEND INTEGRATION TYPES - Single source of truth
// All backend-related types in one place

// Import and re-export BookingType from existing types to avoid duplication
import type { BookingType } from '@/hooks/useBookingState/booking.types';
export type { BookingType };

export interface QuoteResponse {
  quoteId: string;
  pricing: {
    finalPrice: number;
    currency: string;
    breakdown: {
      baseFare: number;
      distanceFee: number;
      timeFee: number;
      additionalFees: number;
      servicesTotal: number;
      subtotal: number;
      discounts: number;
      finalTotal: number;
    };
  };
  legs: Array<{
    legNumber: number;
    pickup: string;
    dropoff: string;
    distance: number;
    duration: number;
  }>;
  expiresAt: string;
  status: string;
}

export interface QuoteRequest {
  bookingType: BookingType;
  pickup: {
    address: string;
    coordinates: [number, number];
  };
  dropoff: {
    address: string;
    coordinates: [number, number];
  };
  distance: number | null;
  duration: number | null;
  vehicleType?: string;
  dateTime: string; // ISO string - REQUIRED by backend
  returnDateTime?: string | null; // ISO string for return trips
  hours?: number | null;
  days?: number | null;
  passengers?: number;
  luggage?: number;
  // Additional stops for complex routes
  additionalStops?: Array<{
    address: string;
    coordinates: [number, number];
  }>;
  // Return trip data
  returnPickup?: {
    address: string;
    coordinates: [number, number];
  };
  returnDropoff?: {
    address: string;
    coordinates: [number, number];
  };
  returnAdditionalStops?: Array<{
    address: string;
    coordinates: [number, number];
  }>;
  // Fleet data
  fleetVehicles?: Array<{
    vehicleType: string;
    quantity: number;
  }>;
  // Service packages - ALL services for driver visibility
  servicePackages?: {
    includedServices?: string[]; // Always included services (9 items)
    premiumFeatures?: string[]; // Conditional free features (Luxury/SUV/MPV)
    tripPreferences?: {
      music?: string;
      temperature?: string;
      communication?: string;
    };
    paidUpgrades?: string[]; // Paid upgrades (champagne, flowers, security)
  };
  // Custom requirements
  customRequirements?: string;
  flightNumber?: string;
}

export interface BookingConversionResponse {
  bookingId: string;
  reference: string;
  status: string;
  amount: number;
  currency: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}

export type QuoteStatus = 'idle' | 'loading' | 'ready' | 'stale' | 'error' | 'expired';
