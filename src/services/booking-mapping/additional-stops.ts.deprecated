/**
 * 🚏 Additional Stops Mapping - Separate table logic
 */

import type { AdditionalStopRecord, TripConfiguration } from './types';

/**
 * Maps TripConfiguration additional stops to AdditionalStopRecord array
 */
export const mapAdditionalStops = (
  bookingId: string,
  tripConfig: TripConfiguration
): AdditionalStopRecord[] => {
  if (!tripConfig.additionalStops || tripConfig.additionalStops.length === 0) {
    return [];
  }

  return tripConfig.additionalStops.map((stop, index) => ({
    booking_id: bookingId,
    stop_order: index + 1, // 1-based ordering
    address: stop.address,
    latitude: stop.coordinates ? stop.coordinates[0] : null, // lat is first element
    longitude: stop.coordinates ? stop.coordinates[1] : null, // lng is second element
    place_id: stop.placeId || null,
    stop_charge: 15.0, // £15 per stop as per business rules
  }));
};

/**
 * Maps return additional stops pentru RETURN bookings
 * Acestea sunt stops separate pentru return leg
 */
export const mapReturnAdditionalStops = (
  bookingId: string,
  tripConfig: TripConfiguration
): AdditionalStopRecord[] => {
  if (!tripConfig.returnAdditionalStops || tripConfig.returnAdditionalStops.length === 0) {
    return [];
  }

  // Start ordering after outbound stops
  const outboundStopsCount = tripConfig.additionalStops?.length || 0;
  const startOrder = outboundStopsCount + 1;

  return tripConfig.returnAdditionalStops.map((stop, index) => ({
    booking_id: bookingId,
    stop_order: startOrder + index, // Continue numbering after outbound stops
    address: stop.address,
    latitude: stop.coordinates ? stop.coordinates[0] : null,
    longitude: stop.coordinates ? stop.coordinates[1] : null,
    place_id: stop.placeId || null,
    stop_charge: 15.0, // £15 per stop as per business rules
  }));
};
