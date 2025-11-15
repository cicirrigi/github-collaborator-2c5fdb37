'use client';

import { Calendar } from 'lucide-react';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { useBookingState } from '@/hooks/useBookingState';
import { DatePillButton } from '../../features/booking/components/DatePillButton';

export function DeparturePickerComponent() {
  const { tripConfiguration, setPickupDateTime } = useBookingState();
  const departureDateTime = tripConfiguration.pickupDate; // Bridge pentru compatibility
  const [calendarOpen, setCalendarOpen] = useState(false);

  const showDate = (d: Date | null) =>
    d?.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) || '';

  const showTime = (d: Date | null) =>
    d?.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }) || '';

  return (
    <div className='relative'>
      <DatePillButton
        placeholder='Select Date & Time'
        value={
          departureDateTime ? `${showDate(departureDateTime)} ${showTime(departureDateTime)}` : ''
        }
        icon={<Calendar className='h-5 w-5' />}
        onClick={() => setCalendarOpen(true)}
      />

      {calendarOpen && (
        <div className='calendar-wrapper absolute bottom-full left-0 mb-2 z-[100]'>
          <div>
            <h3 className='text-black text-sm mb-2'>Select Date & Time</h3>

            <DatePicker
              selected={departureDateTime}
              onChange={date => date && setPickupDateTime(date, tripConfiguration.pickupTime)}
              inline
              minDate={new Date()}
              showTimeSelect
              timeIntervals={15}
              timeFormat='HH:mm'
              dateFormat='MMMM d, yyyy h:mm aa'
              calendarStartDay={1}
            />

            <button onClick={() => setCalendarOpen(false)} className='mt-4 mx-auto block'>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
