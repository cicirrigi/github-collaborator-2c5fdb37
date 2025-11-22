// �️ BOOKING STATE - MODULAR EXPORT (Enterprise Architecture)
//
// 🔄 MIGRATED TO MODULAR STRUCTURE:
// This file now delegates to the new modular booking store
// architecture located in /booking-store/ directory.
//
// All functionality remains 100% compatible - zero breaking changes.

export { useBookingState } from './booking-store';

// � RE-EXPORT ALL TYPES for backward compatibility
export type {
  BookingType,
  LocationData,
  PickupDropoffField,
  SingleBooking,
  StopPoint,
  TripConfiguration,
  VehicleCategory,
  VehicleModel,
  VehicleSelection,
} from './useBookingState/booking.types';
