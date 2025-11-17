'use client';

import { UnifiedCalendar } from '@/components/calendar/UnifiedCalendar';
import { useBookingState } from '@/hooks/useBookingState';
import { Calendar } from 'lucide-react';
import { CardHeader } from './CardHeader';

export function CardDateTime() {
  const { tripConfiguration, bookingType, setPickupDateTime, setReturnDateTime, setDailyRange } =
    useBookingState();

  return (
    <div className='vl-card-flex'>
      <CardHeader icon={Calendar} title='Date & Time' subtitle='Select when you travel' />

      <div className='vl-card-inner'>
        {bookingType === 'oneway' && (
          <UnifiedCalendar
            bookingType='oneway'
            date={tripConfiguration.pickupDateTime}
            onChangeDate={setPickupDateTime}
          />
        )}

        {bookingType === 'return' && (
          <div className='space-y-6'>
            <UnifiedCalendar
              bookingType='return'
              modal
              date={tripConfiguration.pickupDateTime}
              onChangeDate={setPickupDateTime}
              placeholder='Select Departure'
            />

            <UnifiedCalendar
              bookingType='return'
              modal
              date={tripConfiguration.returnDateTime}
              onChangeDate={setReturnDateTime}
              minDate={tripConfiguration.pickupDateTime ?? new Date()}
              placeholder='Select Return'
            />
          </div>
        )}

        {bookingType === 'daily' && (
          <UnifiedCalendar
            bookingType='daily'
            range={tripConfiguration.dailyRange}
            onChangeRange={setDailyRange}
          />
        )}

        {['hourly', 'fleet', 'bespoke'].includes(bookingType) && (
          <UnifiedCalendar
            bookingType={bookingType}
            date={tripConfiguration.pickupDateTime}
            onChangeDate={setPickupDateTime}
          />
        )}
      </div>
    </div>
  );
}
