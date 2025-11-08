/**
 * 🚗 Fleet Section Types - Vantage Lane 2.0
 *
 * TypeScript interfaces for Fleet section components.
 * Ensures type safety and consistent data structure.
 */

export type VehicleCategory = 'Executive' | 'Luxury' | 'SUV' | 'MPV' | 'Sports';

export interface VehicleFeature {
  readonly icon?: string;
  readonly text: string;
}

export interface Vehicle {
  readonly id: string;
  readonly name: string;
  readonly category: VehicleCategory;
  readonly image: string;
  readonly description: string;
  readonly passengers: number;
  readonly features: readonly VehicleFeature[];
  readonly priceFrom?: string;
  readonly availability?: 'available' | 'limited' | 'unavailable';
  readonly popular?: boolean;
}

export interface FleetSectionConfig {
  readonly title: {
    readonly primary: string;
    readonly accent: string;
  };
  readonly subtitle: string;
  readonly vehicles: readonly Vehicle[];
  readonly cta?: {
    readonly text: string;
    readonly description?: string;
    readonly action: () => void;
  };
}

export interface FleetSectionProps {
  readonly config?: FleetSectionConfig;
  readonly customConfig?: Partial<FleetSectionConfig>;
  readonly className?: string;
  readonly hideTitle?: boolean;
  readonly maxVehicles?: number;
  readonly categories?: readonly VehicleCategory[];
}

export interface FleetCardProps {
  readonly vehicle: Vehicle;
  readonly onSelect?: (vehicle: Vehicle) => void;
  readonly className?: string;
  readonly showPrice?: boolean;
}
