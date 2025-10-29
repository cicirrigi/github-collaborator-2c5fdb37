/**
 * 🎯 Step 1 Types - Trip Configuration
 * Locații, tipul călătoriei, pasageri
 */

import type { GooglePlace } from '../../components/ui/location-picker/types';
import type { TripType, VehicleClass } from './common.types';

// Re-export pentru alte fișiere
export type { VehicleClass };

// Fleet Selection
export interface FleetSelection {
  vehicleId: string;
  quantity: number;
}

// Vehicle Model pentru Fleet
export interface VehicleModel {
  id: string;
  name: string;
  class: VehicleClass;
  maxPassengers: number;
  maxBaggage: number;
  imageUrl?: string;
  basePrice: number;
}

// Trip Configuration - Pasul 1 complet
export interface TripConfiguration {
  type: TripType;

  // Basic locations
  pickup: GooglePlace | null;
  dropoff: GooglePlace | null;

  // Additional stops (oneway/return)
  additionalStops: GooglePlace[];

  // Return specific
  returnFlight?: string;
  returnDate?: Date;
  returnTime?: string;
  sameDayReturn?: boolean;
  returnAdditionalStops: GooglePlace[];

  // Hourly specific
  hoursRequested?: number;

  // Fleet specific
  fleetSelection: FleetSelection[];
  isFleetByHour?: boolean;

  // Pasageri și bagaje
  passengers: number;
  baggage: number;

  // Dates & times
  pickupDate: Date | null;
  pickupTime: string;
  
  // Distance calculation (filled by Google Maps API)
  distanceKm?: number;
}
