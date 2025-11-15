'use client';

import { Calendar } from 'lucide-react';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { DatePillButton } from '../../features/booking/components/DatePillButton';
import { useBookingStore } from '../../features/booking/store/booking.store';

export function BespokePickerComponent() {
  const { departureDateTime, setDepartureDateTime } = useBookingStore();
  const [calendarOpen, setCalendarOpen] = useState(false);

  const showDate = (d: Date | null) =>
    d?.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) || '';

  const showTime = (d: Date | null) =>
    d?.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }) || '';

  return (
    <div className='relative'>
      <DatePillButton
        placeholder='Select Bespoke Service Date & Time'
        value={
          departureDateTime ? `${showDate(departureDateTime)} ${showTime(departureDateTime)}` : ''
        }
        icon={<Calendar className='h-5 w-5' />}
        onClick={() => setCalendarOpen(true)}
      />

      {calendarOpen && (
        <div className='absolute bottom-full left-0 mb-2 z-[100] bg-white rounded-lg shadow-xl border'>
          <div className='p-2'>
            <h3 className='text-black text-sm mb-2'>Select Bespoke Service Date & Time</h3>

            <DatePicker
              selected={departureDateTime}
              onChange={date => date && setDepartureDateTime(date)}
              inline
              minDate={new Date()}
              showTimeSelect
              timeIntervals={15}
              timeFormat='HH:mm'
              dateFormat='MMMM d, yyyy h:mm aa'
              portalId='calendar-root'
            />

            <button
              onClick={() => setCalendarOpen(false)}
              className='mt-2 px-4 py-1 bg-blue-500 text-white rounded text-sm mx-auto block'
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
