'use client';

import { Calendar } from '../../Calendar';
import type { CalendarProps } from '../../core/calendar-types';

interface MobileCalendarModalProps extends Omit<CalendarProps, 'className' | 'variant'> {
  open: boolean;
  onClose: () => void;
}

export function MobileCalendarModal({
  open,
  onClose,
  value,
  onChange,
  timezone,
  mode = 'single',
  minDate,
  maxDate,
}: MobileCalendarModalProps) {
  if (!open) return null;

  const handleSelect = (date: Date | [Date, Date] | null) => {
    onChange(date);
    onClose();
  };

  return (
    <div
      className='
        fixed inset-0 z-50
        flex flex-col
        bg-black/50
      '
    >
      {/* Sheet container */}
      <div
        className='
          mt-auto
          bg-white
          rounded-t-2xl
          p-4
          shadow-lg
        '
      >
        {/* Header Close */}
        <div className='flex justify-between items-center mb-3'>
          <button onClick={onClose}>Cancel</button>
          <div className='font-medium text-base'>Select Date</div>
          <div className='w-10' />
        </div>

        {/* Calendar */}
        <Calendar
          value={value}
          onChange={handleSelect}
          timezone={timezone}
          minDate={minDate}
          maxDate={maxDate}
          mode={mode}
        />
      </div>
    </div>
  );
}
