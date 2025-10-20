'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { TravelPlannerProps, TimeSlot, Stop } from './types';
import { BOOKING_CONFIG } from './constants';
import { useTravelPlanner } from './hooks/use-travel-planner';
import { DateTimeSection } from './components/date-time-section';
import { AdditionalStops } from './components/additional-stops';
import { LocationPicker } from '../location-picker';
import { GooglePlace } from '../location-picker/types';

export const TravelPlanner = ({
  bookingType,
  initialPlan,
  onPlanChange,
  className,
  size = 'md',
  showMapPreview = false,
  enableWeatherHints = false
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
    setStopsCount
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
      setReturn(plan.returnDate, returnTime);
    }
  };

  // Handle stops changes
  const handleStopsChange = (stops: Stop[]) => {
    // Update all stops
    plan.additionalStops.forEach((_, index) => {
      if (stops[index]) {
        updateStop(plan.additionalStops[index].id, stops[index]);
      } else {
        removeStop(plan.additionalStops[index].id);
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
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {config.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {config.description}
        </p>
        
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="text-sm text-gray-500">
            Progress: {Math.round(completionPercentage)}%
          </div>
          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-[#CBB26A] to-[#D4AF37] h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Column 1: Locations */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Pickup & Destination
            </h3>
            
            <div className="space-y-4">
              {/* Pickup Location */}
              <LocationPicker
                variant="pickup"
                placeholder="Pickup location"
                value={plan.pickup}
                onChange={handlePickupChange}
                size={size}
              />

              {/* Destination Location */}
              <LocationPicker
                variant="destination"
                placeholder="Destination"
                value={plan.destination}
                onChange={handleDestinationChange}
                size={size}
              />
            </div>
          </div>

          {/* Additional Stops */}
          {showAdditionalStops && (
            <AdditionalStops
              stops={plan.additionalStops}
              maxStops={maxStops}
              bookingType={bookingType}
              onStopsChange={handleStopsChange}
              showMapPreview={showMapPreview}
            />
          )}
        </div>

        {/* Column 2: Date & Time */}
        <div className="lg:col-span-2">
          <DateTimeSection
            bookingType={bookingType}
            pickupDate={plan.pickupDate}
            returnDate={plan.returnDate}
            pickupTime={plan.pickupTime}
            returnTime={plan.returnTime}
            onDateChange={handleDateChange}
            onTimeChange={handleTimeChange}
            showReturn={showReturn}
          />
        </div>
      </div>

      {/* Summary Footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {isValid ? (
              <span className="text-green-600 dark:text-green-400">
                ✓ Ready to proceed
              </span>
            ) : (
              <span>
                Please complete all required fields
              </span>
            )}
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-500">
              {plan.additionalStops.length > 0 && (
                <span>{plan.additionalStops.length} additional stops</span>
              )}
            </div>
            {plan.pickupDate && plan.pickupTime && (
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {plan.pickupDate.toLocaleDateString()} at {plan.pickupTime.label}
                {showReturn && plan.returnDate && plan.returnTime && (
                  <span className="ml-2">
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
