/**
 * 🇬🇧 VANTAGE LANE — UK Timezone Engine (FINAL ENTERPRISE VERSION)
 * DST-SAFE (BST/GMT), lead time, rounding, merging date+time
 */

import { addDays, addMinutes, endOfDay, isBefore } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

export const UK_TZ = 'Europe/London';
export const LEAD_TIME_MINUTES = 120; // 2 hours strict

/* ---------------------------------------------------------
   1. NOW IN UK (DST SAFE)
--------------------------------------------------------- */
export function getUKNow(): Date {
  return utcToZonedTime(new Date(), UK_TZ);
}

/* ---------------------------------------------------------
   2. ROUND TO NEAREST 15-MIN SLOT (WITH DST FIX)
--------------------------------------------------------- */
export function roundTo15(date: Date): Date {
  const minutes = date.getMinutes();
  const rounded = Math.ceil(minutes / 15) * 15;

  // 53 → 60 → FIX by adding minutes
  if (rounded === 60) {
    return addMinutes(date, 60 - minutes);
  }

  const d = new Date(date);
  d.setMinutes(rounded, 0, 0);
  return utcToZonedTime(d, UK_TZ);
}

/* ---------------------------------------------------------
   3. UK LEAD TIME (NOW + X MINUTES)
--------------------------------------------------------- */
export function getUKLeadTime(minutes: number): Date {
  return addMinutes(getUKNow(), minutes);
}

/* ---------------------------------------------------------
   4. FORMAT UK DATE TO ISO
--------------------------------------------------------- */
export function formatUKDate(date: Date): string {
  return utcToZonedTime(date, UK_TZ).toISOString();
}

/* ---------------------------------------------------------
   5. CHECK IF DATE IS IN UK PAST
--------------------------------------------------------- */
export function isInUKPast(date: Date): boolean {
  return isBefore(date, getUKNow());
}

/* ---------------------------------------------------------
   6. CHECK IF DATE IS BEFORE LEAD-TIME LIMIT
--------------------------------------------------------- */
export function isBeforeLeadTime(date: Date, leadMinutes: number = LEAD_TIME_MINUTES): boolean {
  const lead = getUKLeadTime(leadMinutes);
  return isBefore(date, lead);
}

/* ---------------------------------------------------------
   7. CONVERT ANY DATE → UK TIMEZONE
--------------------------------------------------------- */
export function toUK(date: Date): Date {
  return utcToZonedTime(date, UK_TZ);
}

/* ---------------------------------------------------------
   8. CREATE UK DATE FROM (HOUR, MINUTES)
--------------------------------------------------------- */
export function ukDateFromHM(hours: number, minutes: number): Date {
  const now = getUKNow();
  const d = new Date(now);
  d.setHours(hours, minutes, 0, 0);
  return utcToZonedTime(d, UK_TZ);
}

/* ---------------------------------------------------------
   9. EXTRACT TIME (HH:mm)
--------------------------------------------------------- */
export function extractTime(date: Date): { hours: number; minutes: number } {
  return {
    hours: date.getHours(),
    minutes: date.getMinutes(),
  };
}

/* ---------------------------------------------------------
   10. MINIMUM BOOKABLE MOMENT (NOW + LEAD TIME)
--------------------------------------------------------- */
export function minimumBookableMoment(leadMinutes: number = LEAD_TIME_MINUTES): Date {
  return addMinutes(getUKNow(), leadMinutes);
}

/* ---------------------------------------------------------
   11. EARLIEST VALID BOOKING DATE
--------------------------------------------------------- */
export function getEarliestValidDate(leadMinutes: number = LEAD_TIME_MINUTES): Date {
  const now = getUKNow();
  const minMoment = minimumBookableMoment(leadMinutes);

  // If lead limit spills into tomorrow → earliest date = tomorrow
  if (minMoment > endOfDay(now)) {
    return addDays(now, 1);
  }

  return now;
}

/* ---------------------------------------------------------
   12. CREATE DATE BY MERGING DATE + TIME (DST SAFE)
--------------------------------------------------------- */
export function mergeDateAndTime(date: Date, time: { hours: number; minutes: number }): Date {
  const d = new Date(date);
  d.setHours(time.hours, time.minutes, 0, 0);
  return utcToZonedTime(d, UK_TZ);
}

/* ---------------------------------------------------------
   13. CREATE DATE FROM TIME ONLY (BASED ON TODAY IN UK)
--------------------------------------------------------- */
export function createDateFromTime(
  time: { hours: number; minutes: number },
  baseDate?: Date
): Date {
  const base = baseDate ? toUK(baseDate) : getUKNow();
  const d = new Date(base);
  d.setHours(time.hours, time.minutes, 0, 0);
  return utcToZonedTime(d, UK_TZ);
}
