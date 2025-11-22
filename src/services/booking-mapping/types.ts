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
