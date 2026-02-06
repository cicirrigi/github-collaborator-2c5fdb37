/**
 * 🎯 VANTAGE LANE — Auto-Select Calendar & Time Logic (FIXED)
 *
 * SAME BUSINESS LOGIC — Now fully safe & correct:
 * - Correct date-fns imports
 * - Real date comparisons (no string compares)
 * - Lead-time hours accurate
 */

import { addDays, addMinutes, endOfDay, isAfter, isBefore, isSameDay, startOfDay } from 'date-fns';

import { DEFAULT_INTERVAL_MINUTES, DEFAULT_LEAD_TIME_MINUTES } from './time-constants';
import type { TimeValue } from './time-types';
import { extractTime, getUKNow, roundToInterval } from './time-utils';

/* -------------------------------------------------------
   📅 EARLIEST VALID BOOKING DATE
--------------------------------------------------------- */
export function getEarliestValidBookingDate(lead = DEFAULT_LEAD_TIME_MINUTES): Date {
  const now = getUKNow();
  const minMoment = addMinutes(now, lead);

  // If too late today → move to tomorrow
  return isAfter(minMoment, endOfDay(now)) ? addDays(now, 1) : now;
}

/* -------------------------------------------------------
   ⏰ EARLIEST VALID BOOKING TIME FOR A SPECIFIC DATE
--------------------------------------------------------- */
export function getEarliestValidBookingTime(
  date: Date,
  lead = DEFAULT_LEAD_TIME_MINUTES,
  interval = DEFAULT_INTERVAL_MINUTES
): TimeValue {
  const now = getUKNow();
  const minMoment = addMinutes(now, lead);

  // If booking date is AFTER minMoment → start at 00:00
  if (isAfter(startOfDay(date), startOfDay(minMoment))) {
    return { hours: 0, minutes: 0 };
  }

  // If booking date is SAME as minMoment date → round forward
  if (isSameDay(date, minMoment)) {
    const rounded = roundToInterval(minMoment, interval);
    return extractTime(rounded);
  }

  // If booking date is BEFORE minMoment → no availability
  return { hours: 23, minutes: 59 };
}

/* -------------------------------------------------------
   🎯 SMART AUTO-SELECT
--------------------------------------------------------- */
export interface AutoSelectResult {
  date: Date;
  time: TimeValue;
  isNextDay: boolean;
  leadTimeHours: number;
}

export function getSmartAutoSelect(
  lead = DEFAULT_LEAD_TIME_MINUTES,
  interval = DEFAULT_INTERVAL_MINUTES
): AutoSelectResult {
  const now = getUKNow();

  const earliestDate = getEarliestValidBookingDate(lead);
  const earliestTime = getEarliestValidBookingTime(earliestDate, lead, interval);

  const isNextDay = !isSameDay(earliestDate, now);

  return {
    date: earliestDate,
    time: earliestTime,
    isNextDay,
    leadTimeHours: lead / 60, // precise value
  };
}

/* -------------------------------------------------------
   📊 VALIDATE DATE/TIME
--------------------------------------------------------- */
export function isValidBookingDateTime(
  date: Date,
  time: TimeValue,
  lead = DEFAULT_LEAD_TIME_MINUTES
): boolean {
  const now = getUKNow();
  const minMoment = addMinutes(now, lead);

  const bookingMoment = new Date(date);
  bookingMoment.setHours(time.hours, time.minutes, 0, 0);

  return isAfter(bookingMoment, minMoment) || isSameDay(bookingMoment, minMoment);
}

/* -------------------------------------------------------
   💡 NEXT AVAILABLE AFTER INVALID SELECTION
--------------------------------------------------------- */
export function getNextAvailableDateTime(
  selectedDate: Date,
  lead = DEFAULT_LEAD_TIME_MINUTES,
  interval = DEFAULT_INTERVAL_MINUTES
): AutoSelectResult | null {
  const selectedTime = getEarliestValidBookingTime(selectedDate, lead, interval);

  if (isValidBookingDateTime(selectedDate, selectedTime, lead)) {
    const now = getUKNow();
    return {
      date: selectedDate,
      time: selectedTime,
      isNextDay: !isSameDay(selectedDate, now),
      leadTimeHours: lead / 60,
    };
  }

  return getSmartAutoSelect(lead, interval);
}

/* -------------------------------------------------------
   🚨 USER FEEDBACK
--------------------------------------------------------- */
export interface UserFeedback {
  type: 'info' | 'warning' | 'suggestion';
  message: string;
  suggestedAction?: string;
}

export function getUserFeedbackForSelection(
  selectedDate: Date,
  lead = DEFAULT_LEAD_TIME_MINUTES
): UserFeedback | null {
  const smart = getSmartAutoSelect(lead);

  if (isBefore(startOfDay(selectedDate), startOfDay(smart.date))) {
    return {
      type: 'warning',
      message: `No times available for ${selectedDate.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}`,
      suggestedAction: `Switch to ${smart.date.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}? (Next available)`,
    };
  }

  if (smart.isNextDay && isSameDay(selectedDate, smart.date)) {
    return {
      type: 'info',
      message: `Booking for tomorrow due to ${smart.leadTimeHours}h lead-time requirement`,
    };
  }

  return null;
}
