/**
 * 🔧 VANTAGE LANE - Comprehensive Booking Schemas
 * Zod validation schemas for bulletproof booking system
 */

import { z } from 'zod';

// Location data schema
const LocationDataSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  lat: z.number().optional(),
  lng: z.number().optional(),
  place_id: z.string().optional(),
  formatted_address: z.string().optional(),
});

// Vehicle selection schemas
const VehicleSelectionSchema = z.object({
  category: z.object({
    id: z.string().min(1, 'Vehicle category ID is required'),
    name: z.string().optional(),
  }),
  model: z
    .object({
      id: z.string().optional(),
      name: z.string().optional(),
    })
    .optional(),
});

const FleetSelectionSchema = z.array(
  z.object({
    vehicle: VehicleSelectionSchema,
    quantity: z.number().min(1),
  })
);

// Service packages & features
const ServicePackagesSchema = z
  .object({
    meetAndGreet: z.boolean().default(false),
    flightTracking: z.boolean().default(false),
    waitTime: z.number().default(0),
  })
  .default({});

const FutureFeaturesSchema = z
  .object({
    recurring: z.boolean().default(false),
    notifications: z.boolean().default(true),
  })
  .default({});

// Base TripConfiguration schema
const BaseTripConfigurationSchema = z.object({
  // Locations
  pickup: LocationDataSchema.nullable(),
  dropoff: LocationDataSchema.nullable(),
  additionalStops: z.array(LocationDataSchema).default([]),

  // Return locations
  returnPickup: LocationDataSchema.nullable(),
  returnDropoff: LocationDataSchema.nullable(),
  returnAdditionalStops: z.array(LocationDataSchema).default([]),
  isDifferentReturnLocation: z.boolean().default(false),

  // Dates & Times (legacy + unified)
  pickupDate: z.date().nullable(),
  returnDate: z.date().nullable(),
  pickupTime: z.string().default(''),
  returnTime: z.string().default(''),
  pickupDateTime: z.date().nullable(),
  returnDateTime: z.date().nullable(),

  // Daily range
  dailyRange: z.tuple([z.date().nullable(), z.date().nullable()]).default([null, null]),

  // Passengers & Logistics
  passengers: z.number().min(1).max(20).default(1),
  luggage: z.number().min(0).max(50).default(0),
  flightNumberPickup: z.string().default(''),
  flightNumberReturn: z.string().default(''),

  // Duration requests
  hoursRequested: z.number().min(1).max(24).nullable(),
  daysRequested: z.number().min(1).max(30).nullable(),

  // Custom requirements
  customRequirements: z.string().default(''),

  // Vehicle & Fleet Selection
  selectedVehicle: VehicleSelectionSchema,
  fleetSelection: FleetSelectionSchema.default([]),

  // Service packages
  servicePackages: ServicePackagesSchema,
  futureFeatures: FutureFeaturesSchema,
});

// Discriminated union based on bookingType
export const TripConfigurationSchema = z.discriminatedUnion('bookingType', [
  // ONEWAY booking
  BaseTripConfigurationSchema.extend({
    bookingType: z.literal('oneway'),
    pickup: LocationDataSchema,
    dropoff: LocationDataSchema,
    pickupDateTime: z.date(),
  }),

  // RETURN booking
  BaseTripConfigurationSchema.extend({
    bookingType: z.literal('return'),
    pickup: LocationDataSchema,
    dropoff: LocationDataSchema,
    pickupDateTime: z.date(),
    returnDateTime: z.date(),
  }),

  // HOURLY booking
  BaseTripConfigurationSchema.extend({
    bookingType: z.literal('hourly'),
    pickup: LocationDataSchema,
    pickupDateTime: z.date(),
    hoursRequested: z.number().min(2).max(12),
  }),

  // DAILY booking
  BaseTripConfigurationSchema.extend({
    bookingType: z.literal('daily'),
    pickup: LocationDataSchema,
    dailyRange: z.tuple([z.date(), z.date()]),
    daysRequested: z.number().min(1).max(30),
  }),

  // FLEET booking
  BaseTripConfigurationSchema.extend({
    bookingType: z.literal('fleet'),
    pickup: LocationDataSchema,
    dropoff: LocationDataSchema,
    pickupDateTime: z.date(),
    fleetSelection: FleetSelectionSchema.min(1, 'At least one vehicle required'),
  }),

  // BESPOKE booking
  BaseTripConfigurationSchema.extend({
    bookingType: z.literal('bespoke'),
    customRequirements: z.string().min(10, 'Please provide detailed requirements'),
  }),

  // EVENTS booking
  BaseTripConfigurationSchema.extend({
    bookingType: z.literal('events'),
    pickup: LocationDataSchema,
    pickupDateTime: z.date(),
    customRequirements: z.string().min(5, 'Event details required'),
  }),

  // CORPORATE booking
  BaseTripConfigurationSchema.extend({
    bookingType: z.literal('corporate'),
    pickup: LocationDataSchema,
    dropoff: LocationDataSchema,
    pickupDateTime: z.date(),
  }),
]);

