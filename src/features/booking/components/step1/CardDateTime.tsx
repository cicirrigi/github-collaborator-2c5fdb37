'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { Calendar } from 'lucide-react';
import { UnifiedCalendar } from '../../../../components/calendar/UnifiedCalendar';
import { CardHeader } from './CardHeader';

export function CardDateTime() {
  const { tripConfiguration, bookingType, setPickupDateTime, setReturnDateTime, setDailyRange } =
    useBookingState();

  return (
    <div className='space-y-4'>
      <CardHeader icon={Calendar} title='Date & Time' subtitle='Select when you travel' />

      {/* ONE WAY - inline calendar */}
      {bookingType === 'oneway' && (
        <UnifiedCalendar
          bookingType='oneway'
          date={tripConfiguration.pickupDateTime}
          onChangeDate={setPickupDateTime}
        />
      )}

      {/* RETURN - two separate modals (original behavior) */}
      {bookingType === 'return' && (
        <div className='space-y-5'>
          <UnifiedCalendar
            bookingType='return'
            date={tripConfiguration.pickupDateTime}
            onChangeDate={setPickupDateTime}
            placeholder='Select Departure Date & Time'
            modal={true}
          />
          <UnifiedCalendar
            bookingType='return'
            date={tripConfiguration.returnDateTime}
            onChangeDate={setReturnDateTime}
            minDate={tripConfiguration.pickupDateTime || new Date()}
            placeholder='Select Return Date & Time'
            modal={true}
          />
        </div>
      )}

      {/* DAILY - range inline calendar */}
      {bookingType === 'daily' && (
        <UnifiedCalendar
          bookingType='daily'
          range={tripConfiguration.dailyRange}
          onChangeRange={setDailyRange}
        />
      )}

      {/* HOURLY - reuse oneway pattern */}
      {bookingType === 'hourly' && (
        <UnifiedCalendar
          bookingType='hourly'
          date={tripConfiguration.pickupDateTime}
          onChangeDate={setPickupDateTime}
        />
      )}

      {/* FLEET - reuse oneway pattern */}
      {bookingType === 'fleet' && (
        <UnifiedCalendar
          bookingType='fleet'
          date={tripConfiguration.pickupDateTime}
          onChangeDate={setPickupDateTime}
        />
      )}

      {/* BESPOKE - reuse oneway pattern */}
      {bookingType === 'bespoke' && (
        <UnifiedCalendar
          bookingType='bespoke'
          date={tripConfiguration.pickupDateTime}
          onChangeDate={setPickupDateTime}
        />
      )}
    </div>
  );
}
