'use client';

import { Calendar } from '@/components/calendar/Calendar';
import { DesktopCalendarModal } from '@/components/calendar/variants/modals/DesktopCalendarModal';
import { MobileCalendarModal } from '@/components/calendar/variants/modals/MobileCalendarModal';
import { StatefulTimePicker } from '@/components/time/StatefulTimePicker';
import type { TimeValue } from '@/components/time/core/time-types';
import { GlassmorphismCard } from '@/components/ui/GlassmorphismCard';
import { useBookingState } from '@/hooks/useBookingState';
import { CalendarDays, Clock, Plane } from 'lucide-react';
import { useEffect, useState } from 'react';

// Helper functions to convert between Date and TimeValue for store integration
function combineDateTime(date: Date, timeValue: TimeValue | null): Date {
  if (!timeValue) return date;

  const newDate = new Date(date);
  newDate.setHours(timeValue.hours, timeValue.minutes, 0, 0);
  return newDate;
}

function extractTimeValue(date: Date): TimeValue {
  return {
    hours: date.getHours(),
    minutes: date.getMinutes(),
  };
}

// Device detection hook - copied from DatePicker.tsx
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    check(); // On first load
    window.addEventListener('resize', check);

    return () => window.removeEventListener('resize', check);
  }, []);

  return isMobile;
}

