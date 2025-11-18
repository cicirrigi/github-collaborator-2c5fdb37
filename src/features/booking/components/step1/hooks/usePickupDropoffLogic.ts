'use client';

import { useBookingState } from '@/hooks/useBookingState';

export function usePickupDropoffLogic() {
  const { bookingType, tripConfiguration, setPickup, setDropoff } = useBookingState();

  // Bridge values pentru compatibility
  const pickup = tripConfiguration.pickup?.address || '';
  const dropoff = tripConfiguration.dropoff?.address || '';

  // Bridge functions pentru string → LocationData conversion
  const handlePickupChange = (value: string) => {
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
  };

  const handleDropoffChange = (value: string) => {
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

  return {
    bookingType,
    pickup,
    dropoff,
    handlePickupChange,
    handleDropoffChange,
  };
}
