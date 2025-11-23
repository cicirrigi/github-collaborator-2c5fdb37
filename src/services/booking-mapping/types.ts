/**
 * 🔄 Booking Mapping Types - All interfaces and types
 */

import type { BookingType, TripConfiguration } from '@/hooks/useBookingState/booking.types';

// Re-export for convenience
export type { BookingType, TripConfiguration };

// Database booking record interface (based on our DB schema analysis)
export interface BookingRecord {
  // Required fields
  operator_id: string;
  category: string;
  start_at: string; // timestamp

  // Basic booking info
  trip_type: BookingType;
  passenger_count: number;
  bag_count: number;

  // Optional fields
  vehicle_model?: string | null;
  flight_number?: string | null;
  notes?: string | null;

  // Return trip fields
  return_date?: string | null | undefined;
  return_time?: string | null | undefined;
  return_flight_number?: string | null | undefined;

  // Hourly booking fields
  hours?: number;

  // Daily booking fields
  days?: number;

  // Fleet booking fields
  fleet_executive?: number | null;
  fleet_s_class?: number | null;
  fleet_v_class?: number | null;
  fleet_suv?: number | null;

  // System defaults
  currency: string;
  payment_method: string;
  status: string;
  booking_status: string;
  extra_stops: number;
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

export interface BookingLegRecord {
  // Core booking info
  parent_booking_id: string;
  leg_number: number;
  leg_type: 'outbound' | 'return' | 'fleet_vehicle';
  internal_reference: string;
  driver_reference: string;

  // Location info
  pickup_location: string;
  pickup_lat: number | null;
  pickup_lng: number | null;
  destination: string;
  destination_lat: number | null;
  destination_lng: number | null;

  // Timing & logistics
  scheduled_at: string; // timestamp with time zone
  distance_miles: number | null;
  duration_min: number | null;

  // Vehicle & assignment
  vehicle_category: string | null;
  vehicle_model: string | null;
  vehicle_index: number | null;
  assigned_driver_id: string | null;
  assigned_vehicle_id: string | null;
  assigned_at: string | null; // timestamp
  assigned_by: string | null; // uuid

  // Status & lifecycle
  status: string | null; // defaults to 'pending'
  started_at: string | null; // timestamp
  completed_at: string | null; // timestamp
  cancelled_at: string | null; // timestamp
  cancellation_reason: string | null;

  // Pricing & payouts
  leg_price: number;
  driver_payout: number | null;
  payout_status: string | null; // defaults to 'pending'
  platform_fee: number | null;
  operator_net: number | null;
  paid_at: string | null; // timestamp

  // Audit fields (auto-managed by DB)
  created_at?: string | null; // timestamp - auto
  updated_at?: string | null; // timestamp - auto

  // Optional metadata
  notes: string | null;
}
