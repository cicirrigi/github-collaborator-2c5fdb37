// 🎯 BOOKING TYPES - All type definitions for the unified booking system

// Import and re-export vehicle types for easy access
import type { BookingConfirmation, ConfirmationActions } from './confirmation.types';
import type { FleetActions, FleetSelection, FleetSummary } from './fleet.types';
import type { VehicleCategory, VehicleModel, VehicleSelection } from './vehicle.types';
export type {
  BookingConfirmation,
  ConfirmationActions,
  FleetActions,
  FleetSelection,
  FleetSummary,
  VehicleCategory,
  VehicleModel,
  VehicleSelection,
};

export type Coordinates = [number, number];

export interface LocationData {
  placeId: string;
  address: string;
  coordinates: Coordinates;
  type: 'address' | 'airport' | 'hotel' | 'poi';
  components: Record<string, string>;
}

export type BookingType =
  | 'oneway'
  | 'return'
  | 'hourly'
  | 'daily'
  | 'fleet'
  | 'bespoke'
  | 'events'
  | 'corporate';

export interface TripConfiguration {
  // Locations
  pickup: LocationData | null;
  dropoff: LocationData | null;
  additionalStops: LocationData[];

  // Return Trip Locations
  returnPickup: LocationData | null;
  returnDropoff: LocationData | null;
  returnAdditionalStops: LocationData[];
  isDifferentReturnLocation: boolean;

  // Dates & Times (legacy format - keeping compatibility)
  pickupDate: Date | null;
  returnDate: Date | null;
  pickupTime: string;
  returnTime: string;

  // Dates & Times (unified)
  pickupDateTime: Date | null;
  returnDateTime: Date | null;

  // Daily range for daily bookings
  dailyRange: [Date | null, Date | null];

  // Passengers & Logistics
  passengers: number;
  luggage: number;
  flightNumberPickup: string;
  flightNumberReturn: string;

  // Hourly bookings
  hoursRequested: number | null;

  // Daily bookings
  daysRequested: number | null;

  // Bespoke bookings
  customRequirements: string;

  // 🚗 Step 2: Vehicle Selection (single vehicle)
  selectedVehicle: VehicleSelection;

  // 🚛 Step 2: Fleet Selection (multiple vehicles)
  fleetSelection: FleetSelection;

  // 🎁 Step 2: Service Packages
  servicePackages: ServicePackages;

  // 🔮 Future Features (hidden from UI)
  futureFeatures: FutureFeatures;
}

export interface BookingState {
  // BOOKING TYPE
  bookingType: BookingType;
  setBookingType: (type: BookingType) => void;

  // TRIP CONFIGURATION
  tripConfiguration: TripConfiguration;

  // PRICING STATE
  pricingState: PricingState;

  // CONFIRMATION STATE
  confirmation: BookingConfirmation | null;

  // WIZARD STATE
  currentStep: number;
  completedSteps: number[];
  totalSteps: number;

  // LOCATION ACTIONS
  setPickup: (location: LocationData | null) => void;
  setDropoff: (location: LocationData | null) => void;
  setAdditionalStops: (stops: LocationData[]) => void;

  // RETURN TRIP ACTIONS
  setReturnPickup: (location: LocationData | null) => void;
  setReturnDropoff: (location: LocationData | null) => void;
  setReturnAdditionalStops: (stops: LocationData[]) => void;
  setIsDifferentReturnLocation: (value: boolean) => void;

  // DATE & TIME ACTIONS (simplified)
  setPickupDateTime: (date: Date | null) => void;
  setReturnDateTime: (date: Date | null) => void;
  setDailyRange: (range: [Date | null, Date | null]) => void;

  // PASSENGER & LOGISTICS ACTIONS
  setPassengers: (value: number) => void;
  setLuggage: (value: number) => void;
  setFlightNumberPickup: (value: string) => void;
  setFlightNumberReturn: (value: string) => void;
  setHoursRequested: (value: number | null) => void;
  setDaysRequested: (value: number | null) => void;
  setCustomRequirements: (value: string) => void;

  // 🚗 VEHICLE SELECTION ACTIONS (single vehicle)
  selectVehicleCategory: (category: VehicleCategory) => void;
  selectVehicleModel: (model: VehicleModel | null) => void;
  clearVehicleSelection: () => void;
  getAvailableVehicleCategories: () => VehicleCategory[];

  // 🚛 FLEET SELECTION ACTIONS (multiple vehicles)
  addFleetVehicle: (category: VehicleCategory, model: VehicleModel, quantity?: number) => void;
  removeFleetVehicle: (itemId: string) => void;
  updateFleetVehicleQuantity: (itemId: string, quantity: number) => void;
  clearFleetSelection: () => void;

  // Fleet Mode Actions
  setFleetMode: (mode: 'standard' | 'hourly' | 'daily') => void;
  setFleetHours: (hours: number) => void;
  setFleetDays: (days: number) => void;

