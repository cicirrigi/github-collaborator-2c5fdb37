/**
 * 🕒 VANTAGE LANE — useTimeEngine (Enterprise Version)
 *
 * This hook unifies ALL time selection logic:
 * - UK timezone
 * - lead time
 * - interval
 * - default slot
 * - disabled slots
 * - min/max time
 * - scroll-to-selected
 * - scroll-to-first-valid
 *
 * It powers both Mobile & Desktop TimePicker.
 */

'use client';

import { useCallback, useMemo } from 'react';

import { formatTimeForInput, generateTimeSlots, isTimeDisabled } from './time-utils-new';

import { DEFAULT_INTERVAL_MINUTES, DEFAULT_LEAD_TIME_MINUTES } from './time-constants';

export interface TimeValue {
  hours: number;
  minutes: number;
}

export interface UseTimeEngineProps {
  /** Current selected date from Calendar */
  date: Date;

  /** Time value selected by user */
  value: TimeValue | null;

  /** Called whenever user selects a time */
  onChange: (t: TimeValue | null) => void;

  /** Slot interval (15 default) */
  interval?: number;

  /** Optional min/max constraints */
  minTime?: TimeValue;
  maxTime?: TimeValue;

  /** Lead time (2h default) */
  leadMinutes?: number;
}

export function useTimeEngine({
  date,
  value,
  onChange,
  interval = DEFAULT_INTERVAL_MINUTES,
  minTime,
  maxTime,
  leadMinutes = DEFAULT_LEAD_TIME_MINUTES,
}: UseTimeEngineProps) {
  /* -------------------------------------------------------
     1. Generate all slots for the day
  --------------------------------------------------------- */
  const slots = useMemo(() => generateTimeSlots(interval), [interval]);

  /* -------------------------------------------------------
     2. Calculate disabled slots
  --------------------------------------------------------- */
  const disabledMap = useMemo(() => {
    return slots.map(slot =>
      isTimeDisabled({
        slot,
        date,
        lead: leadMinutes,
        minTime,
        maxTime,
      })
    );
  }, [slots, date, leadMinutes, minTime, maxTime]);

  /* -------------------------------------------------------
     3. Calculate the FIRST valid slot (for default)
  --------------------------------------------------------- */
  const firstValidSlot: TimeValue | null = useMemo(() => {
    for (let i = 0; i < slots.length; i++) {
      if (!disabledMap[i]) return slots[i];
    }
    return null;
  }, [slots, disabledMap]);

  /* -------------------------------------------------------
     4. Determine the selected value:
        - if user selected a valid one → keep it
        - else → use firstValidSlot
        - else → null
  --------------------------------------------------------- */
  const selectedSlot: TimeValue | null = useMemo(() => {
    if (value && !isTimeDisabled({ slot: value, date, lead: leadMinutes, minTime, maxTime })) {
      return value;
    }

    return firstValidSlot;
  }, [value, firstValidSlot, date, leadMinutes, minTime, maxTime]);

  /* -------------------------------------------------------
     5. Select handler
  --------------------------------------------------------- */
  const select = useCallback(
    (slot: TimeValue) => {
      if (isTimeDisabled({ slot, date, lead: leadMinutes, minTime, maxTime })) return;
      onChange(slot);
    },
    [onChange, date, leadMinutes, minTime, maxTime]
  );

  /* -------------------------------------------------------
     6. Formatted for input fields (HH:mm)
  --------------------------------------------------------- */
  const formatted = useMemo(() => {
    if (!selectedSlot) return '';
    return formatTimeForInput(selectedSlot);
  }, [selectedSlot]);

  /* -------------------------------------------------------
     7. Scroll to logic:
        - index of selected slot
        - index of first valid slot
  --------------------------------------------------------- */
  const selectedIndex = useMemo(() => {
    if (!selectedSlot) return -1;

    return slots.findIndex(
      s => s.hours === selectedSlot.hours && s.minutes === selectedSlot.minutes
    );
  }, [selectedSlot, slots]);

  const firstValidIndex = useMemo(() => {
    if (!firstValidSlot) return -1;

    return slots.findIndex(
      s => s.hours === firstValidSlot.hours && s.minutes === firstValidSlot.minutes
    );
  }, [firstValidSlot, slots]);

  /* -------------------------------------------------------
     Return unified engine
  --------------------------------------------------------- */
  return {
    slots,
    disabledMap,
    selectedSlot,
    formatted,

    selectedIndex,
    firstValidIndex,

    select,
  };
}
