/**
 * 🕒 VANTAGE LANE — Time Utils (Enterprise Version)
 * Full UK timezone engine:
 * - DST safe
 * - rounding
 * - slot generation
 * - disabled logic
 * - merging date + time
 * - min/max hours
 */

import {
  addDays,
  addMinutes,
  endOfDay,
  isBefore,
  setHours,
  setMilliseconds,
  setMinutes,
  setSeconds,
} from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

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
   🇬🇧 1. SAFE NOW IN UK (DST PROTECTED)
--------------------------------------------------------- */
export function getUKNow(): Date {
  return utcToZonedTime(new Date(), UK_TIMEZONE);
}

/* -------------------------------------------------------
   🕒 2. ROUND DATE TO NEXT INTERVAL (15/30/60 minutes)
--------------------------------------------------------- */
export function roundToInterval(date: Date, interval = DEFAULT_INTERVAL_MINUTES): Date {
  const minutes = date.getMinutes();
  const rounded = Math.ceil(minutes / interval) * interval;

  let d = new Date(date);

  if (rounded === 60) {
    // rollover hour
    d = addMinutes(date, 60 - minutes);
  } else {
    d.setMinutes(rounded);
  }

  d.setSeconds(0);
  d.setMilliseconds(0);

  return d;
}

/* -------------------------------------------------------
   🕘 3. MINIMUM BOOKABLE MOMENT (NOW + LEAD TIME)
--------------------------------------------------------- */
export function minimumBookableMoment(lead = DEFAULT_LEAD_TIME_MINUTES): Date {
  return addMinutes(getUKNow(), lead);
}

/* -------------------------------------------------------
   🗓️ 4. EARLIEST VALID BOOKING DATE
--------------------------------------------------------- */
export function earliestValidBookingDate(lead = DEFAULT_LEAD_TIME_MINUTES): Date {
  const now = getUKNow();
  const minMoment = minimumBookableMoment(lead);

  // Passed midnight → booking only possible tomorrow
  if (minMoment > endOfDay(now)) {
    return addDays(now, 1);
  }

  return now;
}

/* -------------------------------------------------------
   🧮 5. MERGE DATE + TIME (UK TIMEZONE SAFE)
--------------------------------------------------------- */
export function mergeDateAndTime(date: Date, time: { hours: number; minutes: number }): Date {
  let d = new Date(date);
  d = setHours(d, time.hours);
  d = setMinutes(d, time.minutes);
  d = setSeconds(d, 0);
  d = setMilliseconds(d, 0);
  return utcToZonedTime(d, UK_TIMEZONE);
}

/* -------------------------------------------------------
   🇬🇧 6. CREATE DATE FROM TIME ONLY (TODAY IN UK)
--------------------------------------------------------- */
export function createDateFromTime(time: { hours: number; minutes: number }): Date {
  const now = getUKNow();
  return mergeDateAndTime(now, time);
}

/* -------------------------------------------------------
   🧩 7. EXTRACT TIME FROM DATE
--------------------------------------------------------- */
export function extractTime(date: Date) {
  return {
    hours: date.getHours(),
    minutes: date.getMinutes(),
  };
}

/* -------------------------------------------------------
   🟡 8. GENERATE SLOTS FOR THE WHOLE DAY
--------------------------------------------------------- */
export function generateTimeSlots(
  interval = DEFAULT_INTERVAL_MINUTES
): { hours: number; minutes: number }[] {
  const slots: { hours: number; minutes: number }[] = [];

  for (let h = MIN_HOUR; h <= MAX_HOUR; h++) {
    for (let m = MIN_MINUTE; m <= MAX_MINUTE; m += interval) {
      slots.push({ hours: h, minutes: m });
    }
  }

  return slots;
}

/* -------------------------------------------------------
   🚫 9. DISABLED CHECKER (PAST / LEAD TIME / MIN/MAX)
--------------------------------------------------------- */
export function isTimeDisabled({
  slot,
  date,
  lead = DEFAULT_LEAD_TIME_MINUTES,
  minTime,
  maxTime,
}: {
  slot: { hours: number; minutes: number };
  date: Date; // the selected calendar day
  lead?: number;
  minTime?: { hours: number; minutes: number };
  maxTime?: { hours: number; minutes: number };
}): boolean {
  const slotDate = mergeDateAndTime(date, slot);

  // 1. past time
  if (isBefore(slotDate, getUKNow())) return true;

  // 2. lead time
  const minMoment = minimumBookableMoment(lead);
  if (isBefore(slotDate, minMoment)) return true;

  // 3. minTime constraint
  if (minTime) {
    const minDateObj = mergeDateAndTime(date, minTime);
    if (isBefore(slotDate, minDateObj)) return true;
  }

  // 4. maxTime constraint
  if (maxTime) {
    const maxDateObj = mergeDateAndTime(date, maxTime);
    if (isBefore(maxDateObj, slotDate)) return true;
  }

  return false;
}

/* -------------------------------------------------------
   🧪 10. FORMAT FOR INPUTS
--------------------------------------------------------- */
export function formatTimeForInput(time: { hours: number; minutes: number }): string {
  return `${String(time.hours).padStart(2, '0')}:${String(time.minutes).padStart(2, '0')}`;
}
