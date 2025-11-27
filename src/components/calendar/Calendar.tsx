'use client';

import { useCallback } from 'react';
import type { CalendarProps } from './core/calendar-types';

import { useCalendar } from './core/useCalendar';
import { CalendarGrid } from './ui/CalendarGrid';
import { CalendarHeader } from './ui/CalendarHeader';

export function Calendar({
  value,
  onChange,
  timezone,
  mode = 'single',
  minDate,
  maxDate,
  orientation = 'portrait', // ⭐ new default
  className = '',
}: CalendarProps) {
  const {
    currentMonth,
    calendarMonth,
    selection,

    goToPreviousMonth,
    goToNextMonth,
    handleDateSelect,
  } = useCalendar({
    mode,
    timezone,
    value,
    onChange,
    minDate,
    maxDate,
  });

  // 🎯 Stable callback to prevent CalendarDay re-renders
  const stableHandleDateSelect = useCallback(
    (date: Date) => {
      handleDateSelect(date);
    },
    [handleDateSelect]
  );

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Header: Month navigation */}
      <CalendarHeader
        currentMonth={currentMonth}
        onPreviousMonth={goToPreviousMonth}
        onNextMonth={goToNextMonth}
      />

      {/* Main 6x7 Grid */}
      <CalendarGrid
        month={calendarMonth}
        onDateSelect={stableHandleDateSelect}
        selection={selection}
        mode={mode}
        orientation={orientation} // ⭐ new
      />
    </div>
  );
}
