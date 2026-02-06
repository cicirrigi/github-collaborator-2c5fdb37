// 🚗 VEHICLE ACTIONS - Vehicle Categories & Models Selection
import type { BookingState, VehicleCategory, VehicleModel } from '../useBookingState/booking.types';
import { getAvailableCategoriesForBookingType } from '../useBookingState/vehicle.data';

export const createVehicleActions = (
  set: (partial: Partial<BookingState> | ((state: BookingState) => Partial<BookingState>)) => void,
  get: () => BookingState
) => ({
  // 🎯 VEHICLE CATEGORY SELECTION (without auto-model selection)
  selectVehicleCategory: (category: VehicleCategory) => {
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        selectedVehicle: {
          category,
          model: null, // Nu auto-selectez modelul - user trebuie să aleagă manual
          selectedAt: new Date(),
        },
      },
    }));
  },

  // 🚙 SPECIFIC MODEL SELECTION (null pentru deselection)
  selectVehicleModel: (model: VehicleModel | null) => {
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        selectedVehicle: {
          ...state.tripConfiguration.selectedVehicle,
          model,
          selectedAt: new Date(),
        },
      },
    }));
  },

  // 🗑️ CLEAR VEHICLE SELECTION
  clearVehicleSelection: () => {
    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        selectedVehicle: {
          category: null,
          model: null,
          selectedAt: null,
        },
      },
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
