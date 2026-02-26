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

  // Hide days from other months completely
  if (!isCurrentMonth) {
    return (
      <div className={`w-full h-full ${className}`}>
        {/* Empty space for days outside current month */}
      </div>
    );
  }

  return (
    <button
      type='button'
      disabled={isDisabled}
      onClick={e => {
        e.stopPropagation();
        if (!isDisabled) {
          onSelect(raw);
        }
      }}
      onTouchEnd={e => {
        e.stopPropagation();
        if (!isDisabled) {
          onSelect(raw);
        }
      }}
      className={`
        w-full h-full flex items-center justify-center
        rounded-md text-lg transition p-3
        touch-manipulation cursor-pointer
        ${classes}
        ${className}
      `}
      style={{ pointerEvents: 'auto' }}
    >
      {dayNumber}
    </button>
  );
}
