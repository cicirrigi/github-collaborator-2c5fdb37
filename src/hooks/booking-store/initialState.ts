// 🏗️ INITIAL STATE - Booking Store Configuration Factory
import type { TripConfiguration } from '../useBookingState/booking.types';

/**
 * 🎯 Factory function pentru configurația inițială - IMMUTABLE
 * Previne shared references și memory leaks
 */
export const createInitialTripConfiguration = (): TripConfiguration => ({
  // Locații
  pickup: null,
  dropoff: null,
  additionalStops: [],

  // Return Trip Locations
  returnPickup: null,
  returnDropoff: null,
  returnAdditionalStops: [],
  isDifferentReturnLocation: false,

  // Date & Time (legacy + new format)
  pickupDate: null,
  returnDate: null,
  pickupTime: '',
  returnTime: '',
  pickupDateTime: null,
  returnDateTime: null,
  dailyRange: [null, null],

  // Passengers & Logistics
  passengers: 1,
  luggage: 0,
  flightNumberPickup: '',
  flightNumberReturn: '',

  // Booking Type Specific
  hoursRequested: null,
  daysRequested: null,
  customRequirements: '',

  // 🚗 Step 2: Vehicle Selection
  selectedVehicle: {
    category: null,
    model: null,
    selectedAt: null,
  },

  // 🎁 Step 2: Service Packages
  servicePackages: {
    // A. Included Services (ALL classes) - always active
    includedServices: [
      'meet-greet',
      'onboard-wifi',
      'phone-chargers',
      'refreshments',
      'luggage-assistance',
      'pet-friendly',
      'priority-support',
      'airport-wait-time',
      'extra-stops',
    ],

    // B. Free Premium Options (Luxury, SUV, MPV only)
    premiumFeatures: {
      paparazziSafeMode: false,
      frontSeatRequest: false,
      comfortRideMode: false,
      personalLuggagePrivacy: false,
    },

    // C. Universal Trip Preferences (ALL classes)
    tripPreferences: {
      music: 'no-preference' as const,
      temperature: 'no-preference' as const,
      communication: 'no-preference' as const,
    },

    // D. Paid Premium Upgrades (ALL classes)
    paidUpgrades: {
      flowers: null,
      champagne: null,
      securityEscort: false,
    },
  },

  // 🔮 Future Features (hidden from UI)
  futureFeatures: {
    oshiboriTowels: false,
  },
});

/**
 * 🎛️ Initial Wizard State
 */
export const initialWizardState = {
  currentStep: 1,
  completedSteps: [] as number[],
  totalSteps: 4,
};
