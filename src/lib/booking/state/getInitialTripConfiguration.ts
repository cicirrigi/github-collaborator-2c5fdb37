/**
 * 🏗️ State Initialization
 * Default trip configuration generator
 */

import type { TripConfiguration } from '../../../types/booking/index';

/**
 * Generates initial trip configuration with safe defaults
 * Used for store initialization și reset operations
 */
export const getInitialTripConfiguration = (): TripConfiguration => ({
  type: 'oneway',
  pickup: null,
  dropoff: null,
  additionalStops: [],
  returnAdditionalStops: [],
  fleetSelection: [],
  isFleetByHour: false,
  hoursRequested: 2, // default pentru hourly
  flightNumberPickup: '',
  flightNumberReturn: '',
  passengers: 1,
  baggage: 0,
  pickupDate: null,
  pickupTime: '',
});
