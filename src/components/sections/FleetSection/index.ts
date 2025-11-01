/**
 * 📦 Fleet Section Exports - Vantage Lane 2.0
 *
 * Centralized exports for all Fleet Section components.
 * Clean modular architecture with subcomponents.
 */

// Main Components
export { FleetSection } from './FleetSection';
export { FleetCardRefactored as FleetCard } from './FleetCard.refactored';

// Subcomponents
export { FleetCardHeader } from './FleetCardHeader';
export { FleetCardImage } from './FleetCardImage';
export { FleetCardContent } from './FleetCardContent';

// Configuration & Types
export {
  fleetConfig,
  vehicleCategories,
  getVehiclesByCategory,
  getPopularVehicles,
} from './FleetSection.config';
export type {
  Vehicle,
  VehicleCategory,
  VehicleFeature,
  FleetSectionConfig,
  FleetSectionProps,
  FleetCardProps,
} from './FleetSection.types';