export function CalendarPlaceholder() {
  const {
    bookingType,
    tripConfiguration,
    setPickupDateTime,
    setReturnDateTime,
    setDailyRange,
    setFlightNumberPickup,
  } = useBookingState();
  const isMobile = useIsMobile(); // Add device detection

  // One-way trip states - now using Zustand store
  const selectedDate = tripConfiguration.pickupDateTime || new Date();
  const selectedTime = tripConfiguration.pickupDateTime
    ? extractTimeValue(tripConfiguration.pickupDateTime)
    : null;

  // One-way handlers that update complete DateTime in store
  const handleOnewayDateChange = (date: Date | null) => {
    if (!date) return;
    const newDateTime = combineDateTime(date, selectedTime);
    setPickupDateTime(newDateTime);
  };

  const handleOnewayTimeChange = (timeValue: TimeValue | null) => {
    const newDateTime = combineDateTime(selectedDate, timeValue);
    setPickupDateTime(newDateTime);
  };

  // Return trip states - now using Zustand store
  const departureDate = tripConfiguration.pickupDateTime || new Date();
  const returnDate = tripConfiguration.returnDateTime || new Date();

  // Extract time values from store dates
  const departureTime = tripConfiguration.pickupDateTime
    ? extractTimeValue(tripConfiguration.pickupDateTime)
    : null;
  const returnTime = tripConfiguration.returnDateTime
    ? extractTimeValue(tripConfiguration.returnDateTime)
    : null;

  // Time picker handlers that update complete DateTime in store
  const handleDepartureTimeChange = (timeValue: TimeValue | null) => {
    const newDateTime = combineDateTime(departureDate, timeValue);
    setPickupDateTime(newDateTime);
  };

  const handleReturnTimeChange = (timeValue: TimeValue | null) => {
    const newDateTime = combineDateTime(returnDate, timeValue);
    setReturnDateTime(newDateTime);
  };

  // Auto-calculate dailyRange for daily bookings (for validation)
  useEffect(() => {
    if (
      bookingType === 'daily' &&
      tripConfiguration.pickupDateTime &&
      tripConfiguration.daysRequested &&
      tripConfiguration.daysRequested > 0
    ) {
      const startDate = new Date(tripConfiguration.pickupDateTime);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + tripConfiguration.daysRequested - 1);

      setDailyRange([startDate, endDate]);
    }
  }, [
    bookingType,
    tripConfiguration.pickupDateTime,
    tripConfiguration.daysRequested,
    setDailyRange,
  ]);

  // Modal states - using professional calendar modals
  const [isDepartureDateModalOpen, setIsDepartureDateModalOpen] = useState(false);
  const [isReturnDateModalOpen, setIsReturnDateModalOpen] = useState(false);

  // Return trip professional fields - using FlightInformationSection model
  if (bookingType === 'return') {
    return (
      <GlassmorphismCard>
        <div className='flex items-center gap-2 mb-3'>
          <CalendarDays className='w-4 h-4 text-amber-200/60' />
          <span className='text-white font-medium text-sm'>Journey Dates</span>
        </div>

        <div className='space-y-3'>
          {/* Departure Date Field */}
          <div>
            <label className='text-amber-200/80 text-xs font-medium tracking-wider mb-1 block'>
              DEPARTURE DATE
            </label>
            <button
              onClick={() => setIsDepartureDateModalOpen(true)}
              className='w-full bg-transparent border border-amber-200/20 rounded-md px-3 py-2 text-amber-50 text-sm font-light focus:border-amber-200/40 focus:outline-none transition-colors text-left hover:border-amber-200/30'
            >
              {departureDate.toLocaleDateString('en-GB', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </button>
          </div>

          {/* Return Date Field */}
          <div>
            <label className='text-amber-200/80 text-xs font-medium tracking-wider mb-1 block'>
              RETURN DATE
            </label>
            <button
              onClick={() => setIsReturnDateModalOpen(true)}
              className='w-full bg-transparent border border-amber-200/20 rounded-md px-3 py-2 text-amber-50 text-sm font-light focus:border-amber-200/40 focus:outline-none transition-colors text-left hover:border-amber-200/30'
            >
              {returnDate.toLocaleDateString('en-GB', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </button>
          </div>

          {/* Departure Time Field */}
          <div>
            <label className='text-white text-xs font-medium tracking-wider mb-1 block'>
              DEPARTURE TIME
            </label>
            <div className='bg-transparent border border-amber-200/20 rounded-md px-3 py-2'>
              <StatefulTimePicker
                date={departureDate}
                value={departureTime}
                onChange={handleDepartureTimeChange}
                interval={15}
              />
            </div>
          </div>

          {/* Return Time Field */}
          <div>
            <label className='text-white text-xs font-medium tracking-wider mb-1 block'>
              RETURN TIME
            </label>
            <div className='bg-transparent border border-amber-200/20 rounded-md px-3 py-2'>
              <StatefulTimePicker
                date={returnDate}
                value={returnTime}
                onChange={handleReturnTimeChange}
                interval={15}
              />
            </div>
          </div>
        </div>

        {/* Professional Calendar Modals - Device Detection like DatePicker */}
        {/* Departure Date Modals */}
        {!isMobile && (
          <DesktopCalendarModal
            isOpen={isDepartureDateModalOpen}
            onClose={() => setIsDepartureDateModalOpen(false)}
            onSelect={date => date && setPickupDateTime(date)}
            onConfirm={() => setIsDepartureDateModalOpen(false)}
            value={departureDate}
            timezone='Europe/London'
            label='Choose Departure Date'
          />
        )}

        {isMobile && (
          <MobileCalendarModal
            open={isDepartureDateModalOpen}
            onClose={() => setIsDepartureDateModalOpen(false)}
            onChange={date => {
              if (date && !Array.isArray(date)) {
                setPickupDateTime(date);
              }
            }}
            value={departureDate}
            timezone='Europe/London'
          />
        )}

        {/* Return Date Modals */}
        {!isMobile && (
          <DesktopCalendarModal
            isOpen={isReturnDateModalOpen}
            onClose={() => setIsReturnDateModalOpen(false)}
            onSelect={date => date && setReturnDateTime(date)}
            onConfirm={() => setIsReturnDateModalOpen(false)}
            value={returnDate}
            timezone='Europe/London'
            label='Choose Return Date'
          />
        )}

        {isMobile && (
          <MobileCalendarModal
            open={isReturnDateModalOpen}
            onClose={() => setIsReturnDateModalOpen(false)}
            onChange={date => {
              if (date && !Array.isArray(date)) {
                setReturnDateTime(date);
              }
            }}
            value={returnDate}
            timezone='Europe/London'
          />
        )}
      </GlassmorphismCard>
    );
  }

  // All other booking types use the same one-way calendar layout
  // (hourly, daily, bespoke, fleet, events, corporate)

  return (
    <div className='space-y-6'>
      {/* Inline Calendar */}
      <GlassmorphismCard className='p-4'>
        <Calendar
          value={selectedDate}
          onChange={date => {
            if (date && !Array.isArray(date)) {
              handleOnewayDateChange(date);
            }
          }}
          mode='single'
          timezone='Europe/London'
          className='mx-auto max-w-sm'
        />
      </GlassmorphismCard>

      {/* Time + Flight Number - Parallel layout for ONEWAY, DAILY, HOURLY, FLEET, BESPOKE */}
      {bookingType === 'oneway' ||
      bookingType === 'daily' ||
      bookingType === 'hourly' ||
      bookingType === 'fleet' ||
      bookingType === 'bespoke' ? (
        <GlassmorphismCard className='p-4'>
          <div className='grid grid-cols-2 gap-3'>
            {/* Departure Time - Narrower */}
            <div>
              <div className='flex items-center gap-2 mb-2'>
                <Clock className='w-4 h-4 text-amber-200/60' />
                <span className='text-white font-medium text-sm'>Pickup Time</span>
              </div>
              <StatefulTimePicker
                date={selectedDate}
                value={selectedTime}
                onChange={handleOnewayTimeChange}
                interval={15}
              />
            </div>

            {/* Flight Number - Same height as time picker */}
            <div>
              <div className='flex items-center gap-2 mb-2'>
                <Plane className='w-4 h-4 text-amber-200/60' />
                <span className='text-white font-medium text-sm'>Flight Number</span>
              </div>
              <input
                type='text'
                value={tripConfiguration.flightNumberPickup}
                onChange={e => setFlightNumberPickup(e.target.value)}
                placeholder='Optional (e.g., BA123)'
                className='w-full p-3 text-left rounded-lg bg-white/5 text-white border border-white/10 hover:bg-white/10 transition placeholder:text-amber-200/60 focus:outline-none'
              />
            </div>
          </div>
        </GlassmorphismCard>
      ) : (
        /* Standard Time Picker for non-oneway bookings */
        <GlassmorphismCard className='p-4'>
          <div className='mb-3'>
            <label className='block text-sm font-medium text-white mb-2'>Departure Time</label>
          </div>
          <StatefulTimePicker
            date={selectedDate}
            value={selectedTime}
            onChange={handleOnewayTimeChange}
            interval={15}
          />
        </GlassmorphismCard>
      )}
    </div>
  );
}
