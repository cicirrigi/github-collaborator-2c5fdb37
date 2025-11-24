// 🎁 SERVICE PACKAGES ACTIONS - Step 2 Included & Premium Services
import type { BookingState, ServicePackages } from '../useBookingState/booking.types';

// 🟦 A. INCLUDED SERVICES (ALL CLASSES) - Always active
export const INCLUDED_SERVICES = [
  'meet-greet',
  'onboard-wifi',
  'phone-chargers',
  'refreshments',
  'luggage-assistance',
  'pet-friendly',
  'priority-support',
  'airport-wait-time',
  'extra-stops',
];

export const createServicesActions = (
  set: (partial: Partial<BookingState> | ((state: BookingState) => Partial<BookingState>)) => void,
  get: () => BookingState
) => ({
  // 🟨 TOGGLE FREE PREMIUM FEATURES (Luxury, SUV, MPV only)
  togglePremiumFeature: (feature: keyof ServicePackages['premiumFeatures']) => {
    const { tripConfiguration } = get();
    const selectedCategory = tripConfiguration.selectedVehicle.category;

    // Only allow premium features for Luxury, SUV, MPV
    if (!selectedCategory || selectedCategory.id === 'executive') {
      return; // Executive doesn't get premium features
    }

    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        servicePackages: {
          ...state.tripConfiguration.servicePackages,
          premiumFeatures: {
            ...state.tripConfiguration.servicePackages.premiumFeatures,
            [feature]: !state.tripConfiguration.servicePackages.premiumFeatures[feature],
          },
        },
      },
    }));
  },

  // 🔄 RESET PREMIUM FEATURES (when changing vehicle category)
  resetPremiumFeatures: () => {
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        servicePackages: {
          ...state.tripConfiguration.servicePackages,
          premiumFeatures: {
            paparazziSafeMode: false,
            frontSeatRequest: false,
            comfortRideMode: false,
            personalLuggagePrivacy: false,
          },
        },
      },
    }));
  },

  // 📋 GET AVAILABLE PREMIUM FEATURES (based on vehicle category)
  getAvailablePremiumFeatures: () => {
    const { tripConfiguration } = get();
    const selectedCategory = tripConfiguration.selectedVehicle.category;

    // Premium features only for Luxury, SUV, MPV
    if (!selectedCategory || selectedCategory.id === 'executive') {
      return [];
    }

    return ['paparazziSafeMode', 'frontSeatRequest', 'comfortRideMode', 'personalLuggagePrivacy'];
  },
});

// 🔧 TYPE DEFINITION
export interface ServicesActions {
  togglePremiumFeature: (feature: keyof ServicePackages['premiumFeatures']) => void;
  resetPremiumFeatures: () => void;
  getAvailablePremiumFeatures: () => string[];
}
