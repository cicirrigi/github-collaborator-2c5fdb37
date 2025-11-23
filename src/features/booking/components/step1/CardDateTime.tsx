'use client';

import { UnifiedCalendar } from '@/components/calendar/UnifiedCalendar';
import { useBookingState } from '@/hooks/useBookingState';
import { Calendar } from 'lucide-react';
import { CardHeader } from './CardHeader';

export function CardDateTime() {
  const { tripConfiguration, bookingType, setPickupDateTime, setReturnDateTime } =
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
          <div className='space-y-4'>
            <div className='space-y-3'>
              <div className='flex items-center gap-2'>
                <div className='p-1.5 bg-green-500/10 rounded-lg'>
                  <Calendar className='w-4 h-4 text-green-400' />
                </div>
                <span className='text-white font-medium text-sm'>Departure Date & Time</span>
              </div>
              <UnifiedCalendar
                bookingType='return'
                modal
                date={tripConfiguration.pickupDateTime}
                onChangeDate={setPickupDateTime}
                placeholder='Select departure date & time...'
              />
            </div>

            <div className='space-y-3'>
              <div className='flex items-center gap-2'>
                <div className='p-1.5 bg-red-500/10 rounded-lg'>
                  <Calendar className='w-4 h-4 text-red-400' />
                </div>
                <span className='text-white font-medium text-sm'>Return Date & Time</span>
              </div>
              <UnifiedCalendar
                bookingType='return'
                modal
                date={tripConfiguration.returnDateTime}
                onChangeDate={setReturnDateTime}
                minDate={tripConfiguration.pickupDateTime ?? new Date()}
                placeholder='Select return date & time...'
              />
            </div>
          </div>
        )}

        {['hourly', 'daily', 'fleet', 'bespoke'].includes(bookingType) && (
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
