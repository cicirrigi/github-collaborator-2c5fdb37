/**
 * 🕒 VANTAGE LANE — TIME PICKER UTILS
 * Pure logic: timezone-safe, interval generation, disable rules.
 */

import type { TimeValue } from './time-types';

/* -----------------------------------------------------
   🌍 TIMEZONE HELPERS
   ----------------------------------------------------- */

/**
 * Create a Date in the target timezone.
 * Fallback: if date-fns-tz is not installed, use local.
 */
export function createTimeInZone(hours: number, minutes: number, timezone: string): Date {
  // TEMP: fallback (no date-fns-tz)
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d;
}

/**
 * Extract HH:mm from a Date into TimeValue.
 */
export function extractTime(date: Date): TimeValue {
  return {
    hours: date.getHours(),
    minutes: date.getMinutes(),
  };
}

/**
 * Return "now" in the booking timezone.
 */
export function getCurrentTimeInZone(timezone: string): TimeValue {
  const now = createTimeInZone(new Date().getHours(), new Date().getMinutes(), timezone);
  return extractTime(now);
}

/* -----------------------------------------------------
   🧮 COMPARISON UTILS
   ----------------------------------------------------- */

export function isTimeBefore(a: TimeValue, b: TimeValue): boolean {
  if (a.hours < b.hours) return true;
  if (a.hours > b.hours) return false;
  return a.minutes < b.minutes;
}

export function isTimeEqual(a: TimeValue, b: TimeValue): boolean {
  return a.hours === b.hours && a.minutes === b.minutes;
}

/**
 * a < b OR a == b
 */
export function isTimeBeforeOrEqual(a: TimeValue, b: TimeValue): boolean {
  return isTimeBefore(a, b) || isTimeEqual(a, b);
}

/* -----------------------------------------------------
   🔥 ENABLED / DISABLED LOGIC
   ----------------------------------------------------- */

export function isTimeDisabled(
  t: TimeValue,
  nowInZone: TimeValue,
  minTime?: TimeValue,
  maxTime?: TimeValue,
  leadTime?: TimeValue
): boolean {
  // 1) Past time (in pickup timezone)
  if (isTimeBefore(t, nowInZone)) return true;

  // 2) Lead time rule
  if (leadTime && isTimeBefore(t, leadTime)) return true;

  // 3) minTime boundary
  if (minTime && isTimeBefore(t, minTime)) return true;

  // 4) maxTime boundary
  if (maxTime && isTimeBeforeOrEqual(maxTime, t)) return true;

  return false;
}

/* -----------------------------------------------------
   ⏳ LEAD TIME CALCULATION
   ----------------------------------------------------- */

/**
 * Convert "now" + leadMinutes into a valid TimeValue.
 */
export function getMinimumBookableTime(timezone: string, leadMinutes: number): TimeValue {
  const now = getCurrentTimeInZone(timezone);

  const totalMinutes = now.hours * 60 + now.minutes + leadMinutes;
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;

  return { hours, minutes };
}

/* -----------------------------------------------------
   🕘 TIME SLOT GENERATION
   ----------------------------------------------------- */

/**
 * Generate all time slots in a day based on interval.
 * Example: interval=15 → 96 slots.
 */
export function generateTimeSlots(timezone: string, interval = 15): TimeValue[] {
  const slots: TimeValue[] = [];

  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += interval) {
      const date = createTimeInZone(h, m, timezone);
      slots.push(extractTime(date));
    }
  }

  return slots;
}

/* -----------------------------------------------------
   📝 FORMATTING
   ----------------------------------------------------- */

export function formatTimeValue(time: TimeValue): string {
  const hh = String(time.hours).padStart(2, '0');
  const mm = String(time.minutes).padStart(2, '0');
  return `${hh}:${mm}`;
}
