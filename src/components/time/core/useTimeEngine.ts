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
  interval?: number | undefined;
  minTime?: TimeValue | undefined;
  maxTime?: TimeValue | undefined;
  leadMinutes?: number | undefined;
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
    console.log('🔍 useTimeEngine - value:', value);
    console.log('🔍 useTimeEngine - firstValidSlot:', firstValidSlot);

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
      console.log('✅ Using provided value:', value);
      return value;
    }
    console.log('🎯 Falling back to firstValidSlot:', firstValidSlot);
    return firstValidSlot;
  }, [value, firstValidSlot, date, leadMinutes, minTime, maxTime]);

  const selectedIndex = useMemo(() => {
    const index = selectedSlot
      ? slots.findIndex(s => s.hours === selectedSlot.hours && s.minutes === selectedSlot.minutes)
      : -1;
    console.log('📍 selectedIndex calculated:', index, 'for slot:', selectedSlot);
    return index;
  }, [selectedSlot, slots]);

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
