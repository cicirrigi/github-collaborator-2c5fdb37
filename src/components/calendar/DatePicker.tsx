'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { CalendarProps } from './core/calendar-types';

import { format } from 'date-fns';
import { Calendar } from './Calendar';
import { MobileCalendarModal } from './variants/modals/MobileCalendarModal';

/* ---------------------------------------------------------
   📱 DEVICE DETECTION (SSR-safe hydration fix)
   --------------------------------------------------------- */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    check(); // Set initial value after hydration
    window.addEventListener('resize', check);

    return () => window.removeEventListener('resize', check);
  }, []);

  // Return false during SSR and initial hydration to match server HTML
  return isMobile ?? false;
}

/* ---------------------------------------------------------
   📅 MAIN DATE PICKER COMPONENT
   --------------------------------------------------------- */

interface DatePickerProps extends Omit<
  CalendarProps,
  'className' | 'variant' | 'onOpen' | 'onClose'
> {
  placeholder?: string;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  mode = 'single',
  timezone,
  minDate,
  maxDate,
  placeholder = 'Select date',
  className = '',
}: DatePickerProps) {
  const isMobile = useIsMobile();

  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  /* ---------------------------------------------------------
     🚪 OUTSIDE CLICK TO CLOSE (DESKTOP ONLY)
     --------------------------------------------------------- */
  useEffect(() => {
    if (isMobile) return; // mobile uses modal, not popover

    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile]);

  /* ---------------------------------------------------------
     📝 FORMAT SELECTED VALUE
     --------------------------------------------------------- */
  const formatValue = useCallback(() => {
    if (!value) return '';

    if (mode === 'single') {
      return format(value as Date, 'dd MMM yyyy');
    }

    if (mode === 'range') {
      const [start, end] = value as [Date, Date];
      if (!start && !end) return '';
      if (start && !end) return `${format(start, 'dd MMM yyyy')} → `;
      return `${format(start, 'dd MMM yyyy')} → ${format(end, 'dd MMM yyyy')}`;
    }

    return '';
  }, [value, mode]);

  const formattedValue = formatValue();

  /* ---------------------------------------------------------
     🎯 HANDLERS
     --------------------------------------------------------- */
  const openPicker = () => setOpen(true);
  const closePicker = () => setOpen(false);

  const handleSelect = (date: Date | [Date, Date] | null) => {
    onChange(date);
    closePicker();
  };

  /* ---------------------------------------------------------
     🎨 RENDER LOGIC
     --------------------------------------------------------- */
  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {/* INPUT BUTTON */}
      <button type='button' onClick={openPicker} className='w-full text-left'>
        {formattedValue || placeholder}
      </button>

      {/* ---------------------------------------------------------
          📱 MOBILE FULLSCREEN MODAL
         --------------------------------------------------------- */}
      <MobileCalendarModal
        open={open && isMobile}
        onClose={closePicker}
        value={value}
        onChange={handleSelect}
        timezone={timezone}
        mode={mode}
        minDate={minDate}
        maxDate={maxDate}
      />

      {/* ---------------------------------------------------------
          🖥️ DESKTOP POPOVER CALENDAR
         --------------------------------------------------------- */}
      {open && !isMobile && (
        <div className='absolute left-0 top-full mt-2 z-50 w-full'>
          <Calendar
            value={value}
            onChange={handleSelect}
            timezone={timezone}
            mode={mode}
            minDate={minDate}
            maxDate={maxDate}
          />
        </div>
      )}
    </div>
  );
}
