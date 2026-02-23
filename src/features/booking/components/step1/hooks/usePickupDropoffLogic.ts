'use client';

import { useBookingState } from '@/hooks/useBookingState';
import type { GooglePlaceResult } from '@/lib/google/google-services';
import { useRef } from 'react';

export function usePickupDropoffLogic() {
  const { bookingType, tripConfiguration, setPickup, setDropoff } = useBookingState();

  // Flags to prevent onChange from overriding onPlaceSelect
  const pickupPlaceSelected = useRef(false);
  const dropoffPlaceSelected = useRef(false);

  // Bridge values pentru compatibility
  const pickup = tripConfiguration.pickup?.address || '';
  const dropoff = tripConfiguration.dropoff?.address || '';

  // Bridge functions pentru string → LocationData conversion
  const handlePickupChange = (value: string) => {
    console.log(' handlePickupChange called:', value);

    // Reset flag when user starts typing manually
    pickupPlaceSelected.current = false;

    const locationData = value
      ? {
          placeId: `temp-${Date.now()}`,
          address: value,
          coordinates: [0, 0] as [number, number],
          type: 'address' as const,
          components: {},
        }
      : null;
    setPickup(locationData);
    console.log(' handlePickupChange set locationData:', locationData);
  };

  const handleDropoffChange = (value: string) => {
    // Reset flag when user starts typing manually
    dropoffPlaceSelected.current = false;

    const locationData = value
      ? {
          placeId: `temp-${Date.now()}`,
          address: value,
          coordinates: [0, 0] as [number, number],
          type: 'address' as const,
          components: {},
        }
      : null;
    setDropoff(locationData);
  };

  // NEW: Google Places API handlers - use REAL coordinates
  const handlePickupPlaceSelect = (place: GooglePlaceResult) => {
    console.log('✅ handlePickupPlaceSelect called:', place);
    pickupPlaceSelected.current = true; // Prevent onChange override
    const locationData = {
      placeId: place.placeId,
      address: place.address,
      coordinates: place.coordinates,
      type: place.type,
      components: place.components,
    };
    console.log('✅ handlePickupPlaceSelect set locationData:', locationData);
    setPickup(locationData);
  };

  const handleDropoffPlaceSelect = (place: GooglePlaceResult) => {
    console.log('✅ handleDropoffPlaceSelect called:', place);
    dropoffPlaceSelected.current = true; // Prevent onChange override
    const locationData = {
      placeId: place.placeId,
      address: place.address,
      coordinates: place.coordinates,
      type: place.type,
      components: place.components,
    };
    console.log('✅ handleDropoffPlaceSelect set locationData:', locationData);
    setDropoff(locationData);
  };

  return {
    bookingType,
    pickup,
    dropoff,
    handlePickupChange,
    handleDropoffChange,
    handlePickupPlaceSelect,
    handleDropoffPlaceSelect,
  };
}
