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

    let isCancelled = false;
    setIsLoading(true);

    const calculateDistance = async () => {
      try {
        const result = await googleServices.getDirections(pickupAddress, dropoffAddress);

        if (!isCancelled && result) {
          console.log('🗺️ Google Maps Result:', result);

          setDistanceData({
            distance: result.distance,
            duration: result.duration,
          });

          // Trigger pricing calculation with distance/duration values
          const distanceInMiles = result.distanceValue / 1609.34; // Convert meters to miles
          const durationInMinutes = result.durationValue / 60; // Convert seconds to minutes

          console.log('💰 Triggering setRouteData:', {
            distanceInMiles,
            durationInMinutes,
            hasSetRouteData: !!setRouteData,
          });

          if (setRouteData) {
            setRouteData(distanceInMiles, durationInMinutes);
            console.log('💰 setRouteData called successfully');
          } else {
            console.error('❌ setRouteData function not available!');
          }
        }
      } catch (error) {
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
