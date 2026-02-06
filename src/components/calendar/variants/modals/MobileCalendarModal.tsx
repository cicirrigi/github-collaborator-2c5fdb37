'use client';

import { Calendar } from '../../Calendar';
import type { CalendarProps } from '../../core/calendar-types';
import { MobileModalContainer } from './MobileModalContainer';
import { MobileModalOverlay } from './MobileModalOverlay';

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
  const handleSelect = (date: Date | [Date, Date] | null) => {
    onChange(date);
    // Don't auto-close - let user click Confirm button
  };

  return (
    <>
      <MobileModalOverlay visible={open} onClose={onClose} />

      <MobileModalContainer visible={open}>
        {/* HEADER */}
        <div className='sticky top-0 z-[60] bg-[#0c0c0c] px-4 py-4 flex items-center justify-between border-b border-white/10'>
          <button className='text-amber-300' onClick={onClose}>
            Cancel
          </button>

          <div className='text-base font-medium'>Select Date</div>

          <div className='w-10' />
        </div>

        {/* BODY */}
        <div className='flex-1 min-h-0 overflow-y-auto px-4 py-4 overscroll-contain'>
          <div className='w-full min-w-[300px] touch-manipulation'>
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

        {/* FOOTER */}
        <div className='sticky bottom-0 z-[60] bg-[#0c0c0c] px-4 py-4 border-t border-white/10'>
          <button
            className='
              w-full py-3 rounded-xl
              bg-amber-500 text-black font-semibold text-base
              shadow-lg
            '
            onClick={() => {
              onChange(value || null);
              onClose();
            }}
          >
            Confirm
          </button>
        </div>
      </MobileModalContainer>
    </>
  );
}
