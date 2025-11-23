// 🚗 VEHICLE ACTIONS - Vehicle Categories & Models Selection
import type { BookingState, VehicleCategory, VehicleModel } from '../useBookingState/booking.types';
import { getAvailableCategoriesForBookingType } from '../useBookingState/vehicle.data';

export const createVehicleActions = (
  set: (partial: Partial<BookingState> | ((state: BookingState) => Partial<BookingState>)) => void,
  get: () => BookingState
) => ({
  // 🎯 VEHICLE CATEGORY SELECTION (with auto-model selection)
  selectVehicleCategory: (category: VehicleCategory) => {
    const defaultModel = category.models[0] || null; // Auto-select first model (recommended)

    set(state => ({
      tripConfiguration: {
        ...state.tripConfiguration,
        selectedVehicle: {
          category,
          model: defaultModel,
          selectedAt: new Date(),
        },
      },
    }));
  },

  // 🚙 SPECIFIC MODEL SELECTION
  selectVehicleModel: (model: VehicleModel) => {
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
  selectVehicleModel: (model: VehicleModel) => void;
  clearVehicleSelection: () => void;
  getAvailableVehicleCategories: () => VehicleCategory[];
}
