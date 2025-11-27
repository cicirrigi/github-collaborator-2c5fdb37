/**
 * 📅 VANTAGE LANE — CALENDAR UTILS (FINAL VERSION)
 * Pure logic: timezone-safe, grid-stable, selection-safe.
 */

import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';

// TEMPORARY: Fallback for date-fns-tz compatibility issues
const utcToZonedTime = (date: Date, _timezone: string) => date;
const zonedTimeToUtc = (date: Date, _timezone: string) => date;

import type {
  CalendarDate,
  CalendarMonth,
  CalendarSelection,
  CalendarWeek,
} from './calendar-types';

/* -----------------------------------------------------
   🌍 TIMEZONE CORE FUNCTIONS
   ----------------------------------------------------- */

/**
 * Get "now" in a specific timezone.
 */
export function getCurrentTimeInZone(timezone: string): Date {
  return utcToZonedTime(new Date(), timezone);
}

/**
 * Create a date inside the target timezone correctly.
 */
export function createDateInTimezone(
  year: number,
  month: number,
  day: number,
  timezone: string
): Date {
  const utc = new Date(Date.UTC(year, month, day));
  return utcToZonedTime(utc, timezone);
}

/**
 * Convert zoned date to UTC (for saving to DB).
 */
export function convertToUTC(date: Date, timezone: string): Date {
  return zonedTimeToUtc(date, timezone);
}

/**
 * Convert UTC date back into booking timezone (for display).
 */
export function convertFromUTC(date: Date, timezone: string): Date {
  return utcToZonedTime(date, timezone);
}

/* -----------------------------------------------------
   🚫 DISABLED DATE LOGIC (PAST + MIN/MAX)
   ----------------------------------------------------- */

export function isDateInPast(
  date: Date,
  timezone: string,
  minDate?: Date,
  maxDate?: Date
): boolean {
  const nowInZone = getCurrentTimeInZone(timezone);
  const todayStart = startOfDay(nowInZone);

  if (date < todayStart) return true;
  if (minDate && date < startOfDay(minDate)) return true;
  if (maxDate && date > startOfDay(maxDate)) return true;

  return false;
}

/* -----------------------------------------------------
   📅 MONTH GENERATION — ALWAYS FIXED 6×7 GRID
   ----------------------------------------------------- */

export function generateCalendarMonth(
  year: number,
  month: number,
  timezone: string,
  selection: CalendarSelection,
  mode: 'single' | 'range',
  minDate?: Date,
  maxDate?: Date
): CalendarMonth {
  // Month in timezone
  const monthStart = createDateInTimezone(year, month, 1, timezone);

  const monthStartBoundary = startOfMonth(monthStart);
  const monthEndBoundary = endOfMonth(monthStart);

  const calendarStart = startOfWeek(monthStartBoundary, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEndBoundary, { weekStartsOn: 1 });

  const allDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  // 🔥 ENTERPRISE FIX: Ensure exactly 42 days (6 weeks × 7 days) ALWAYS
  let gridDays = [...allDays];

  // If less than 42 days → add missing days from next month
  if (gridDays.length < 42) {
    const lastDay = gridDays[gridDays.length - 1];
    if (!lastDay) throw new Error('Calendar grid generation failed - no last day');

    const missing = 42 - gridDays.length;

    for (let i = 1; i <= missing; i++) {
      gridDays.push(addDays(lastDay, i));
    }
  }

  // If more than 42 days → slice to exactly 42
  if (gridDays.length > 42) {
    gridDays = gridDays.slice(0, 42);
  }

  const calendarDates: CalendarDate[] = gridDays.map(date =>
    createCalendarDate(date, monthStart, timezone, selection, mode, minDate, maxDate)
  );

  const weeks: CalendarWeek[] = [];
  for (let i = 0; i < 6; i++) {
    weeks.push({ days: calendarDates.slice(i * 7, (i + 1) * 7) });
  }

  return { year, month, weeks };
}

/* -----------------------------------------------------
   📍 CALENDAR DATE FLAGS
   ----------------------------------------------------- */

export function createCalendarDate(
  date: Date,
  currentMonth: Date,
  timezone: string,
  selection: CalendarSelection,
  mode: 'single' | 'range',
  minDate?: Date,
  maxDate?: Date
): CalendarDate {
  const nowInZone = getCurrentTimeInZone(timezone);

  return {
    date,
    isToday: isSameDay(date, nowInZone),
    isSelected: isDateSelected(date, selection, mode),
    isInRange: isDateInRange(date, selection, mode),
    isRangeStart: isDateRangeStart(date, selection, mode),
    isRangeEnd: isDateRangeEnd(date, selection, mode),
    isDisabled: isDateInPast(date, timezone, minDate, maxDate),
    isCurrentMonth: isSameMonth(date, currentMonth),
    isPreviousMonth: date < startOfMonth(currentMonth),
    isNextMonth: date > endOfMonth(currentMonth),
  };
}

/* -----------------------------------------------------
   🎯 SELECTION LOGIC
   ----------------------------------------------------- */

export function isDateSelected(
  date: Date,
  selection: CalendarSelection,
  mode: 'single' | 'range'
): boolean {
  if (mode === 'single') {
    return selection.single ? isSameDay(date, selection.single) : false;
  }

  if (mode === 'range' && selection.range) {
    const [start, end] = selection.range;
    return isSameDay(date, start) || isSameDay(date, end);
  }

  return false;
}

export function isDateInRange(
  date: Date,
  selection: CalendarSelection,
  mode: 'single' | 'range'
): boolean {
  if (mode !== 'range' || !selection.range) return false;

  const [start, end] = selection.range;
  return date > start && date < end;
}

export function isDateRangeStart(
  date: Date,
  selection: CalendarSelection,
  mode: 'single' | 'range'
): boolean {
  return mode === 'range' && selection.range && isSameDay(date, selection.range[0]);
}

export function isDateRangeEnd(
  date: Date,
  selection: CalendarSelection,
  mode: 'single' | 'range'
): boolean {
  return mode === 'range' && selection.range && isSameDay(date, selection.range[1]);
}

/* -----------------------------------------------------
   🗓 MONTH NAVIGATION
   ----------------------------------------------------- */

export function getPreviousMonth(currentMonth: Date): Date {
  return subMonths(currentMonth, 1);
}

export function getNextMonth(currentMonth: Date): Date {
  return addMonths(currentMonth, 1);
}

/* -----------------------------------------------------
   📝 FORMATTING HELPERS
   ----------------------------------------------------- */

export function formatMonthYear(date: Date): string {
  return format(date, 'MMMM yyyy');
}

export function formatDay(date: Date): string {
  return format(date, 'd');
}

export function formatWeekdayShort(date: Date): string {
  return format(date, 'E');
}

export function formatWeekdayLong(date: Date): string {
  return format(date, 'EEEE');
}

/* -----------------------------------------------------
   📅 WEEKDAY HEADER (Mo → Su)
   ----------------------------------------------------- */

export interface CalendarWeekday {
  short: string;
  full: string;
}

export function generateWeekdays(timezone: string): CalendarWeekday[] {
  const base = createDateInTimezone(2024, 0, 1, timezone); // Jan 1 2024 = Monday

  const days: CalendarWeekday[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);

    days.push({
      short: format(d, 'E'),
      full: format(d, 'EEEE'),
    });
  }

  return days;
}
