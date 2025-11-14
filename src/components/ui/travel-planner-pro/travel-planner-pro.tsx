'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { LocationPicker } from '../location-picker';
import { ValidationFeedbackContainer } from '../validation-feedback';
import { CalendarPro } from './calendar/calendar-pro';
import { TimeSlotsPro } from './calendar/time-slots-pro';
import { RoutePreviewPro } from './components/RoutePreviewPro';
import { StopsCounterPro } from './components/StopsCounterPro';
import { TRAVEL_PLANNER_PRO_THEME } from './constants';

interface TravelPlannerProProps {
  className?: string;
  onPlanChange?: (plan: { startDate: Date; endDate?: Date; passengers: number }) => void;
}

export const TravelPlannerPro = ({
  className,
  onPlanChange: _onPlanChange,
}: TravelPlannerProProps) => {
  // UI-local state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [validation] = useState({ errors: [] });

  // Global booking state (single source of truth)
  const {
    tripConfiguration,
    setPickup,
    setDropoff,
    setAdditionalStops,
    setPickupDateTime,
    setReturnDateTime,
  } = useBookingState();

  // Handlers
  const handleNavigate = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const handleDateSelect = (date: Date) => {
    const { pickupDate, returnDate, pickupTime, returnTime } = tripConfiguration;

    if (!pickupDate || (pickupDate && returnDate)) {
      // Start a new range: set pickup date, clear return
      setPickupDateTime(date, pickupTime);
      setReturnDateTime(null, returnTime ?? '');
    } else if (date >= pickupDate) {
      // Select return date after pickup
      setReturnDateTime(date, returnTime ?? '');
    } else {
      // New pickup before previous one, reset range
      setPickupDateTime(date, pickupTime);
      setReturnDateTime(null, returnTime ?? '');
    }
  };

  const handleTimeSelect = (time: string) => {
    setPickupDateTime(tripConfiguration.pickupDate, time);
  };

  return (
    <div className={cn(TRAVEL_PLANNER_PRO_THEME.container, className)}>
      {/* Validation Feedback */}
      {showValidationErrors && validation.errors.length > 0 && (
        <ValidationFeedbackContainer
          errors={validation.errors.map((error: { message: string }) => error.message)}
          onDismissErrors={() => setShowValidationErrors(false)}
          className='mb-6'
          showPriorityOnly={true}
        />
      )}
      <header>
        <h2 className={TRAVEL_PLANNER_PRO_THEME.header}>Travel Planner Pro</h2>
        <p className={TRAVEL_PLANNER_PRO_THEME.subtext}>
          Plan your luxury journey with precision and style.
        </p>
      </header>

      {/* GRID PRINCIPAL 2x2 */}
      <div className='grid lg:grid-cols-2 gap-8'>
        {/* COL STÂNGA */}
        <div className='flex flex-col gap-8'>
          {/* Pickup & Drop-off */}
          <div className={TRAVEL_PLANNER_PRO_THEME.card}>
            <h3 className={TRAVEL_PLANNER_PRO_THEME.sectionTitle}>Pickup & Drop-off</h3>
            <div className='space-y-4'>
              <LocationPicker
                variant='pickup'
                placeholder='Pickup location'
                value={tripConfiguration.pickup}
                onChange={setPickup}
              />
              <LocationPicker
                variant='destination'
                placeholder='Drop-off location'
                value={tripConfiguration.dropoff}
                onChange={setDropoff}
              />
            </div>
          </div>

          {/* Additional Stops */}
          <div className={TRAVEL_PLANNER_PRO_THEME.card}>
            <StopsCounterPro
              max={5}
              min={0}
              value={tripConfiguration.additionalStops.length}
              onChange={() => {}}
              stops={tripConfiguration.additionalStops}
              onStopsChange={stops => setAdditionalStops(stops)}
            />
          </div>
        </div>

        {/* COL DREAPTA */}
        <div className='flex flex-col gap-8'>
          {/* Calendar + Time */}
          <div className={TRAVEL_PLANNER_PRO_THEME.card}>
            <h3 className={TRAVEL_PLANNER_PRO_THEME.sectionTitle}>Date & Time</h3>
            <div className={TRAVEL_PLANNER_PRO_THEME.calendar.container}>
              <CalendarPro
                currentMonth={currentMonth}
                pickupDate={tripConfiguration.pickupDate}
                returnDate={tripConfiguration.returnDate ?? null}
                onSelect={handleDateSelect}
                onNavigate={handleNavigate}
                showReturn={!!tripConfiguration.pickupDate && !tripConfiguration.returnDate}
              />
              <TimeSlotsPro selected={tripConfiguration.pickupTime} onSelect={handleTimeSelect} />
            </div>
          </div>

          {/* Route Preview */}
          <div className={TRAVEL_PLANNER_PRO_THEME.card}>
            <RoutePreviewPro />
          </div>
        </div>
      </div>
    </div>
  );
};