  getFleetSummary: () => FleetSummary;
  getFleetTotalPrice: () => number;
  validateFleetSelection: () => boolean;

  // 🎁 STEP 2 SERVICE ACTIONS
  setMusicPreference: (music: ServicePackages['tripPreferences']['music']) => void;
  setTemperaturePreference: (
    temperature: ServicePackages['tripPreferences']['temperature']
  ) => void;
  setCommunicationStyle: (
    communication: ServicePackages['tripPreferences']['communication']
  ) => void;
  resetTripPreferences: () => void;
  togglePremiumFeature: (feature: keyof ServicePackages['premiumFeatures']) => void;

  // 💰 PAID UPGRADES ACTIONS
  setFlowersUpgrade: (flowers: ServicePackages['paidUpgrades']['flowers']) => void;
  setChampagneUpgrade: (champagne: ServicePackages['paidUpgrades']['champagne']) => void;
  toggleSecurityEscort: () => void;
  calculateUpgradesCost: () => number;
  clearAllUpgrades: () => void;

  // WIZARD ACTIONS
  setCurrentStep: (step: number) => void;
  setCompletedSteps: (steps: number[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  canProceedToStep: (step: number) => boolean;
  validateCurrentStep: () => boolean;
  validateStep1Complete: () => boolean;
  validateStep2Complete: () => { isValid: boolean; errors: string[]; warnings: string[] };
  validateCrossStep: () => {
    isValid: boolean;
    recommendations: string[];
    warnings: string[];
    errors: string[];
  };
  getSmartRecommendations: () => string[];
  resetTrip: () => void;

  // 💰 PRICING ACTIONS
  setRouteData: (distance: number, duration: number) => void;
  clearRouteData: () => void;
  calculatePricing: () => Promise<void>;
  setPriceForVehicle: (vehicleType: string, price: number) => void;
  clearAllPrices: () => void;
  getPriceForVehicle: (vehicleType: string) => number | null;
  hasPricingData: () => boolean;
  shouldRecalculatePricing: () => boolean;

  // UTILITY ACTIONS
  calculateEstimatedDistanceAndTime: () => { distanceKm: number; durationMinutes: number };

  // 🚗 RETURN TRIP ENTERPRISE LOGIC
  prepareReturnTripBookings: () => { outbound: SingleBooking; inbound: SingleBooking } | null;
}

// 🎯 SINGLE BOOKING TYPE (pentru backend API)
export interface SingleBooking {
  type: 'oneway';
  pickup: LocationData;
  dropoff: LocationData;
  pickupDateTime: Date;
  passengers: number;
  luggage: number;
  vehicle: VehicleSelection;
  flightNumber?: string;
  specialRequirements?: string;
  estimatedPrice?: number;
}

// 🎁 STEP 2 SERVICE PACKAGES TYPES
export interface ServicePackages {
  // A. Included Services (ALL classes)
  includedServices: string[]; // Always all 9 services

  // B. Free Premium Options (Luxury, SUV, MPV only)
  premiumFeatures: {
    paparazziSafeMode: boolean;
    frontSeatRequest: boolean;
    comfortRideMode: boolean;
    personalLuggagePrivacy: boolean;
  };

  // C. Universal Trip Preferences (ALL classes)
  tripPreferences: {
    music: 'no-preference' | 'classical' | 'jazz' | 'pop' | 'rock' | 'silence';
    temperature: 'no-preference' | 'cool' | 'comfortable' | 'warm';
    communication: 'no-preference' | 'friendly' | 'professional' | 'minimal';
  };

  // D. Paid Premium Upgrades (ALL classes)
  paidUpgrades: {
    flowers: null | 'standard' | 'exclusive';
    champagne: null | 'moet' | 'dom-perignon';
    securityEscort: boolean;
  };
}

// � PRICING STATE
export interface PricingState {
  // Distance and duration from Google Maps
  routeData: {
    distance: number | null; // miles
    duration: number | null; // minutes
    isCalculated: boolean;
  };

  // Calculated prices per vehicle type
  vehiclePrices: Record<string, number | null>; // vehicleType -> price in GBP

  // Pricing calculation status
  isLoadingPrices: boolean;
  pricingError: string | null;
  lastPricingUpdate: Date | null;
}

export interface PricingActions {
  // Route data actions
  setRouteData: (distance: number, duration: number) => void;
  clearRouteData: () => void;

  // Pricing calculation actions
  calculatePricing: () => Promise<void>;
  setPriceForVehicle: (vehicleType: string, price: number) => void;
  clearAllPrices: () => void;

  // Utility actions
  getPriceForVehicle: (vehicleType: string) => number | null;
  hasPricingData: () => boolean;
  shouldRecalculatePricing: () => boolean;
}

// �� FUTURE FEATURES (hidden from UI)
export interface FutureFeatures {
  oshiboriTowels: boolean;
}

// 🔧 UTILITY TYPE EXPORTS
export type PickupDropoffField = LocationData | null;
export type StopPoint = LocationData;
