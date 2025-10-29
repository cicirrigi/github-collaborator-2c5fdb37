/**
 * 📋 Booking Types - Centralized exports
 * Re-exports toate types-urile pentru booking system
 */

// Common
export * from './common.types';

// Step-specific
export * from './step1.types';
export * from './step2.types';
export * from './step3.types';
export * from './step4.types';

// Store types
export interface BookingState {
  // Navigation
  currentStep: number;
  completedSteps: number[];
  totalSteps: number;
  canProceedToStep: (step: number) => boolean;

  // Data from steps
  tripConfiguration: import('./step1.types').TripConfiguration;
  vehicleSelection: import('./step2.types').VehicleSelection | null;
  services: import('./step2.types').SelectedService[];
  specialRequests: import('./step2.types').SpecialRequest[];
  paymentDetails: import('./step4.types').PaymentDetails | null;

  // Computed
  pricing: import('./step3.types').PricingBreakdown | null;
  isValid: boolean;

  // Persistence
  isDirty: boolean;
  lastSaved: Date | null;

  // UI State (added by actions)
  isFleetModalOpen?: boolean;
  tempFleetSelection?: import('./step1.types').FleetSelection[];
  isLoading?: boolean;
  stepErrors?: Record<number, string[]>;
  auth?: import('./common.types').AuthState;
  limits?: { passengers: number; baggage: number };
  stepDurations?: Record<number, number>;
  
  // Advanced functionality
  onComplete?: (summary: import('./step3.types').BookingSummary) => void;
  clearStepError?: (step: number) => void;
  setStepError?: (step: number, message: string) => void;
}

// Actions interface
export interface BookingActions {
  // Navigation
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  completeStep: (step: number) => void;

  // Trip Configuration
  setTripType: (type: import('./common.types').TripType) => void;
  setPickupLocation: (
    location: import('../../components/ui/location-picker/types').GooglePlace | null
  ) => void;
  setDropoffLocation: (
    location: import('../../components/ui/location-picker/types').GooglePlace | null
  ) => void;
  setAdditionalStops: (
    stops: import('../../components/ui/location-picker/types').GooglePlace[]
  ) => void;
  setReturnDetails: (details: Partial<import('./step1.types').TripConfiguration>) => void;
  setFleetSelection: (selection: import('./step1.types').FleetSelection[]) => void;
  setPassengerCount: (count: number) => void;
  setBaggageCount: (count: number) => void;
  setDateTime: (date: Date | null, time: string) => void;

  // Vehicle & Services
  setVehicleSelection: (selection: import('./step2.types').VehicleSelection) => void;
  toggleService: (serviceId: string) => void;
  addSpecialRequest: (
    text: string,
    category: import('./step2.types').SpecialRequest['category']
  ) => void;
  removeSpecialRequest: (id: string) => void;

  // Payment
  setPaymentDetails: (details: import('./step4.types').PaymentDetails) => void;

  // Utility
  calculatePricing: () => void;
  validateCurrentStep: () => boolean;
  resetBooking: () => void;
  saveToStorage: () => void;
  loadFromStorage: () => void;
  
  // Enhanced utility actions
  getBookingSummary: () => import('./step3.types').BookingSummary;
  resetStep: (step: number) => void;
  
  // Time tracking
  startTimer: (step: number) => void;
  stopTimer: (step: number) => void;
  
  // Completion
  setOnComplete: (callback: (summary: import('./step3.types').BookingSummary) => void) => void;
  completeBooking: () => void;
}

// Combined Store Type
export type BookingStore = BookingState & BookingActions;

// ================== 🔧 BOOKING CONSTANTS ==================
export const BOOKING_CONSTANTS = {
  // Steps
  TOTAL_STEPS: 4,
  INITIAL_STEP: 1,

  // Passengers & Baggage
  MIN_PASSENGERS: 1,
  MAX_PASSENGERS_DEFAULT: 8,
  MIN_BAGGAGE: 0,
  MAX_BAGGAGE_DEFAULT: 6,

  // Hourly booking
  HOURLY_MIN_HOURS: 2,
  HOURLY_MAX_HOURS: 24,

  // Additional stops
  MAX_ADDITIONAL_STOPS: 5,

  // Fleet
  MAX_FLEET_VEHICLES: 10,

  // Pricing constants
  PRICING: {
    // Base rates per km for different vehicle classes
    BASE_RATE_PER_KM: {
      executive: 2.5,
      luxury: 3.8,
      suv: 4.2,
      mpv: 3.2,
    },
    // Distance rates (alias for compatibility)
    DISTANCE_RATES: {
      executive: 2.5,
      luxury: 3.8,
      suv: 4.2,
      mpv: 3.2,
    },
    // Base fare
    BASE_FARE: 8,
    // Minimum fare
    MIN_FARE: 15,
    // Additional fees
    ON_ROUTE_STOP_FEE: 3,
    // Tax rate
    TAX_RATE: 0.18, // 18% VAT
    // Hourly rates
    HOURLY_RATES: {
      executive: 45,
      luxury: 65,
      suv: 75,
      mpv: 55,
    },
    // Surge multipliers
    SURGE_MULTIPLIERS: {
      low: 1.0,
      medium: 1.25,
      high: 1.5,
      peak: 2.0,
      weekend: 1.15,
    },
  },
} as const;