// Pricing snapshot schema
const PricingSnapshotSchema = z.object({
  finalPricePence: z.number().min(100), // Minimum £1.00
  currency: z.string().length(3).default('GBP'),
  breakdown: z
    .object({
      baseFare: z.number(),
      extras: z.number().default(0),
      taxes: z.number().default(0),
      total: z.number(),
    })
    .optional(),
  calculatedAt: z.date().default(() => new Date()),
});

// API request schemas
export const CreateBookingRequestSchema = z.object({
  tripConfiguration: TripConfigurationSchema,
  bookingType: z.enum([
    'oneway',
    'return',
    'hourly',
    'daily',
    'fleet',
    'bespoke',
    'events',
    'corporate',
  ]),
  pricingSnapshot: PricingSnapshotSchema.optional(),
});

export const PaymentIntentRequestSchema = z.object({
  bookingId: z.string().uuid('Invalid booking ID format'),
});

// Database record schemas (NEW DB SCHEMA)
export const BookingRecordSchema = z.object({
  customer_id: z.string().uuid(),
  booking_type: z.enum(['oneway', 'return', 'hourly', 'daily', 'fleet', 'bespoke']),
  trip_configuration_raw: z.record(z.any()), // NOT NULL in DB
  organization_id: z.string().uuid().nullable(),
  status: z.enum(['NEW', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).default('NEW'),
  payment_status: z
    .enum(['unpaid', 'pending', 'succeeded', 'failed', 'refunded', 'canceled'])
    .default('unpaid'), // NEW DB default is 'unpaid'
  currency: z.string().length(3).default('GBP'),
  source: z.string().default('web'),
  reference: z.string().optional(), // AUTO-GENERATED by generate_booking_reference()
  amount_total_pence: z.number().min(0).nullable(),
  start_at: z.string().nullable(),
  end_at: z.string().nullable(),
  hours_requested: z.number().nullable(),
  days_requested: z.number().nullable(),
  passenger_count: z.number().min(1).nullable(),
  bag_count: z.number().min(0).nullable(),
  custom_requirements: z.string().nullable(),
  billing_entity_id: z.string().uuid().nullable(),
  quote_valid_until: z.string().nullable(), // NEW DB uses quote_valid_until instead of expires_at
});

export const BookingLegRecordSchema = z.object({
  booking_id: z.string().uuid(),
  leg_number: z.number().min(1),
  leg_kind: z.enum(['main', 'return', 'fleet_item']).default('main'),
  status: z
    .enum([
      'PENDING',
      'ASSIGNED',
      'ACCEPTED',
      'EN_ROUTE',
      'ARRIVED',
      'STARTED',
      'COMPLETED',
      'CANCELLED',
    ])
    .default('PENDING'),
  pickup_address: z.string().min(1),
  scheduled_at: z.string(), // ISO string
  vehicle_category_id: z.string(), // TEXT in NEW DB, not UUID
  dropoff_address: z.string().nullable(),
  pickup_lat: z.number().nullable(),
  pickup_lng: z.number().nullable(),
  dropoff_lat: z.number().nullable(),
  dropoff_lng: z.number().nullable(),
  pickup_place_id: z.string().nullable(),
  dropoff_place_id: z.string().nullable(),
  vehicle_model_id: z.string().nullable(), // TEXT in NEW DB, not UUID
  assigned_driver_id: z.string().uuid().nullable(),
  assigned_vehicle_id: z.string().uuid().nullable(),
  stops_raw: z.array(z.record(z.any())).default([]),
  flight_number: z.string().nullable(),
  passengers: z.number().nullable(),
  luggage: z.number().nullable(),
  route_input: z.record(z.any()).nullable(),
  distance_miles: z.number().nullable(),
  duration_min: z.number().nullable(),
  leg_amount_pence: z.number().nullable(),
  leg_pricing_breakdown: z.record(z.any()).nullable(),
  pricing_calculated_at: z.string().nullable(),
  leg_price_pence: z.number().nullable(),
  pricing_version: z.string().nullable(),
  assigned_at: z.string().nullable(),
  preferences: z.record(z.any()).nullable(),
  addons: z.record(z.any()).nullable(),
});

export const BookingPaymentRecordSchema = z.object({
  booking_id: z.string().uuid(),
  stripe_payment_intent_id: z.string().min(1),
  amount_pence: z.number().min(1),
  currency: z.string().length(3),
  status: z.enum(['pending', 'succeeded', 'failed', 'canceled']),
  receipt_email: z.string().email().nullable(),
  metadata: z.record(z.any()).nullable(),
});

// Export types
export type TripConfiguration = z.infer<typeof TripConfigurationSchema>;
export type CreateBookingRequest = z.infer<typeof CreateBookingRequestSchema>;
export type PaymentIntentRequest = z.infer<typeof PaymentIntentRequestSchema>;
export type BookingRecord = z.infer<typeof BookingRecordSchema>;
export type BookingLegRecord = z.infer<typeof BookingLegRecordSchema>;
export type BookingPaymentRecord = z.infer<typeof BookingPaymentRecordSchema>;
export type PricingSnapshot = z.infer<typeof PricingSnapshotSchema>;
