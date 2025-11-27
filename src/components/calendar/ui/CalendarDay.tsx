'use client';

import { memo } from 'react';
import type { CalendarDayProps } from '../core/calendar-types';

function CalendarDayBase({ date, onSelect, className = '' }: CalendarDayProps) {
  const { date: dayDate, isToday, isSelected, isDisabled, isCurrentMonth } = date;

  const dayNumber = dayDate.getDate();

  // 🌙 Dacă NU este din luna curentă → returnăm un placeholder gol
  if (!isCurrentMonth) {
    return <div aria-hidden='true' className={`w-full h-full rounded-md ${className}`} />;
  }

  return (
    <button
      type='button'
      onClick={() => !isDisabled && onSelect(dayDate)}
      disabled={isDisabled}
      className={`
        relative
        w-full h-full
        flex items-center justify-center
        select-none
        text-sm font-light
        rounded-md
        transition-colors

        ${
          isSelected
            ? 'bg-amber-500 text-black font-medium'
            : isToday
              ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-400'
              : isDisabled
                ? 'text-amber-200/30 cursor-not-allowed'
                : 'text-amber-100 hover:bg-amber-200/10 hover:text-amber-50'
        }

        ${className}
      `}
      aria-label={`Select ${dayDate.toDateString()}`}
    >
      {dayNumber}
    </button>
  );
}

// 🧠 optimize: re-render only if date-state changes
export const CalendarDay = memo(CalendarDayBase, (prev, next) => {
  const a = prev.date;
  const b = next.date;

  return (
    a.date.getTime() === b.date.getTime() &&
    a.isToday === b.isToday &&
    a.isSelected === b.isSelected &&
    a.isDisabled === b.isDisabled &&
    a.isCurrentMonth === b.isCurrentMonth
  );
});
