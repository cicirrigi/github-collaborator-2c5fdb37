'use client';

import { GlassmorphismCard } from '@/components/ui/GlassmorphismCard';
import { useBookingState } from '@/hooks/useBookingState';
import { googleServices } from '@/lib/google/google-services';
import { Loader2, Route } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export function JourneyEstimateDisplay() {
  const { tripConfiguration, bookingType, setRouteData } = useBookingState();
  const [distanceData, setDistanceData] = useState<{
    distance: string;
    duration: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Smart dependency: only count completed stops (with placeId) to avoid spam
  const completedStops = useMemo(() => {
    return (tripConfiguration.additionalStops || [])
      .filter(stop => stop?.placeId && stop?.placeId.trim() && !stop.placeId.startsWith('temp-'))
      .map(stop => stop.placeId)
      .join(',');
  }, [tripConfiguration.additionalStops]);

  // Get pickup and dropoff addresses for outbound leg
  const pickupAddress = tripConfiguration.pickup?.address;
  const dropoffAddress = tripConfiguration.dropoff?.address;

  // Get return addresses for different return location
  const isDifferentReturnLocation = tripConfiguration.isDifferentReturnLocation;
  const returnPickupAddress = tripConfiguration.returnPickup?.address;
  const returnDropoffAddress = tripConfiguration.returnDropoff?.address;

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
        // Check if we have additional stops to include in route calculation
        const additionalStops = tripConfiguration.additionalStops || [];
        const validStops = additionalStops.filter(stop => stop?.address?.trim());

        let result;
        if (validStops.length > 0) {
          // Use waypoints for route with stops: [pickup, stop1, stop2, dropoff]
          const locations = [
            pickupAddress,
            ...validStops.map(stop => stop.address),
            dropoffAddress,
          ];
          result = await googleServices.getDirectionsWithWaypoints(locations);
        } else {
          // Use regular direct route for no stops
          result = await googleServices.getDirections(pickupAddress, dropoffAddress);
        }

        if (!isCancelled && result) {
          let finalDistance = result.distance;
          let finalDuration = result.duration;
          let finalDistanceValue = result.distanceValue;
          let finalDurationValue = result.durationValue / 60; // Convert to minutes

          // Handle return trip calculations
          if (bookingType === 'return') {
            if (!isDifferentReturnLocation) {
              // Normal return: double the outbound distance
              finalDistanceValue = finalDistanceValue * 2;
              const totalDurationMinutes = (result.durationValue / 60) * 2;

              // Format display text
              const roundedDistance = Math.round(finalDistanceValue * 10) / 10;
              finalDistance = `${roundedDistance} miles`;

              const hours = Math.floor(totalDurationMinutes / 60);
              const minutes = Math.round(totalDurationMinutes % 60);
              finalDuration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes} mins`;
              finalDurationValue = totalDurationMinutes;
            } else if (returnPickupAddress && returnDropoffAddress) {
              // Different return location: calculate return leg separately
              try {
                const returnResult = await googleServices.getDirections(
                  returnPickupAddress,
                  returnDropoffAddress
                );
                if (returnResult) {
                  finalDistanceValue = result.distanceValue + returnResult.distanceValue;
                  finalDurationValue = result.durationValue / 60 + returnResult.durationValue / 60;

                  // Format combined display text
                  const roundedDistance = Math.round(finalDistanceValue * 10) / 10;
                  finalDistance = `${roundedDistance} miles`;

                  const hours = Math.floor(finalDurationValue / 60);
                  const minutes = Math.round(finalDurationValue % 60);
                  finalDuration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes} mins`;
                }
              } catch (error) {
                console.warn('Return leg calculation failed:', error);
                // Fall back to outbound only if return calculation fails
              }
            }
          }

          setDistanceData({
            distance: finalDistance,
            duration: finalDuration,
          });

          // Trigger pricing calculation with final distance/duration values
          if (setRouteData) {
            setRouteData(finalDistanceValue, finalDurationValue);
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
  }, [
    pickupAddress,
    dropoffAddress,
    completedStops,
    bookingType,
    isDifferentReturnLocation,
    returnPickupAddress,
    returnDropoffAddress,
    setRouteData,
  ]);

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
    <GlassmorphismCard className='p-5 border border-amber-300/20'>
      <div className='flex items-center gap-3 md:justify-between'>
        <div className='w-8 h-8 bg-gradient-to-br from-amber-400/20 to-amber-500/30 rounded-full border border-amber-400/40 flex items-center justify-center'>
          <Route className='w-4 h-4 text-amber-300' />
        </div>
        <span className='text-white text-sm font-medium tracking-wider'>JOURNEY:</span>
        <div className='bg-gradient-to-r from-amber-400/10 to-amber-500/10 border border-amber-300/30 rounded-lg px-3 py-1.5 md:px-4 md:py-2 relative overflow-hidden'>
          <div className='text-amber-100 font-semibold text-sm md:text-base tabular-nums tracking-wide relative z-10'>
            {getDisplayText()}
          </div>
          <div className='absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/20 to-transparent -skew-x-12 animate-shimmer'></div>
        </div>
      </div>
    </GlassmorphismCard>
  );
}
