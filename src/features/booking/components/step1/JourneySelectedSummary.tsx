'use client';

import { GlassmorphismCard } from '@/components/ui/GlassmorphismCard';
import { useBookingState } from '@/hooks/useBookingState';
import { googleServices } from '@/lib/google/google-services';
import { Loader2, Route } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export function JourneySelectedSummary() {
  const { tripConfiguration, bookingType, setRouteData } = useBookingState();
  const [distanceData, setDistanceData] = useState<{
    distance: string;
    duration: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Extract selected date and time from tripConfiguration
  const selectedDate = tripConfiguration.pickupDateTime || null;
  const selectedTime = selectedDate
    ? {
        hours: selectedDate.getHours(),
        minutes: selectedDate.getMinutes(),
      }
    : null;

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

    // Enhanced address validation to prevent API spam with incomplete addresses
    const isValidAddress = (address: string): boolean => {
      if (!address || address.length < 8) return false; // Increased minimum length
      // Reject common incomplete patterns that cause DIRECTIONS_ROUTE errors
      const invalidPatterns =
        /^(m|ma|may|h|he|hea|l|lo|lon|g|ga|gat|ai|air|ter|bri|har|stat|street|road|ave|avenue)$/i;
      if (invalidPatterns.test(address.trim())) return false;
      // Require at least one space (suggesting full address format)
      return address.trim().includes(' ');
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
              } catch {
                // Fall back to outbound only if return calculation fails
                // Silent fallback to prevent console noise
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

    // Debounce the API call - increased to 1000ms to prevent spam
    const timeoutId = setTimeout(calculateDistance, 1000);

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
    tripConfiguration.additionalStops,
  ]);

  // Display logic with fallbacks
  const getDisplayText = () => {
    if (isLoading) {
      return (
        <div className='flex items-center gap-2 text-amber-100 font-light text-xs'>
          <Loader2 className='w-3 h-3 animate-spin' />
          Calculating...
        </div>
      );
    }

    if (distanceData) {
      return `${distanceData.distance} • ${distanceData.duration}`;
    }

    // Show empty state until real data is calculated
    return '0 km • 0 min';
  };

  return (
    <GlassmorphismCard className='p-4 border border-amber-300/20'>
      <div className='grid grid-cols-2 gap-4 relative'>
        {/* Journey Section - Left Half */}
        <div className='space-y-2'>
          <div className='flex items-center gap-2 ml-2'>
            <div className='w-4 h-4 bg-gradient-to-br from-amber-400/20 to-amber-500/30 rounded-full border border-amber-400/40 flex items-center justify-center'>
              <Route className='w-2 h-2 text-amber-300' />
            </div>
            <span className='text-white text-sm font-medium tracking-wider'>JOURNEY</span>
          </div>
          <div className='bg-gradient-to-r from-amber-400/10 to-amber-500/10 border border-amber-300/30 rounded-lg px-3 py-2 relative overflow-hidden'>
            <div className='text-amber-100 font-semibold text-sm tabular-nums tracking-wide relative z-10'>
              {getDisplayText()}
            </div>
            <div className='absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/20 to-transparent -skew-x-12 animate-shimmer'></div>
          </div>
        </div>

        {/* Selected Summary Section - Right Half */}
        <div className='space-y-2'>
          <div className='flex items-center gap-2 ml-2'>
            <div className='w-4 h-4 bg-gradient-to-br from-amber-400/30 to-amber-500/40 rounded-full border border-amber-400/50 flex items-center justify-center'>
              <div className='w-1.5 h-1.5 bg-amber-400 rounded-full'></div>
            </div>
            <span className='text-white text-sm font-medium tracking-wider'>SELECTED</span>
          </div>
          {selectedDate && selectedTime ? (
            <div className='bg-gradient-to-r from-amber-400/15 to-amber-500/15 border border-amber-300/40 rounded-lg px-3 py-2 relative overflow-hidden'>
              <div className='text-amber-100 font-semibold text-sm tabular-nums tracking-wide relative z-10'>
                {selectedDate.toLocaleDateString('en-GB', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                })}{' '}
                at {selectedTime.hours.toString().padStart(2, '0')}:
                {selectedTime.minutes.toString().padStart(2, '0')}
              </div>
              <div className='absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/20 to-transparent -skew-x-12 animate-shimmer'></div>
            </div>
          ) : (
            <div className='bg-gradient-to-r from-amber-400/10 to-amber-500/10 border border-amber-300/30 rounded-lg px-3 py-2 opacity-50'>
              <div className='text-amber-100/60 font-semibold text-sm tracking-wide'>
                Select date & time
              </div>
            </div>
          )}
        </div>

        {/* Thin Vertical Separator */}
        <div className='absolute left-1/2 top-8 bottom-2 w-px bg-gradient-to-b from-transparent via-amber-300/80 to-transparent transform -translate-x-1/2'></div>
      </div>
    </GlassmorphismCard>
  );
}
