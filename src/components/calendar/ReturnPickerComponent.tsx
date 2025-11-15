'use client';

import { Calendar } from 'lucide-react';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { DatePillButton } from '../../features/booking/components/DatePillButton';
import { useBookingStore } from '../../features/booking/store/booking.store';

export function ReturnPickerComponent() {
  const { departureDateTime, returnDateTime, setReturnDateTime } = useBookingStore();
  const [calendarOpen, setCalendarOpen] = useState(false);

  const showDate = (d: Date | null) =>
    d?.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) || '';

  const showTime = (d: Date | null) =>
    d?.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }) || '';

  const normalizeDay = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };

  return (
    <div className='relative'>
      <DatePillButton
        placeholder='Select Return Date & Time'
        value={returnDateTime ? `${showDate(returnDateTime)} ${showTime(returnDateTime)}` : ''}
        icon={<Calendar className='h-5 w-5' />}
        onClick={() => setCalendarOpen(true)}
      />

      {calendarOpen && (
        <div className='absolute bottom-full left-0 mb-2 z-[100] bg-white rounded-lg shadow-xl border'>
          <div className='p-2'>
            <h3 className='text-black text-sm mb-2'>Select Return Date & Time</h3>

            <DatePicker
              selected={returnDateTime}
              onChange={date => date && setReturnDateTime(date)}
              inline
              minDate={departureDateTime || new Date()}
              showTimeSelect
              timeIntervals={15}
              timeFormat='HH:mm'
              dateFormat='MMMM d, yyyy h:mm aa'
              portalId='calendar-root'
              dayClassName={dayDate => {
                if (!departureDateTime || !returnDateTime) return '';

                const day = normalizeDay(dayDate);
                const start = normalizeDay(departureDateTime);
                const end = normalizeDay(returnDateTime);

                if (day >= start && day <= end) {
                  return 'bg-blue-100 text-blue-800';
                }

                return '';
              }}
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
