'use client';

import type { CalendarDayProps } from '../core/calendar-types';

export function CalendarDay({ date, onSelect, className = '' }: CalendarDayProps) {
  const { date: dayDate, isToday, isSelected, isDisabled, isCurrentMonth } = date;

  const dayNumber = dayDate.getDate();

  // 🌙 Dacă NU este din luna curentă → returnăm un placeholder gol
  if (!isCurrentMonth) {
    return <div aria-hidden='true' className={`w-full h-full rounded-md ${className}`} />;
  }

  const handleClick = () => {
    if (!isDisabled) onSelect(dayDate);
  };

  return (
    <button
      type='button'
      onClick={handleClick}
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
