/**
 * 🔄 Common Types & Constants
 * Shared types pentru booking system
 */

// Base types
export type TripType = 'oneway' | 'return' | 'hourly' | 'fleet';
export type VehicleClass = 'executive' | 'luxury' | 'suv' | 'mpv';
export type BookingUiStatus = 'draft' | 'pending_payment' | 'confirmed' | 'completed' | 'cancelled';

// Auth State - pentru Supabase integration
export interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    name?: string;
  } | null;
  isLoading: boolean;
}

// Weather Integration
export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  icon: string;
  timestamp: Date;
}

// Enhanced scalable booking constants pentru dynamic pricing
export const BOOKING_CONSTANTS = {
  // Passenger & Baggage Limits
  MIN_PASSENGERS: 1,
  MAX_PASSENGERS_DEFAULT: 8,
  MIN_BAGGAGE: 0,
  MAX_BAGGAGE_DEFAULT: 6,

  // Trip Configuration Limits
  MIN_ADDITIONAL_STOPS: 0,
  MAX_ADDITIONAL_STOPS: 5,
  HOURLY_MIN_HOURS: 1,
  HOURLY_MAX_HOURS: 12,

  // Base Pricing Structure (extensible pentru vehicle classes)
  PRICING: {
    BASE_FARE: 50, // £50 base fare
    TAX_RATE: 0.2, // 20% VAT
    ON_ROUTE_STOP_FEE: 15, // £15 per on-route stop
    OFF_ROUTE_MILE_RATE: 2.5, // £2.50 per mile off-route

    // Hourly rates by vehicle class
    HOURLY_RATES: {
      executive: 75, // £75/hour
      luxury: 120, // £120/hour
      suv: 95, // £95/hour
      mpv: 85, // £85/hour
    },

    // Distance-based rates (per mile)
    DISTANCE_RATES: {
      executive: 2.2, // £2.20/mile
      luxury: 3.5, // £3.50/mile
      suv: 2.8, // £2.80/mile
      mpv: 2.4, // £2.40/mile
    },

    // Surge pricing multipliers
    SURGE_MULTIPLIERS: {
      peak_hours: 1.2, // 20% increase during peak
      weekend: 1.1, // 10% increase on weekends
      holiday: 1.5, // 50% increase on holidays
    },

    // Service add-ons
    SERVICES: {
      CHILD_SEAT: 10, // £10 per child seat
      WIFI: 5, // £5 for WiFi
      CHAMPAGNE: 25, // £25 for champagne service
      NEWSPAPER: 0, // Complimentary
      PHONE_CHARGER: 0, // Complimentary
    },
  },

  // Business Rules
  RULES: {
    ADVANCE_BOOKING_HOURS: 2, // Minimum 2 hours advance booking
    CANCELLATION_HOURS: 24, // 24 hours free cancellation
    MAX_FUTURE_BOOKING_DAYS: 365, // Maximum 1 year in advance
  },
} as const;
