'use client';

import { useCallback, useMemo } from 'react';
import { DEFAULT_INTERVAL_MINUTES, DEFAULT_LEAD_TIME_MINUTES } from './time-constants';

import type { TimeValue } from './time-types';
import { formatTimeForInput, generateTimeSlots, isTimeDisabled } from './time-utils';

export function useTimeEngine({
  date,
  value,
  onChange,
  interval = DEFAULT_INTERVAL_MINUTES,
  minTime,
  maxTime,
  leadMinutes = DEFAULT_LEAD_TIME_MINUTES,
}: {
  date: Date;
  value: TimeValue | null;
  onChange: (t: TimeValue | null) => void;
  interval?: number;
  minTime?: TimeValue;
  maxTime?: TimeValue;
  leadMinutes?: number;
}) {
  const slots = useMemo(() => generateTimeSlots(interval), [interval]);

  const disabledMap = useMemo(
    () =>
      slots.map(slot =>
        isTimeDisabled({
          slot,
          date,
          lead: leadMinutes,
          minTime,
          maxTime,
        })
      ),
    [slots, date, leadMinutes, minTime, maxTime]
  );

  const firstValidSlot = useMemo(
    () => slots.find((_, i) => !disabledMap[i]) || null,
    [slots, disabledMap]
  );

  const selectedSlot = useMemo(() => {
    if (
      value &&
      !isTimeDisabled({
        slot: value,
        date,
        lead: leadMinutes,
        minTime,
        maxTime,
      })
    ) {
      return value;
    }
    return firstValidSlot;
  }, [value, firstValidSlot, date, leadMinutes, minTime, maxTime]);

  const selectedIndex = useMemo(
    () =>
      selectedSlot
        ? slots.findIndex(s => s.hours === selectedSlot.hours && s.minutes === selectedSlot.minutes)
        : -1,
    [selectedSlot, slots]
  );

  const select = useCallback(
    (slot: TimeValue) => {
      if (
        isTimeDisabled({
          slot,
          date,
          lead: leadMinutes,
          minTime,
          maxTime,
        })
      ) {
        return;
      }
      onChange(slot);
    },
    [onChange, date, leadMinutes, minTime, maxTime]
  );

  return {
    slots,
    disabledMap,
    selectedSlot,
    selectedIndex,
    select,
    formatted: selectedSlot ? formatTimeForInput(selectedSlot) : '',
  };
}
