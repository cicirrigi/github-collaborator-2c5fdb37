/**
 * 📅 VANTAGE LANE — CALENDAR UTILS (FINAL FIXED VERSION)
 * ZERO TIMEZONE CONVERSIONS — no UTC shifting, no DST issues.
 */

import {
  addDays,
  addMonths,
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

// Import time picker logic for availability checking
import { DEFAULT_LEAD_TIME_MINUTES } from '../../time/core/time-constants';
import { generateTimeSlots, isTimeDisabled } from '../../time/core/time-utils';

// Manual implementation of eachDayOfInterval to avoid import issues
function eachDayOfInterval(interval: { start: Date; end: Date }): Date[] {
  const days: Date[] = [];
  const current = new Date(interval.start);

  while (current <= interval.end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return days;
}

import type {
  CalendarDate,
  CalendarMonth,
  CalendarSelection,
  CalendarWeek,
} from './calendar-types';

/* -----------------------------------------------------
   📌 FIX 1 — TOTUL LOCAL, fără timezone convert
----------------------------------------------------- */

export function createDateLocal(year: number, month: number, day: number): Date {
  return new Date(year, month, day, 12, 0, 0); // ora 12 = DST safe
}

export function getNowLocal(): Date {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0);
}

/* -----------------------------------------------------
   ⏰ TIME SLOT AVAILABILITY CHECK
----------------------------------------------------- */
export function checkIfDateHasAvailableTimeSlots(
  date: Date,
  leadMinutes: number = DEFAULT_LEAD_TIME_MINUTES
): boolean {
  const slots = generateTimeSlots(15); // 15-minute intervals

  // Check if any slot is available for this date
  return slots.some(
    slot =>
      !isTimeDisabled({
        slot,
        date,
        lead: leadMinutes,
        minTime: undefined,
        maxTime: undefined,
      })
  );
}

/* -----------------------------------------------------
   🚫 DISABLED DATE LOGIC
----------------------------------------------------- */

export function isDateInPast(date: Date, minDate?: Date, maxDate?: Date): boolean {
  const today = startOfDay(getNowLocal());

  if (date < today) return true;

  // NEW: Check if today has any available time slots
  if (isSameDay(date, today)) {
    const hasAvailableSlots = checkIfDateHasAvailableTimeSlots(date);
    if (!hasAvailableSlots) return true; // Disable today if no slots available
  }

  if (minDate && date < startOfDay(minDate)) return true;
  if (maxDate && date > startOfDay(maxDate)) return true;

  return false;
}

/* -----------------------------------------------------
   📅 FIXED 42-DAY GRID (6 rows × 7 columns)
----------------------------------------------------- */

export function generateCalendarMonth(
  year: number,
  month: number,
  selection: CalendarSelection,
  mode: 'single' | 'range',
  minDate?: Date,
  maxDate?: Date
): CalendarMonth {
  const monthStart = createDateLocal(year, month, 1);
  const monthStartBoundary = startOfMonth(monthStart);
  const monthEndBoundary = endOfMonth(monthStart);

  const calendarStart = startOfWeek(monthStartBoundary, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEndBoundary, { weekStartsOn: 1 });

  let gridDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Ensure EXACT 42 days
  if (gridDays.length < 42) {
    const last = gridDays.at(-1)!;
    const missing = 42 - gridDays.length;
    for (let i = 1; i <= missing; i++) gridDays.push(addDays(last, i));
  }
  if (gridDays.length > 42) gridDays = gridDays.slice(0, 42);

  const calendarDates: CalendarDate[] = gridDays.map((date: Date) =>
    createCalendarDate(date, monthStart, selection, mode, minDate, maxDate)
  );

  const weeks: CalendarWeek[] = [];
  for (let i = 0; i < 6; i++) {
    weeks.push({ days: calendarDates.slice(i * 7, (i + 1) * 7) });
  }

  return { year, month, weeks };
}

/* -----------------------------------------------------
   📍 DATE FLAGS (100% local)
----------------------------------------------------- */

export function createCalendarDate(
  date: Date,
  currentMonth: Date,
  selection: CalendarSelection,
  mode: 'single' | 'range',
  minDate?: Date,
  maxDate?: Date
): CalendarDate {
  const today = getNowLocal();

  return {
    date,
    isToday: isSameDay(date, today),
    isSelected: isDateSelected(date, selection, mode),
    isInRange: isDateInRange(date, selection, mode),
    isRangeStart: isDateRangeStart(date, selection, mode),
    isRangeEnd: isDateRangeEnd(date, selection, mode),
    isDisabled: isDateInPast(date, minDate, maxDate),
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
  if (mode === 'single') return !!(selection.single && isSameDay(date, selection.single));
  if (mode === 'range' && selection.range) {
    const [a, b] = selection.range;
    return isSameDay(date, a) || isSameDay(date, b);
  }
  return false;
}

export function isDateInRange(date: Date, selection: CalendarSelection, mode: 'single' | 'range') {
  if (mode !== 'range' || !selection.range) return false;
  const [start, end] = selection.range;
  return date > start && date < end;
}

export function isDateRangeStart(
  date: Date,
  selection: CalendarSelection,
  mode: 'single' | 'range'
): boolean {
  return !!(mode === 'range' && selection.range && isSameDay(date, selection.range[0]));
}

export function isDateRangeEnd(
  date: Date,
  selection: CalendarSelection,
  mode: 'single' | 'range'
): boolean {
  return !!(mode === 'range' && selection.range && isSameDay(date, selection.range[1]));
}

/* -----------------------------------------------------
   🗓️ MONTH NAVIGATION
----------------------------------------------------- */

export const getPreviousMonth = (m: Date) => subMonths(m, 1);
export const getNextMonth = (m: Date) => addMonths(m, 1);

/* -----------------------------------------------------
   📝 FORMATTING
----------------------------------------------------- */

export const formatMonthYear = (d: Date) => format(d, 'MMMM yyyy');

export function generateWeekdays() {
  const base = new Date(2024, 0, 1); // Monday
  const out = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    out.push({ short: format(d, 'E'), full: format(d, 'EEEE') });
  }
  return out;
}
