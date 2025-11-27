/**
 * 📅 VANTAGE LANE — useCalendar FINAL FIXED
 * ZERO TIMEZONE CONVERSIONS — stable month navigation.
 */

import { isBefore } from 'date-fns';
import { useCallback, useMemo, useState } from 'react';

import type { CalendarMonth, CalendarProps, CalendarSelection } from './calendar-types';
import {
  createDateLocal,
  formatMonthYear,
  generateCalendarMonth,
  getNextMonth,
  getNowLocal,
  getPreviousMonth,
} from './calendar-utils';

export function useCalendar({
  mode = 'single',
  value,
  onChange,
  minDate,
  maxDate,
}: Pick<CalendarProps, 'mode' | 'value' | 'onChange' | 'minDate' | 'maxDate'>) {
  /* ------------------------------
     INITIAL MONTH = TODAY
  --------------------------------*/
  const today = getNowLocal();
  const [currentMonth, setCurrentMonth] = useState(
    createDateLocal(today.getFullYear(), today.getMonth(), 1)
  );

  /* ------------------------------
     SELECTION NORMALIZATION
  --------------------------------*/
  const selection = useMemo<CalendarSelection>(() => {
    if (!value) return { single: null, range: null };

    if (mode === 'single') {
      return { single: new Date(value as Date), range: null };
    }

    const [a, b] = value as [Date, Date];
    return { single: null, range: [new Date(a), new Date(b)] };
  }, [value, mode]);

  /* ------------------------------
     GENERATE MONTH GRID
  --------------------------------*/
  const calendarMonth: CalendarMonth = useMemo(() => {
    return generateCalendarMonth(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      selection,
      mode,
      minDate || undefined,
      maxDate || undefined
    );
  }, [currentMonth, selection, mode, minDate, maxDate]);

  /* ------------------------------
     MONTH NAVIGATION
  --------------------------------*/
  const goToPreviousMonth = useCallback(() => {
    const prev = getPreviousMonth(currentMonth);
    if (minDate && isBefore(prev, minDate)) return;
    setCurrentMonth(prev);
  }, [currentMonth, minDate]);

  const goToNextMonth = useCallback(() => {
    const next = getNextMonth(currentMonth);
    if (maxDate && isBefore(maxDate, next)) return;
    setCurrentMonth(next);
  }, [currentMonth, maxDate]);

  const goToMonth = useCallback(
    (year: number, month: number) => {
      const newMonth = createDateLocal(year, month, 1);
      if (minDate && isBefore(newMonth, minDate)) return;
      if (maxDate && isBefore(maxDate, newMonth)) return;
      setCurrentMonth(newMonth);
    },
    [minDate, maxDate]
  );

  /* ------------------------------
     DATE SELECTION
  --------------------------------*/
  const handleDateSelect = useCallback(
    (selected: Date) => {
      const normalized = createDateLocal(
        selected.getFullYear(),
        selected.getMonth(),
        selected.getDate()
      );

      if (mode === 'single') {
        onChange(normalized);
        return;
      }

      const r = selection.range;
      if (!r) return onChange([normalized, normalized]);

      const [start, end] = r;

      // same → clear
      if (normalized.getTime() === start.getTime() && normalized.getTime() === end.getTime()) {
        return onChange(null);
      }

      // extend
      if (start.getTime() === end.getTime()) {
        if (normalized < start) onChange([normalized, start]);
        else onChange([start, normalized]);
        return;
      }

      // reset
      onChange([normalized, normalized]);
    },
    [mode, selection, onChange]
  );

  /* ------------------------------
     MONTH LABEL
  --------------------------------*/
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
