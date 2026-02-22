/**
 * 🎯 DB Enums - ONLY Real Database Enum Values
 *
 * Contains ONLY actual enum types from Postgres schema.
 * Values match DB exactly (UPPERCASE where required).
 */

// bookings.status enum values (actual DB enum)
export const BookingStatus = {
  NEW: 'NEW',
  CONFIRMED: 'CONFIRMED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];

// bookings.booking_type enum values (actual DB enum)
export const BookingType = {
  ONEWAY: 'oneway',
  RETURN: 'return',
  HOURLY: 'hourly',
  DAILY: 'daily',
  FLEET: 'fleet',
  BESPOKE: 'bespoke',
} as const;

export type BookingType = (typeof BookingType)[keyof typeof BookingType];

// booking_legs.leg_kind enum values (actual DB enum)
export const LegKind = {
  MAIN: 'main',
  RETURN: 'return',
  FLEET_ITEM: 'fleet_item',
} as const;

export type LegKind = (typeof LegKind)[keyof typeof LegKind];

// booking_legs.status enum values (actual DB enum) - UPPERCASE
export const LegStatus = {
  PENDING: 'PENDING',
  ASSIGNED: 'ASSIGNED',
  ACCEPTED: 'ACCEPTED',
  EN_ROUTE: 'EN_ROUTE',
  ARRIVED: 'ARRIVED',
  STARTED: 'STARTED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type LegStatus = (typeof LegStatus)[keyof typeof LegStatus];
