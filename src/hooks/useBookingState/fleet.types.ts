// 🚗 FLEET SELECTION TYPES - Pentru multiple vehicule cu cantități

import type { VehicleCategory, VehicleModel } from './vehicle.types';

export interface FleetVehicleItem {
  id: string; // Unique identifier pentru item
  category: VehicleCategory;
  model: VehicleModel;
  quantity: number; // Câte vehicule de acest tip
  addedAt: Date;
}

export type FleetMode = 'standard' | 'hourly' | 'daily';

export interface FleetSelection {
  vehicles: FleetVehicleItem[];
  totalVehicles: number; // Cache pentru suma quantităților
  totalCapacity: number; // Cache pentru suma pasagerilor
  updatedAt: number | null; // When fleet was last modified (timestamp for performance)

  // 🕐 Fleet Modes
  fleetMode: FleetMode;
  fleetHours: number | null;
  fleetDays: number | null;
}

export interface FleetSummary {
  totalVehicles: number;
  totalCapacity: number;
  categories: {
    [categoryId: string]: {
      count: number;
      models: {
        [modelName: string]: number;
      };
    };
  };
}

// 🎯 Fleet actions pentru Zustand store
export interface FleetActions {
  // Fleet Vehicle Management
  addFleetVehicle: (category: VehicleCategory, model: VehicleModel, quantity?: number) => void;
  removeFleetVehicle: (itemId: string) => void;
  updateFleetVehicleQuantity: (itemId: string, quantity: number) => void;
  clearFleetSelection: () => void;

  // Fleet Utilities
  getFleetSummary: () => FleetSummary;
  getFleetTotalPrice: () => number;
  validateFleetSelection: () => boolean;
}
