'use client';

import { Calendar } from 'lucide-react';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { useBookingState } from '@/hooks/useBookingState';
import { DatePillButton } from '../../features/booking/components/DatePillButton';

export function DailyPickerComponent() {
  const { tripConfiguration, setDailyRange } = useBookingState();
  const dailyRange = tripConfiguration.dailyRange; // Bridge pentru compatibility
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [start, end] = dailyRange;

  const formatRange = () => {
    if (start && end) {
      return `${start.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} → ${end.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`;
    }
    return '';
  };

  return (
    <div className='relative'>
      <DatePillButton
        placeholder='Select Daily Range'
        value={formatRange()}
        icon={<Calendar className='h-5 w-5' />}
        onClick={() => setCalendarOpen(true)}
      />

      {calendarOpen && (
        <div className='absolute bottom-full left-0 mb-2 z-[100] bg-white rounded-lg shadow-xl border'>
          <div className='p-2'>
            <h3 className='text-black text-sm mb-2'>Select Daily Range</h3>

            <DatePicker
              selectsRange
              startDate={start}
              endDate={end}
              onChange={range => range && setDailyRange(range)}
              inline
              minDate={new Date()}
              dateFormat='MMMM d, yyyy'
              calendarStartDay={1}
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
