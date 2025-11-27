/**
 * 🕒 VANTAGE LANE — useTimePicker Hook
 * Core time selection logic: slots, disabled rules, timezone, lead time.
 */

import { useCallback, useMemo } from 'react';
import type { TimePickerProps, TimeValue } from './time-types';

import {
  formatTimeValue,
  generateTimeSlots,
  getCurrentTimeInZone,
  getMinimumBookableTime,
  isTimeDisabled,
} from './time-utils';

export function useTimePicker({
  value,
  onChange,
  timezone,
  interval = 15,
  minTime,
  maxTime,
  leadMinutes,
}: TimePickerProps) {
  /* -----------------------------------------------------
     1. Generate all time slots for the day (00:00 → 23:45)
     ----------------------------------------------------- */
  const slots = useMemo(() => {
    return generateTimeSlots(timezone, interval);
  }, [timezone, interval]);

  /* -----------------------------------------------------
     2. Compute the "now" in booking timezone
     ----------------------------------------------------- */
  const nowInZone = useMemo(() => {
    return getCurrentTimeInZone(timezone);
  }, [timezone]);

  /* -----------------------------------------------------
     3. Compute lead time minimum (if configured)
     ----------------------------------------------------- */
  const leadMin = useMemo<TimeValue | undefined>(() => {
    if (!leadMinutes) return undefined;
    return getMinimumBookableTime(timezone, leadMinutes);
  }, [timezone, leadMinutes]);

  /* -----------------------------------------------------
     4. Disable logic checker for UI components
     ----------------------------------------------------- */
  const disabledChecker = useCallback(
    (t: TimeValue) => {
      return isTimeDisabled(t, nowInZone, minTime, maxTime, leadMin);
    },
    [nowInZone, minTime, maxTime, leadMin]
  );

  /* -----------------------------------------------------
     5. Select Handler
     ----------------------------------------------------- */
  const handleSelect = useCallback(
    (t: TimeValue) => {
      if (disabledChecker(t)) return;
      onChange(t);
    },
    [onChange, disabledChecker]
  );

  /* -----------------------------------------------------
     6. Formatted selected string
     ----------------------------------------------------- */
  const formattedValue = useMemo(() => {
    if (!value) return '';
    return formatTimeValue(value);
  }, [value]);

  return {
    // Data
    slots,
    nowInZone,
    minTime,
    maxTime,
    leadMin,

    // State
    selected: value ?? null,

    // Handlers
    disabledChecker,
    handleSelect,

    // UI Helpers
    formattedValue,
  };
}
