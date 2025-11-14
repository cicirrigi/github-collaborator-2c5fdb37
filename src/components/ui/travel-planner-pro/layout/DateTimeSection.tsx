'use client';

import type { TripConfiguration } from '@/hooks/useBookingState/types';
import type { BookingRule } from '@/lib/booking/booking-rules';
import { CalendarPro } from '../calendar/calendar-pro';
import { TimeSlotsPro } from '../calendar/time-slots-pro';
import { TRAVEL_PLANNER_PRO_THEME } from '../constants';

interface DateTimeSectionProps {
  bookingRule: BookingRule;
  tripConfiguration: TripConfiguration;
  currentMonth: Date;
  onDateSelect: (date: Date) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  onPickupTimeSelect: (time: string) => void;
  onReturnTimeSelect: (time: string) => void;
}

export const DateTimeSection = ({
  bookingRule,
  tripConfiguration,
  onDateSelect,
  onPickupTimeSelect,
  onReturnTimeSelect,
  onNavigate,
}: DateTimeSectionProps) => {
  // RETURN TRIP: Două coloane separate pentru pickup + return
  if (bookingRule.showReturn) {
    return (
      <div className={TRAVEL_PLANNER_PRO_THEME.calendar.container}>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* PICKUP COLUMN */}
          <div className='flex flex-col'>
            <h4 className='text-sm font-medium text-neutral-300 mb-4'>Pickup Date & Time</h4>
            <div className='flex flex-col lg:flex-row lg:items-start lg:gap-6'>
              <CalendarPro
                pickupDate={tripConfiguration.pickupDate}
                returnDate={null}
                onSelect={date => onDateSelect(date)}
                onNavigate={onNavigate}
                showReturn={false}
                currentMonth={tripConfiguration.pickupDate || new Date()}
              />
              <TimeSlotsPro
                selected={tripConfiguration.pickupTime}
                onSelect={onPickupTimeSelect}
                showReturn={false}
              />
            </div>
          </div>

          {/* RETURN COLUMN */}
          <div className='flex flex-col'>
            <h4 className='text-sm font-medium text-neutral-300 mb-4'>Return Date & Time</h4>
            <div className='flex flex-col lg:flex-row lg:items-start lg:gap-6'>
              <CalendarPro
                pickupDate={tripConfiguration.returnDate}
                returnDate={null}
                onSelect={date => onDateSelect(date)}
                onNavigate={onNavigate}
                showReturn={false}
                currentMonth={tripConfiguration.returnDate || new Date()}
              />
              <TimeSlotsPro
                selected={tripConfiguration.returnTime}
                onSelect={onReturnTimeSelect}
                showReturn={false}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SINGLE TRIP: Layout original pentru oneway, hourly, fleet
  return (
    <div className={TRAVEL_PLANNER_PRO_THEME.calendar.container}>
      <div className='flex flex-col lg:flex-row lg:items-start lg:gap-8'>
        <CalendarPro
          pickupDate={tripConfiguration.pickupDate}
          returnDate={null}
          onSelect={onDateSelect}
          onNavigate={onNavigate}
          showReturn={false}
          currentMonth={tripConfiguration.pickupDate || new Date()}
        />
        <div className='space-y-4'>
          <TimeSlotsPro
            selected={tripConfiguration.pickupTime}
            onSelect={onPickupTimeSelect}
            showReturn={false}
          />
        </div>
      </div>
    </div>
  );
};
