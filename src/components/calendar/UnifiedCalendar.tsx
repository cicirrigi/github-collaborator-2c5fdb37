'use client';

import { Calendar } from 'lucide-react';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { DatePillButton } from '../../features/booking/components/DatePillButton';

interface UnifiedCalendarProps {
  bookingType: 'oneway' | 'return' | 'hourly' | 'daily' | 'fleet' | 'bespoke';
  date?: Date | null;
  onChangeDate?: (d: Date | null) => void;
  range?: [Date | null, Date | null];
  onChangeRange?: (r: [Date | null, Date | null]) => void;
  minDate?: Date;
  placeholder?: string;
  modal?: boolean;
}

export function UnifiedCalendar({
  bookingType,
  date,
  onChangeDate,
  range,
  onChangeRange,
  minDate,
  placeholder,
  modal,
}: UnifiedCalendarProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const isInline =
    ['oneway', 'hourly', 'fleet', 'bespoke', 'daily'].includes(bookingType) && !modal;
  const isModal = bookingType === 'return' || modal;
  const isRange = bookingType === 'daily';
  const hasTime = !isRange;

  const calendarClassName = `${bookingType}-calendar`;

  const handleDateChange = (newDate: Date | null) => {
    if (onChangeDate) onChangeDate(newDate);
  };

  const handleRangeChange = (dateRange: [Date | null, Date | null] | null) => {
    if (onChangeRange && dateRange) onChangeRange(dateRange);
  };

  // 🔳 INLINE CALENDAR
  if (isInline) {
    return (
      <div className='transform scale-110 origin-center'>
        {isRange ? (
          <DatePicker
            selectsRange
            startDate={range?.[0] ?? null}
            endDate={range?.[1] ?? null}
            onChange={handleRangeChange}
            inline
            minDate={minDate || new Date()}
            dateFormat='MMM d, yyyy'
            calendarClassName={`${calendarClassName} !w-full`}
            calendarStartDay={1}
          />
        ) : (
          <DatePicker
            selected={date ?? null}
            onChange={handleDateChange}
            inline
            minDate={minDate || new Date()}
            showTimeSelect={hasTime}
            timeIntervals={15}
            dateFormat='MMM d, yyyy HH:mm'
            calendarClassName={`${calendarClassName} !w-full`}
            calendarStartDay={1}
          />
        )}
      </div>
    );
  }

  // 🔳 MODAL CALENDAR
  if (isModal) {
    return (
      <>
        <DatePillButton
          placeholder={placeholder || 'Select Date & Time'}
          value={date ? date.toLocaleString('en-GB') : ''}
          icon={<Calendar className='h-5 w-5' />}
          onClick={() => setCalendarOpen(true)}
        />

        {calendarOpen && (
          <>
            {/* Backdrop */}
            <div
              onClick={() => setCalendarOpen(false)}
              className='fixed inset-0 bg-black/40 z-[9998] backdrop-blur-sm'
            ></div>

            {/* Modal Wrapper */}
            <div className='fixed z-[9999] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl border border-gray-300 p-4 w-[400px]'>
              <h3 className='text-center text-gray-900 font-semibold mb-4'>
                Select Return Date & Time
              </h3>

              <DatePicker
                selected={date ?? null}
                onChange={handleDateChange}
                inline
                minDate={minDate || new Date()}
                showTimeSelect
                timeIntervals={15}
                dateFormat='MMM d, yyyy HH:mm'
                calendarClassName='return-calendar'
                calendarStartDay={1}
              />

              <button
                onClick={() => setCalendarOpen(false)}
                className='block mx-auto bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-6 py-2 mt-4 transition-all'
              >
                Done
              </button>
            </div>
          </>
        )}
      </>
    );
  }

  return null;
}
