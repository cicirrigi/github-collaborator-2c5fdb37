/**
 * 🔄 Booking Mapping Types - All interfaces and types
 */

import type { BookingType, TripConfiguration } from '@/hooks/useBookingState/booking.types';

// Re-export for convenience
export type { BookingType, TripConfiguration };

// Database booking record interface - MATCHES NEW `bookings` TABLE
export interface BookingRecord {
  // Required fields
  customer_id: string;
  booking_type: 'oneway' | 'return' | 'hourly' | 'daily' | 'fleet' | 'bespoke';
  trip_configuration_raw: object; // Full TripConfiguration as JSON

  // Optional organization
  organization_id?: string | null;

  // Status fields with enum values
  status?: 'NEW' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  payment_status?: 'unpaid' | 'pending' | 'succeeded' | 'failed' | 'refunded' | 'canceled';

  // System fields
  currency?: string; // defaults to 'GBP'
  source?: string; // defaults to 'web'
  reference?: string; // auto-generated

  // Pricing
  amount_total_pence?: number | null;

  // Optional booking details
  start_at?: string | null;
  end_at?: string | null;
  hours_requested?: number | null;
  days_requested?: number | null;
  passenger_count?: number | null;
  bag_count?: number | null;
  custom_requirements?: string | null;
  billing_entity_id?: string | null;
}

// Booking metadata record - MATCHES ACTUAL `booking_metadata` TABLE
export interface BookingMetadataRecord {
  booking_id: string;

  // Return trip fields
  return_date?: string | null | undefined;
  return_time?: string | null | undefined;
  return_flight_number?: string | null | undefined;

  // Hourly/Daily fields
  hours?: number | null | undefined;
  days?: number | null | undefined;

  // System fields
  operator_id?: string | null | undefined;
  payment_method?: string | null | undefined;
  vehicle_model?: string | null | undefined;
  extra_stops?: number | null | undefined;
}

export interface AdditionalStopRecord {
  booking_id: string;
  stop_order: number;
  address: string;
  latitude: number | null;
  longitude: number | null;
  place_id: string | null;
  stop_charge: number;
}

// Booking leg record - MATCHES NEW `booking_legs` TABLE
export interface BookingLegRecord {
  // Required fields
  booking_id: string; // FK to bookings.id
  leg_number: number;
  leg_kind: 'main' | 'return' | 'fleet_item'; // enum, defaults to 'main'
  status:
    | 'PENDING'
    | 'ASSIGNED'
    | 'ACCEPTED'
    | 'EN_ROUTE'
    | 'ARRIVED'
    | 'STARTED'
    | 'COMPLETED'
    | 'CANCELLED'; // defaults to 'PENDING'
  pickup_address: string; // required
  scheduled_at: string; // timestamptz, required
  vehicle_category_id: string; // required FK

  // Optional location fields
  dropoff_address?: string | null;
  pickup_lat?: number | null;
  pickup_lng?: number | null;
  dropoff_lat?: number | null;
  dropoff_lng?: number | null;
  pickup_place_id?: string | null;
  dropoff_place_id?: string | null;

  // Vehicle & assignment
  vehicle_model_id?: string | null;
  assigned_driver_id?: string | null;
  assigned_vehicle_id?: string | null;

  // Journey data
  stops_raw: object[]; // jsonb array, defaults to []
  flight_number?: string | null;
  passengers?: number | null;
  luggage?: number | null;
  route_input?: object | null;

  // Pricing & metrics
  distance_miles?: number | null;
  duration_min?: number | null;
  leg_amount_pence?: number | null;
  leg_pricing_breakdown?: object | null;
  pricing_calculated_at?: string | null;
  leg_price_pence?: number | null;
  pricing_version?: string | null;

  // Assignment tracking
  assigned_at?: string | null;

  // Optional fields
  preferences?: object | null;
  addons?: object | null;
}
