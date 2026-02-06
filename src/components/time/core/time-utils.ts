/**
 * 🕒 VANTAGE LANE — TIME UTILS (FINAL ENTERPRISE — DST SAFE)
 */

import { addDays, addMinutes, endOfDay, isBefore } from 'date-fns';

import {
  DEFAULT_INTERVAL_MINUTES,
  DEFAULT_LEAD_TIME_MINUTES,
  MAX_HOUR,
  MAX_MINUTE,
  MIN_HOUR,
  MIN_MINUTE,
  UK_TIMEZONE,
} from './time-constants';

/* -------------------------------------------------------
   🇬🇧 UNIVERSAL DST-SAFE UK CONVERTER
--------------------------------------------------------- */
export function toUK(date: Date): Date {
  // Get UK time components
  const ukString = date.toLocaleString('sv-SE', { timeZone: UK_TIMEZONE });
  return new Date(ukString);
}

/* -------------------------------------------------------
   🇬🇧 GET NOW IN LONDON (DST SAFE)
--------------------------------------------------------- */
export function getUKNow(): Date {
  return toUK(new Date());
}

/* -------------------------------------------------------
   ROUND DATE TO INTERVAL — DST SAFE
--------------------------------------------------------- */
export function roundToInterval(date: Date, interval = DEFAULT_INTERVAL_MINUTES): Date {
  // Do NOT convert again if already in UK timezone
  const mins = date.getMinutes();
  const rounded = Math.ceil(mins / interval) * interval;

  const result = new Date(date.getTime()); // prevent mutation

  if (rounded >= 60) {
    result.setHours(date.getHours() + 1);
    result.setMinutes(0);
  } else {
    result.setMinutes(rounded);
  }

  result.setSeconds(0);
  result.setMilliseconds(0);

  return result; // DO NOT reconvert again
}

/* -------------------------------------------------------
   MINIMUM BOOKABLE MOMENT = UK NOW + LEAD
--------------------------------------------------------- */
export function minimumBookableMoment(lead = DEFAULT_LEAD_TIME_MINUTES): Date {
  return addMinutes(getUKNow(), lead);
}

/* -------------------------------------------------------
   EARLIEST VALID BOOKING DATE
--------------------------------------------------------- */
export function earliestValidBookingDate(lead = DEFAULT_LEAD_TIME_MINUTES): Date {
  const now = getUKNow();
  const min = minimumBookableMoment(lead);
  return min > endOfDay(now) ? addDays(now, 1) : now;
}

/* -------------------------------------------------------
   MERGE DATE + TIME (DST SAFE)
--------------------------------------------------------- */
export function mergeDateAndTime(date: Date, time: { hours: number; minutes: number }): Date {
  const uk = toUK(date);
  uk.setHours(time.hours);
  uk.setMinutes(time.minutes);
  uk.setSeconds(0);
  uk.setMilliseconds(0);
  return uk;
}

/* -------------------------------------------------------
   CREATE DATE FROM TIME (UK NOW)
--------------------------------------------------------- */
export function createDateFromTime(time: { hours: number; minutes: number }) {
  return mergeDateAndTime(getUKNow(), time);
}

/* -------------------------------------------------------
   EXTRACT HH:MM (DST SAFE)
--------------------------------------------------------- */
export function extractTime(date: Date) {
  const uk = toUK(date);
  return { hours: uk.getHours(), minutes: uk.getMinutes() };
}

/* -------------------------------------------------------
   GENERATE TIME SLOTS FOR THE DAY
--------------------------------------------------------- */
export function generateTimeSlots(interval = DEFAULT_INTERVAL_MINUTES) {
  const out = [];
  for (let h = MIN_HOUR; h <= MAX_HOUR; h++) {
    for (let m = MIN_MINUTE; m <= MAX_MINUTE; m += interval) {
      out.push({ hours: h, minutes: m });
    }
  }
  return out;
}

/* -------------------------------------------------------
   DISABLED LOGIC — FINAL ENTERPRISE VERSION
--------------------------------------------------------- */
export function isTimeDisabled({
  slot,
  date,
  lead = DEFAULT_LEAD_TIME_MINUTES,
  minTime,
  maxTime,
}: {
  slot: { hours: number; minutes: number };
  date: Date;
  lead?: number;
  minTime?: { hours: number; minutes: number } | undefined;
  maxTime?: { hours: number; minutes: number } | undefined;
}) {
  const slotDate = mergeDateAndTime(date, slot);

  const now = getUKNow();
  if (isBefore(slotDate, now)) return true;

  const minMoment = minimumBookableMoment(lead);
  if (isBefore(slotDate, minMoment)) return true;

  if (minTime) {
    const minObj = mergeDateAndTime(date, minTime);
    if (isBefore(slotDate, minObj)) return true;
  }

  if (maxTime) {
    const maxObj = mergeDateAndTime(date, maxTime);
    if (isBefore(maxObj, slotDate)) return true;
  }

  return false;
}

/* -------------------------------------------------------
   FORMATTER HH:MM
--------------------------------------------------------- */
export function formatTimeForInput(time: { hours: number; minutes: number }) {
  return `${String(time.hours).padStart(2, '0')}:${String(time.minutes).padStart(2, '0')}`;
}
