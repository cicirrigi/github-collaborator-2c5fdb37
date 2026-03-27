// 🚗 VEHICLE ACTIONS - Vehicle Categories & Models Selection
import type { BookingState, VehicleCategory, VehicleModel } from '../useBookingState/booking.types';
import { getAvailableCategoriesForBookingType } from '../useBookingState/vehicle.data';

export const createVehicleActions = (
  set: (partial: Partial<BookingState> | ((state: BookingState) => Partial<BookingState>)) => void,
  get: () => BookingState
) => ({
  // 🎯 VEHICLE CATEGORY SELECTION (without auto-model selection)
  selectVehicleCategory: (category: VehicleCategory) => {
    console.log('🚗 Vehicle category selected:', category.id);

    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        selectedVehicle: {
          category,
          model: null, // Nu auto-selectez modelul - user trebuie să aleagă manual
          selectedAt: new Date(),
        },
      },
      // Don't set quoteStatus='stale' here - calculatePricing will set it to 'loading' then 'ready'
    }));

    // 🆕 Trigger pricing calculation with new vehicle
    const state = get();
    const { bookingType, tripConfiguration, pricingState } = state;

    console.log('🔍 Checking if should calculate pricing:', {
      bookingType,
      hasRouteData: pricingState.routeData.isCalculated,
      hasPickup: !!tripConfiguration.pickup,
      hasDropoff: !!tripConfiguration.dropoff,
      distance: pricingState.routeData.distance,
      duration: pricingState.routeData.duration,
    });

    // For hourly/daily bookings, only pickup is required (no route needed)
    const isHourlyOrDaily = bookingType === 'hourly' || bookingType === 'daily';
    const hasRequiredLocations = isHourlyOrDaily
      ? !!tripConfiguration.pickup
      : !!tripConfiguration.pickup && !!tripConfiguration.dropoff;

    const hasRouteDataIfNeeded = isHourlyOrDaily
      ? true // Route not required for hourly/daily
      : pricingState.routeData.isCalculated;

    if (hasRequiredLocations && hasRouteDataIfNeeded) {
      console.log('✅ Triggering calculatePricing for vehicle:', category.id);
      state.calculatePricing();
    } else {
      console.log('❌ NOT triggering calculatePricing - missing data');
    }
  },

  // 🚙 SPECIFIC MODEL SELECTION (null pentru deselection)
  selectVehicleModel: (model: VehicleModel | null) => {
    console.log('🚙 Vehicle MODEL selected:', model?.name);
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        selectedVehicle: state.tripConfiguration.selectedVehicle
          ? {
              ...state.tripConfiguration.selectedVehicle,
              model,
            }
          : null,
      },
      // Don't invalidate quote - model selection doesn't change pricing (same category = same price)
    }));
  },

  // 🗑️ CLEAR VEHICLE SELECTION
  clearVehicleSelection: () => {
    console.log('🗑️ clearVehicleSelection called → Setting quoteStatus to STALE');
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        selectedVehicle: {
          category: null,
          model: null,
          selectedAt: null,
        },
      },
      // FIX 9: Invalidate quote when vehicle cleared
      quoteStatus: 'stale',
    }));
  },

  // 📋 GET AVAILABLE CATEGORIES (based on booking type)
  getAvailableVehicleCategories: () => {
    const { bookingType } = get();
    return getAvailableCategoriesForBookingType(bookingType);
  },
});

// 🔧 TYPE DEFINITION
export interface VehicleActions {
  selectVehicleCategory: (category: VehicleCategory) => void;
  selectVehicleModel: (model: VehicleModel | null) => void;
  clearVehicleSelection: () => void;
  getAvailableVehicleCategories: () => VehicleCategory[];
}
