'use client';

import type { CalendarHeaderProps } from '../core/calendar-types';

export function CalendarHeader({
  currentMonth,
  onPreviousMonth,
  onNextMonth,
  className = '',
}: CalendarHeaderProps) {
  const monthLabel = currentMonth.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* ← Previous month */}
      <button
        type='button'
        aria-label='Previous month'
        onClick={onPreviousMonth}
        className='p-2 select-none'
      >
        ‹
      </button>

      {/* Current month label */}
      <div className='text-center font-medium select-none'>{monthLabel}</div>

      {/* → Next month */}
      <button
        type='button'
        aria-label='Next month'
        onClick={onNextMonth}
        className='p-2 select-none'
      >
        ›
      </button>
    </div>
  );
}
