'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
  const [isReady, setIsReady] = useState(false);

  const isInline = useMemo(
    () => ['oneway', 'hourly', 'fleet', 'bespoke', 'daily'].includes(bookingType) && !modal,
    [bookingType, modal]
  );
  const isModal = useMemo(() => bookingType === 'return' || modal, [bookingType, modal]);
  const isRange = useMemo(() => bookingType === 'daily', [bookingType]);
  const hasTime = useMemo(() => !isRange, [isRange]);

  // Prevent flash by waiting for stable props
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 20); // Ultra-fast delay - barely perceptible

    return () => clearTimeout(timer);
  }, [bookingType, hasTime]);

  // Debugging specific pentru problema de refresh
  useEffect(() => {
    console.log('🔍 Calendar Debug:', {
      bookingType,
      isInline,
      hasTime,
      showTime: hasTime && isInline,
      dateValue: date,
      isReady,
    });
  }, [bookingType, isInline, hasTime, date, isReady]);

  const calendarClassName = `${bookingType}-calendar`;

  const handleDateChange = (newDate: Date | null) => {
    if (onChangeDate) onChangeDate(newDate);
  };

  const handleRangeChange = (dateRange: [Date | null, Date | null] | null) => {
    if (onChangeRange && dateRange) onChangeRange(dateRange);
  };

  // 🔳 INLINE CALENDAR
  if (isInline) {
    // Show loading state until props are stable
    if (!isReady) {
      return (
        <div className='relative transform scale-110 origin-center flex items-center justify-center h-64'>
          <div className='text-amber-200/60 text-sm'>Loading calendar...</div>
        </div>
      );
    }

    return (
      <div className='relative transform scale-110 origin-center'>
        {/* Custom Navigation Overlay - poziționat în header-ul calendar-ului */}
        <div className='absolute top-0.5 left-4 right-36 h-8 flex items-center justify-between z-20 pointer-events-none'>
          <button
            onClick={() => {
              // Trigger previous month - find the calendar's prev button and click it
              const prevButton = document.querySelector(
                '.react-datepicker__navigation--previous'
              ) as HTMLElement;
              if (prevButton) prevButton.click();
            }}
            className='w-6 h-6 bg-white/20 border border-amber-200/40 rounded-md flex items-center justify-center text-amber-200 hover:text-amber-100 hover:bg-white/30 transition-all pointer-events-auto'
          >
            <ChevronLeft className='w-3.5 h-3.5' />
          </button>

          <button
            onClick={() => {
              // Trigger next month - find the calendar's next button and click it
              const nextButton = document.querySelector(
                '.react-datepicker__navigation--next'
              ) as HTMLElement;
              if (nextButton) nextButton.click();
            }}
            className='w-6 h-6 bg-white/20 border border-amber-200/40 rounded-md flex items-center justify-center text-amber-200 hover:text-amber-100 hover:bg-white/30 transition-all pointer-events-auto'
          >
            <ChevronRight className='w-3.5 h-3.5' />
          </button>
        </div>

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
        <div className='relative'>
          <input
            type='text'
            readOnly
            value={
              date
                ? date.toLocaleString('en-GB', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : ''
            }
            placeholder={placeholder || 'Select Date & Time'}
            onClick={() => setCalendarOpen(true)}
            className='w-full bg-transparent border border-amber-200/20 rounded-md px-3 py-2 text-amber-50 text-sm font-light placeholder:text-amber-200/40 focus:border-amber-300/40 focus:outline-none transition-colors cursor-pointer'
          />
        </div>

        {calendarOpen && (
          <>
            {/* Backdrop */}
            <div
              onClick={() => setCalendarOpen(false)}
              className='fixed inset-0 bg-black/40 z-[9998] backdrop-blur-sm'
            ></div>

            {/* Modal Wrapper */}
            <div className='fixed z-[9999] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-neutral-900/95 shadow-2xl border border-amber-200/60 p-4 w-[400px]'>
              <h3 className='text-center text-amber-50 font-semibold mb-4'>
                Select Return Date & Time
              </h3>

              <div className='relative'>
                {/* Custom Navigation Overlay pentru modal */}
                <div className='absolute top-0.5 left-4 right-36 h-8 flex items-center justify-between z-20 pointer-events-none'>
                  <button
                    onClick={() => {
                      const prevButton = document.querySelector(
                        '.react-datepicker__navigation--previous'
                      ) as HTMLElement;
                      if (prevButton) prevButton.click();
                    }}
                    className='w-6 h-6 bg-white/20 border border-amber-200/40 rounded-md flex items-center justify-center text-amber-200 hover:text-amber-100 hover:bg-white/30 transition-all pointer-events-auto'
                  >
                    <ChevronLeft className='w-3.5 h-3.5' />
                  </button>

                  <button
                    onClick={() => {
                      const nextButton = document.querySelector(
                        '.react-datepicker__navigation--next'
                      ) as HTMLElement;
                      if (nextButton) nextButton.click();
                    }}
                    className='w-6 h-6 bg-white/20 border border-amber-200/40 rounded-md flex items-center justify-center text-amber-200 hover:text-amber-100 hover:bg-white/30 transition-all pointer-events-auto'
                  >
                    <ChevronRight className='w-3.5 h-3.5' />
                  </button>
                </div>

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
              </div>

              <button
                onClick={() => setCalendarOpen(false)}
                className='block mx-auto text-black rounded-lg px-6 py-2 mt-4 transition-all font-semibold'
                style={{ backgroundColor: '#f5d469' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e6c156')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#f5d469')}
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
