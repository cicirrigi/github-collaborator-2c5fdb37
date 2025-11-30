'use client';

import { useEffect, useRef } from 'react';
import { SCROLL_OFFSET, TIME_PICKER_ITEM_HEIGHT } from './core/time-constants';
import type { TimeValue } from './core/time-types';
import { useTimeEngine } from './core/useTimeEngine';

export function TimePicker({
  date,
  value,
  onChange,
  interval,
  minTime,
  maxTime,
  leadMinutes,
  className = '',
}: {
  date: Date;
  value: TimeValue | null;
  onChange: (t: TimeValue | null) => void;
  interval?: number;
  minTime?: TimeValue;
  maxTime?: TimeValue;
  leadMinutes?: number;
  className?: string;
}) {
  const { slots, disabledMap, selectedSlot, selectedIndex, select } = useTimeEngine({
    date,
    value,
    onChange,
    interval,
    minTime,
    maxTime,
    leadMinutes,
  });

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!listRef.current) return;
    const index = selectedIndex >= 0 ? selectedIndex : 0;
    const top = index * TIME_PICKER_ITEM_HEIGHT - SCROLL_OFFSET;

    listRef.current.scrollTo({
      top: top < 0 ? 0 : top,
      behavior: 'smooth',
    });
  }, [selectedIndex]);

  return (
    <div
      ref={listRef}
      className={`max-h-[60vh] overflow-y-auto space-y-1 scroll-smooth ${className}`}
    >
      {slots.map((slot, i) => {
        const disabled = disabledMap[i];
        const selected =
          selectedSlot?.hours === slot.hours && selectedSlot.minutes === slot.minutes;

        return (
          <button
            key={`${slot.hours}-${slot.minutes}`}
            disabled={disabled}
            onClick={() => select(slot)}
            className={`w-full h-[48px] px-4 rounded-lg text-left flex items-center transition
              ${
                disabled
                  ? 'opacity-40 cursor-not-allowed text-white/30'
                  : selected
                    ? 'bg-amber-400/20 border border-amber-300/40 text-amber-200'
                    : 'text-white hover:bg-white/10'
              }
            `}
          >
            {String(slot.hours).padStart(2, '0')}:{String(slot.minutes).padStart(2, '0')}
          </button>
        );
      })}
    </div>
  );
}
