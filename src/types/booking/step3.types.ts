/**
 * 📊 Step 3 Types - Summary & Pricing
 * Calculul prețurilor și sumar
 */

import type { TripConfiguration } from './step1.types';
import type { VehicleSelection, SelectedService, SpecialRequest } from './step2.types';
import type { BookingUiStatus as BookingStatus } from './common.types';

// Pricing - calculat dinamic
export interface PricingBreakdown {
  baseFare: number;
  additionalStops: number; // £15 per stop on-route
  offRouteDistance: number; // mile extra * rate
  services: number;
  totalBeforeTax: number;
  tax: number;
  total: number;
}

// Booking Summary - Pasul 3
export interface BookingSummary {
  tripConfiguration: TripConfiguration;
  vehicleSelection?: VehicleSelection; // null dacă e Fleet
  services: SelectedService[];
  specialRequests: SpecialRequest[];
  pricing: PricingBreakdown;

  // Metadata
  bookingId?: string;
  createdAt?: Date;
  status: BookingStatus;
}
