// 🚛 FLEET SELECTION ACTIONS - Enterprise Version
import type { BookingState, VehicleCategory, VehicleModel } from '../useBookingState/booking.types';
import type { FleetSummary, FleetVehicleItem } from '../useBookingState/fleet.types';

// 🔧 ENTERPRISE UTILITIES
const getVehicleCapacity = (model: VehicleModel): number => {
  // Safe capacity extraction with fallbacks
  if (typeof model.capacity === 'object' && model.capacity?.passengers) {
    return model.capacity.passengers;
  }
  if (typeof model.capacity === 'number') {
    return model.capacity;
  }
  // Note: Model has invalid capacity structure
  return 4; // Safe fallback for most vehicles
};

const getVehiclePrice = (category: VehicleCategory, model: VehicleModel): number => {
  // Enterprise pricing structure with proper validation
  const basePrice = category.basePrice || 0;
  const multiplier = model.priceMultiplier || 1;

  if (basePrice === 0) {
    // Note: No base price available for category
    return 0;
  }
  if (multiplier === 0) {
    // Note: Invalid price multiplier for model
    return basePrice;
  }

  return basePrice * multiplier;
};

const isFleetCompatibleModel = (category: VehicleCategory, model: VehicleModel): boolean => {
  // Ensure model is suitable for fleet bookings
  const capacity = getVehicleCapacity(model);
  return (
    capacity >= 4 && // Fleet vehicles should accommodate groups
    ['suv', 'mpv', 'executive'].includes(category.id) && // Appropriate categories
    model.specifications?.fuelType !== 'Unknown' // Valid vehicle data
  );
};

export const createFleetActions = (
  set: (partial: Partial<BookingState> | ((state: BookingState) => Partial<BookingState>)) => void,
  get: () => BookingState
) => ({
  // 🚛 FLEET VEHICLE MANAGEMENT with Smart Deduplication
  addFleetVehicle: (category: VehicleCategory, model: VehicleModel, quantity: number = 1) => {
    // ✅ Enterprise validation
    if (!isFleetCompatibleModel(category, model)) {
      // Note: Model not suitable for fleet bookings
      return;
    }

    if (quantity <= 0 || quantity > 20) {
      // Reasonable limits
      // Note: Invalid quantity for fleet vehicle
      return;
    }

    set(state => {
      const currentFleet = state.tripConfiguration.fleetSelection;

      // ✅ SMART DEDUPLICATION - check if model already exists
      const existingIndex = currentFleet.vehicles.findIndex(
        item => item.category.id === category.id && item.model.id === model.id
      );

      let updatedVehicles: FleetVehicleItem[];

      if (existingIndex >= 0) {
        // ✅ Model exists - update quantity instead of duplicating
        updatedVehicles = currentFleet.vehicles.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + quantity, addedAt: new Date() }
            : item
        );
      } else {
        // ✅ New model - add to fleet
        const newItem: FleetVehicleItem = {
          id: `${category.id}-${model.id}-${Date.now()}`,
          category,
          model,
          quantity,
          addedAt: new Date(),
        };
        updatedVehicles = [...currentFleet.vehicles, newItem];
      }

      // ✅ SAFE CALCULATIONS with proper capacity handling
      const totalVehicles = updatedVehicles.reduce((sum, item) => sum + item.quantity, 0);
      const totalCapacity = updatedVehicles.reduce((sum, item) => {
        const vehicleCapacity = getVehicleCapacity(item.model);
        return sum + vehicleCapacity * item.quantity;
      }, 0);

      return {
        ...state,
        tripConfiguration: {
          ...state.tripConfiguration,
          fleetSelection: {
            ...currentFleet,
            vehicles: updatedVehicles,
            totalVehicles,
            totalCapacity,
            updatedAt: new Date(), // ✅ Consistent naming
          },
        },
      };
    });
  },

  removeFleetVehicle: (itemId: string) => {
    set(state => {
      const updatedVehicles = state.tripConfiguration.fleetSelection.vehicles.filter(
        item => item.id !== itemId
      );

      const totalVehicles = updatedVehicles.reduce((sum, item) => sum + item.quantity, 0);
      const totalCapacity = updatedVehicles.reduce((sum, item) => {
        const vehicleCapacity = getVehicleCapacity(item.model);
        return sum + vehicleCapacity * item.quantity;
      }, 0);

      return {
        ...state,
        tripConfiguration: {
          ...state.tripConfiguration,
          fleetSelection: {
            ...state.tripConfiguration.fleetSelection,
            vehicles: updatedVehicles,
            totalVehicles,
            totalCapacity,
            updatedAt: updatedVehicles.length > 0 ? new Date() : null, // ✅ Fixed
          },
        },
      };
    });
  },

  updateFleetVehicleQuantity: (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeFleetVehicle(itemId);
      return;
    }

    set(state => {
      const updatedVehicles = state.tripConfiguration.fleetSelection.vehicles.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );

      const totalVehicles = updatedVehicles.reduce((sum, item) => sum + item.quantity, 0);
      const totalCapacity = updatedVehicles.reduce(
        (sum, item) => sum + item.model.capacity.passengers * item.quantity,
        0
      );

      return {
        ...state,
        tripConfiguration: {
          ...state.tripConfiguration,
          fleetSelection: {
            ...state.tripConfiguration.fleetSelection,
            vehicles: updatedVehicles,
            totalVehicles,
            totalCapacity,
            updatedAt: new Date(), // ✅ Fixed
          },
        },
      };
    });
  },

  clearFleetSelection: () => {
    set(state => ({
      ...state,
      tripConfiguration: {
        ...state.tripConfiguration,
        fleetSelection: {
          vehicles: [],
          totalVehicles: 0,
          totalCapacity: 0,
          updatedAt: null, // ✅ Fixed
        },
      },
    }));
  },

  // 🚛 FLEET UTILITIES
  getFleetSummary: (): FleetSummary => {
    const fleet = get().tripConfiguration.fleetSelection;
    const summary: FleetSummary = {
      totalVehicles: fleet.totalVehicles,
      totalCapacity: fleet.totalCapacity,
      categories: {},
    };

    fleet.vehicles.forEach(item => {
      const categoryId = item.category.id;
      const modelName = item.model.name;

      if (!summary.categories[categoryId]) {
        summary.categories[categoryId] = {
          count: 0,
          models: {},
        };
      }

      summary.categories[categoryId].count += item.quantity;
      summary.categories[categoryId].models[modelName] =
        (summary.categories[categoryId].models[modelName] || 0) + item.quantity;
    });

    return summary;
  },

  getFleetTotalPrice: (): number => {
    const fleet = get().tripConfiguration.fleetSelection;
    return fleet.vehicles.reduce((total, item) => {
      const vehiclePrice = getVehiclePrice(item.category, item.model);
      return total + vehiclePrice * item.quantity;
    }, 0);
  },

  validateFleetSelection: (): boolean => {
    const fleet = get().tripConfiguration.fleetSelection;
    const passengers = get().tripConfiguration.passengers;

    // Minimum validation: at least one vehicle and sufficient capacity
    return fleet.totalVehicles > 0 && fleet.totalCapacity >= passengers;
  },
});
