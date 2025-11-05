'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';
import type { GooglePlace } from '../location-picker/types';
import { ValidationFeedbackContainer } from '../validation-feedback';
import { TRAVEL_PLANNER_PRO_THEME } from './constants';
import { CalendarPro } from './calendar/calendar-pro';
import { TimeSlotsPro } from './calendar/time-slots-pro';
import { StopsCounterPro } from './components/StopsCounterPro';
import { RoutePreviewPro } from './components/RoutePreviewPro';
import { LocationPicker } from '../location-picker';

interface TravelPlannerProProps {
  className?: string;
  onPlanChange?: (plan: { startDate: Date; endDate?: Date; passengers: number }) => void;
}

export const TravelPlannerPro = ({
  className,
  onPlanChange: _onPlanChange,
}: TravelPlannerProProps) => {
  // State management
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [pickupDate, setPickupDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [pickupLocation, setPickupLocation] = useState<GooglePlace | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<GooglePlace | null>(null);
  const [stopsCount, setStopsCount] = useState(0);
  const [additionalStops, setAdditionalStops] = useState<GooglePlace[]>([]);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [validation, _setValidation] = useState({ errors: [] });

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
    if (!pickupDate || (pickupDate && returnDate)) {
      setPickupDate(date);
      setReturnDate(null);
    } else if (date >= pickupDate) {
      setReturnDate(date);
    } else {
      setPickupDate(date);
      setReturnDate(null);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
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
                value={pickupLocation}
                onChange={setPickupLocation}
              />
              <LocationPicker
                variant='destination'
                placeholder='Drop-off location'
                value={destinationLocation}
                onChange={setDestinationLocation}
              />
            </div>
          </div>

          {/* Additional Stops */}
          <div className={TRAVEL_PLANNER_PRO_THEME.card}>
            <StopsCounterPro
              max={5}
              min={0}
              value={stopsCount}
              onChange={setStopsCount}
              stops={additionalStops}
              onStopsChange={setAdditionalStops}
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
                pickupDate={pickupDate}
                returnDate={returnDate}
                onSelect={handleDateSelect}
                onNavigate={handleNavigate}
                showReturn={!!pickupDate && !returnDate}
              />
              <TimeSlotsPro selected={selectedTime} onSelect={handleTimeSelect} />
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
