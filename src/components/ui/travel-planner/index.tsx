'use client';

import React from 'react';

import { LocationPicker } from '@/components/ui/location-picker';
import { type GooglePlace } from '@/components/ui/location-picker/types';
import { cn } from '@/lib/utils';

import { AdditionalStops } from './components/additional-stops';
import { DateTimeSection } from './components/date-time-section';
import { BOOKING_CONFIG, SECTION_ACCENTS } from './constants';
import { useTravelPlanner } from './hooks/use-travel-planner';
import { type Stop, type TimeSlot, type TravelPlannerProps } from './types';
import { RoutePreview } from './RoutePreview';
import { TravelSummary } from './TravelSummary';

export const TravelPlanner = ({
  bookingType,
  initialPlan,
  onPlanChange,
  className,
  size = 'md',
  showMapPreview = false,
  enableWeatherHints = false,
}: TravelPlannerProps) => {
  // Use orchestration hook
  const travelPlanner = useTravelPlanner(bookingType, initialPlan);

  const {
    plan,
    showReturn,
    showAdditionalStops,
    maxStops,
    availableReturnTimes,
    isValid,
    completionPercentage,
    setPickup,
    setReturn,
    setPickupLocation,
    setDestinationLocation,
    addStop,
    removeStop,
    updateStop,
    setStopsCount,
  } = travelPlanner;

  // Get booking config
  const config = BOOKING_CONFIG[bookingType];

  // Handle plan changes
  React.useEffect(() => {
    if (onPlanChange) {
      onPlanChange(plan);
    }
  }, [plan, onPlanChange]);

  // Handle location changes
  const handlePickupChange = (place: GooglePlace | null) => {
    setPickupLocation(place);
  };

  const handleDestinationChange = (place: GooglePlace | null) => {
    setDestinationLocation(place);
  };

  // Handle date/time changes
  const handleDateChange = (pickup: Date | null, returnDate?: Date) => {
    if (pickup) {
      setPickup(pickup);
    }
    if (returnDate) {
      setReturn(returnDate);
    }
  };

  const handleTimeChange = (pickupTime: TimeSlot | null, returnTime?: TimeSlot | null) => {
    if (plan.pickupDate) {
      setPickup(plan.pickupDate, pickupTime);
    }
    if (returnTime) {
      setReturn(plan.returnDate || new Date(), returnTime);
    }
  };

  // Handle stops changes
  const handleStopsChange = (stops: Stop[]) => {
    // Update all stops
    plan.additionalStops.forEach((stop, index) => {
      if (stops[index]) {
        updateStop(stop.id, stops[index]);
      } else {
        removeStop(stop.id);
      }
    });

    // Add new stops if needed
    if (stops.length > plan.additionalStops.length) {
      const newStops = stops.slice(plan.additionalStops.length);
      newStops.forEach(stop => addStop(stop));
    }

    // Adjust stops count
    setStopsCount(stops.length);
  };

  return (
    <div className={cn('space-y-8', className)}>
      {/* Header */}
      <div className='space-y-2 text-center'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>{config.title}</h2>
        <p className='text-gray-600 dark:text-gray-400'>{config.description}</p>
      </div>

      {/* Main Content - Unified Container */}
      <div
        className={cn(
          'rounded-2xl bg-white/70 p-8 shadow-lg backdrop-blur-md dark:bg-neutral-900/70',
          'border border-neutral-200/30 dark:border-neutral-700/30',
          SECTION_ACCENTS[bookingType]
        )}
      >
        <div className='space-y-8'>
          {/* Row 1: Pickup & Destination */}
          <div>
            <h3 className='mb-6 text-center text-lg font-semibold text-gray-800 dark:text-gray-200'>
              Pickup & Destination
            </h3>

            <div className='grid gap-6 md:grid-cols-2'>
              <LocationPicker
                variant='pickup'
                placeholder='Select pickup location'
                value={plan.pickup}
                onChange={handlePickupChange}
                size={size}
              />
              <LocationPicker
                variant='destination'
                placeholder='Select destination'
                value={plan.destination}
                onChange={handleDestinationChange}
                size={size}
              />
            </div>
          </div>

          {/* Row 2: Calendar & Time - Full Width */}
          <div>
            <h3 className='mb-6 text-center text-lg font-semibold text-gray-800 dark:text-gray-200'>
              Date & Time Selection
            </h3>

            <DateTimeSection
              bookingType={bookingType}
              pickupDate={plan.pickupDate}
              returnDate={plan.returnDate || null}
              pickupTime={plan.pickupTime}
              returnTime={plan.returnTime || null}
              onDateChange={(pickup, returnDate) =>
                handleDateChange(pickup, returnDate || undefined)
              }
              onTimeChange={handleTimeChange}
              showReturn={showReturn}
            />
          </div>

          {/* Row 3: Additional Options - Perfect Match Heights */}
          {showAdditionalStops && (
            <div>
              <h3 className='mb-6 text-center text-lg font-semibold text-gray-800 dark:text-gray-200'>
                Additional Options
              </h3>

              <div className='grid gap-8 lg:grid-cols-2'>
                {/* Left: Additional Stops */}
                <div className='min-h-80'>
                  <AdditionalStops
                    stops={plan.additionalStops}
                    maxStops={maxStops}
                    bookingType={bookingType}
                    onStopsChange={handleStopsChange}
                    showMapPreview={false}
                  />
                </div>

                {/* Right: Route Preview */}
                <RoutePreview plan={plan} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Footer */}
      <TravelSummary plan={plan} isValid={isValid} showReturn={showReturn} />
    </div>
  );
};
