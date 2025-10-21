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
  const handleDateChange = (pickup: Date, returnDate?: Date) => {
    setPickup(pickup);
    if (returnDate) {
      setReturn(returnDate);
    }
  };

  const handleTimeChange = (pickupTime: TimeSlot | null, returnTime?: TimeSlot | null) => {
    setPickup(plan.pickupDate, pickupTime);
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

                {/* Right: Map Preview - Matching Height */}
                <div className='min-h-80 rounded-xl border border-gray-200/50 bg-gray-50/50 p-6 dark:border-gray-700/50 dark:bg-gray-800/50'>
                  <div className='mb-4 flex items-center gap-3'>
                    <div className='h-5 w-5 rounded-full bg-gradient-to-r from-[#CBB26A] to-[#D4AF37]' />
                    <h4 className='font-semibold text-gray-700 dark:text-gray-300'>
                      Route Preview
                    </h4>
                  </div>

                  <div className='mb-4 flex aspect-video items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800'>
                    <div className='text-center text-gray-500'>
                      <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700'>
                        🗺️
                      </div>
                      <p className='text-sm'>Interactive map</p>
                      <p className='text-xs opacity-75'>Coming soon</p>
                    </div>
                  </div>

                  {/* Route Summary */}
                  {(plan.pickup || plan.destination || plan.additionalStops.length > 0) && (
                    <div className='space-y-2'>
                      <h5 className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                        Route Summary:
                      </h5>
                      <div className='max-h-32 space-y-1 overflow-y-auto text-sm text-gray-700 dark:text-gray-300'>
                        {plan.pickup && (
                          <div className='flex items-center gap-2'>
                            <span className='h-2 w-2 flex-shrink-0 rounded-full bg-green-500'></span>
                            <span className='truncate'>{plan.pickup.address}</span>
                          </div>
                        )}
                        {plan.additionalStops.map(
                          (stop, index) =>
                            stop.address && (
                              <div key={stop.id} className='flex items-center gap-2'>
                                <span className='h-2 w-2 flex-shrink-0 rounded-full bg-yellow-500'></span>
                                <span className='truncate'>
                                  Stop {index + 1}: {stop.address}
                                </span>
                              </div>
                            )
                        )}
                        {plan.destination && (
                          <div className='flex items-center gap-2'>
                            <span className='h-2 w-2 flex-shrink-0 rounded-full bg-red-500'></span>
                            <span className='truncate'>{plan.destination.address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Footer */}
      <div className='border-t border-gray-200 pt-6 dark:border-gray-700'>
        <div className='flex items-center justify-between'>
          <div className='text-sm text-gray-600 dark:text-gray-400'>
            {isValid ? (
              <span className='text-green-600 dark:text-green-400'>✓ Ready to proceed</span>
            ) : (
              <span>Please complete all required fields</span>
            )}
          </div>

          <div className='text-right'>
            <div className='text-sm text-gray-500'>
              {plan.additionalStops.length > 0 && (
                <span>{plan.additionalStops.length} additional stops</span>
              )}
            </div>
            {plan.pickupDate && plan.pickupTime && (
              <div className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                {plan.pickupDate.toLocaleDateString()} at {plan.pickupTime.label}
                {showReturn && plan.returnDate && plan.returnTime && (
                  <span className='ml-2'>
                    → {plan.returnDate.toLocaleDateString()} at {plan.returnTime.label}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
