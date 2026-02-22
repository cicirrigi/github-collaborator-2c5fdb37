'use client';

import { GlassmorphismCard } from '@/components/ui/GlassmorphismCard';
import { useBookingState } from '@/hooks/useBookingState';
import { googleServices } from '@/lib/google/google-services';
import { Loader2, Route } from 'lucide-react';
import { useEffect, useState } from 'react';

export function JourneyEstimateDisplay() {
  const { tripConfiguration, setRouteData } = useBookingState();
  const [distanceData, setDistanceData] = useState<{
    distance: string;
    duration: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get pickup and dropoff addresses
  const pickupAddress = tripConfiguration.pickup?.address;
  const dropoffAddress = tripConfiguration.dropoff?.address;

  // Calculate distance when both addresses are available
  useEffect(() => {
    if (!pickupAddress || !dropoffAddress) {
      setDistanceData(null);
      return;
    }

    // Validate address quality to prevent API calls with incomplete addresses
    const isValidAddress = (address: string): boolean => {
      if (!address || address.length < 4) return false;
      // Reject common incomplete patterns that cause DIRECTIONS_ROUTE errors
      const invalidPatterns = /^(m|ma|may|h|he|hea|l|lo|lon|g|ga|gat|ai|air|ter|bri|har)$/i;
      return !invalidPatterns.test(address.trim());
    };

    if (!isValidAddress(pickupAddress) || !isValidAddress(dropoffAddress)) {
      return;
    }

    let isCancelled = false;
    setIsLoading(true);

    const calculateDistance = async () => {
      try {
        const result = await googleServices.getDirections(pickupAddress, dropoffAddress);

        if (!isCancelled && result) {
          setDistanceData({
            distance: result.distance,
            duration: result.duration,
          });

          // Trigger pricing calculation with distance/duration values
          const distanceInMiles = result.distanceValue; // Already in miles from google-services.ts
          const durationInMinutes = result.durationValue / 60; // Convert seconds to minutes

          if (setRouteData) {
            setRouteData(distanceInMiles, durationInMinutes);
          }
        }
      } catch {
        // Silent fallback - don't break the UI
        if (!isCancelled) {
          setDistanceData(null);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    // Debounce the API call
    const timeoutId = setTimeout(calculateDistance, 500);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [pickupAddress, dropoffAddress]);

  // Display logic with fallbacks
  const getDisplayText = () => {
    if (isLoading) {
      return (
        <div className='flex items-center gap-2 text-amber-50 font-light text-sm'>
          <Loader2 className='w-3 h-3 animate-spin' />
          Calculating...
        </div>
      );
    }

    if (distanceData) {
      return `${distanceData.distance} • ${distanceData.duration}`;
    }

    // Fallback to original hardcoded values if no data
    return '25 km • 30 min';
  };

  return (
    <GlassmorphismCard className='p-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Route className='w-4 h-4 text-amber-200/60' />
          <span className='text-white text-sm font-light tracking-wider'>Journey</span>
        </div>
        <div className='text-amber-50 font-light text-sm tabular-nums'>{getDisplayText()}</div>
      </div>
    </GlassmorphismCard>
  );
}
