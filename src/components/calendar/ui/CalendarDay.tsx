'use client';

import type { CalendarDayProps } from '../core/calendar-types';

export function CalendarDay({ date, onSelect, className = '' }: CalendarDayProps) {
  const { date: raw, isToday, isSelected, isDisabled, isCurrentMonth } = date;

  // normalize once — no UTC shifting
  const local = new Date(raw.getFullYear(), raw.getMonth(), raw.getDate());
  const dayNumber = local.getDate();

  const classes = isSelected
    ? 'bg-amber-500 text-black font-medium ring-2 ring-amber-400'
    : isToday
      ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-400'
      : isDisabled
        ? 'text-amber-200/30 cursor-not-allowed'
        : 'text-amber-100 hover:bg-amber-200/10 hover:text-amber-50';

  return (
    <button
      type='button'
      disabled={isDisabled}
      onClick={() => !isDisabled && onSelect(raw)}
      className={`
        w-full h-full flex items-center justify-center
        rounded-md text-sm transition
        ${!isCurrentMonth ? 'opacity-40' : ''}
        ${classes}
        ${className}
      `}
    >
      {dayNumber}
    </button>
  );
}
