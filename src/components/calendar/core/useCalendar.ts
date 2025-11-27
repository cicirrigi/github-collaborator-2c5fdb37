/**
 * 📅 VANTAGE LANE — useCalendar Hook (FINAL VERSION)
 */

import { useCallback, useMemo, useState } from 'react';
import type { CalendarMonth, CalendarProps, CalendarSelection } from './calendar-types';

import {
  createDateInTimezone,
  formatMonthYear,
  generateCalendarMonth,
  getCurrentTimeInZone,
  getNextMonth,
  getPreviousMonth,
} from './calendar-utils';

export function useCalendar({
  mode = 'single',
  timezone,
  value,
  onChange,
  minDate,
  maxDate,
}: Pick<CalendarProps, 'mode' | 'timezone' | 'value' | 'onChange' | 'minDate' | 'maxDate'>) {
  /* --------------------------------------------
     📌 Current visible month (IN timezone)
     -------------------------------------------- */
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = getCurrentTimeInZone(timezone);
    return createDateInTimezone(now.getFullYear(), now.getMonth(), 1, timezone);
  });

  /* --------------------------------------------
     🎯 Convert prop value → internal selection
     -------------------------------------------- */
  const selection = useMemo((): CalendarSelection => {
    if (!value) return { single: null, range: null };

    if (mode === 'single') {
      return { single: value as Date, range: null };
    }

    if (mode === 'range') {
      return { single: null, range: value as [Date, Date] };
    }

    return { single: null, range: null };
  }, [value, mode]);

  /* --------------------------------------------
     📅 Generate month grid for UI
     -------------------------------------------- */
  const calendarMonth: CalendarMonth = useMemo(() => {
    return generateCalendarMonth(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      timezone,
      selection,
      mode,
      minDate,
      maxDate
    );
  }, [currentMonth, timezone, selection, mode, minDate, maxDate]);

  /* --------------------------------------------
     ⬅️➡️ Month navigation (timezone-safe)
     -------------------------------------------- */
  const goToPreviousMonth = useCallback(() => {
    setCurrentMonth(prev => getPreviousMonth(prev));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentMonth(prev => getNextMonth(prev));
  }, []);

  const goToMonth = useCallback(
    (year: number, month: number) => {
      setCurrentMonth(createDateInTimezone(year, month, 1, timezone));
    },
    [timezone]
  );

  /* --------------------------------------------
     📍 Date Selection
     -------------------------------------------- */
  const handleDateSelect = useCallback(
    (selectedDate: Date) => {
      if (mode === 'single') {
        onChange(selectedDate);
        return;
      }

      if (mode === 'range') {
        const currentRange = selection.range;

        if (!currentRange) {
          onChange([selectedDate, selectedDate]);
          return;
        }

        const [start, end] = currentRange;

        // Same date → clear
        if (
          selectedDate.getTime() === start.getTime() &&
          selectedDate.getTime() === end.getTime()
        ) {
          onChange(null);
          return;
        }

        // Start == end → choose range directionally
        if (start.getTime() === end.getTime()) {
          if (selectedDate < start) onChange([selectedDate, start]);
          else onChange([start, selectedDate]);
          return;
        }

        // New range
        onChange([selectedDate, selectedDate]);
      }
    },
    [mode, selection, onChange]
  );

  /* --------------------------------------------
     🏷 Month label
     -------------------------------------------- */
  const monthYearLabel = useMemo(() => formatMonthYear(currentMonth), [currentMonth]);

  return {
    currentMonth,
    calendarMonth,
    selection,
    monthYearLabel,

    goToPreviousMonth,
    goToNextMonth,
    goToMonth,

    handleDateSelect,
  };
}
