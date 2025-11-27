'use client';

/**
 * 🕒 VANTAGE LANE — TimePicker (Core UI Component)
 *
 * Uses:
 *  - useTimeEngine (slots, disabled logic, default selection)
 *  - auto-scroll to selected/firstValid slot
 *
 * No heavy styling here — just structure + logic.
 */

import { useEffect, useRef } from 'react';
import { SCROLL_OFFSET, TIME_PICKER_ITEM_HEIGHT } from './core/time-constants';
import { useTimeEngine, type TimeValue } from './core/useTimeEngine';

interface TimePickerProps {
  date: Date;
  value: TimeValue | null;
  onChange: (t: TimeValue | null) => void;

  interval?: number;
  minTime?: TimeValue;
  maxTime?: TimeValue;
  leadMinutes?: number;

  className?: string;
}

export function TimePicker({
  date,
  value,
  onChange,
  interval,
  minTime,
  maxTime,
  leadMinutes,
  className = '',
}: TimePickerProps) {
  /* -------------------------------------------------------
     1. Time Engine — business logic
  --------------------------------------------------------- */
  const { slots, disabledMap, selectedSlot, selectedIndex, select } = useTimeEngine({
    date,
    value,
    onChange,
    interval,
    minTime,
    maxTime,
    leadMinutes,
  });

  /* -------------------------------------------------------
     2. Ref pentru lista scrollabilă
  --------------------------------------------------------- */
  const listRef = useRef<HTMLDivElement | null>(null);

  /* -------------------------------------------------------
     3. Auto-scroll la slotul selectat
  --------------------------------------------------------- */
  useEffect(() => {
    if (!listRef.current) return;

    const indexToScroll = selectedIndex >= 0 ? selectedIndex : 0;

    const scrollTop = indexToScroll * TIME_PICKER_ITEM_HEIGHT - SCROLL_OFFSET;

    listRef.current.scrollTo({
      top: scrollTop < 0 ? 0 : scrollTop,
      behavior: 'smooth',
    });
  }, [selectedIndex]);

  /* -------------------------------------------------------
     4. Rendering
  --------------------------------------------------------- */
  return (
    <div
      ref={listRef}
      className={`max-h-[60vh] overflow-y-auto scroll-smooth space-y-1 ${className}`}
    >
      {slots.map((slot, index) => {
        const disabled = disabledMap[index];
        const isSelected =
          selectedSlot &&
          selectedSlot.hours === slot.hours &&
          selectedSlot.minutes === slot.minutes;

        return (
          <button
            key={`${slot.hours}-${slot.minutes}`}
            type='button'
            disabled={disabled}
            onClick={() => select(slot)}
            className={`
              w-full h-[48px] flex items-center
              px-4 rounded-lg text-left transition
              ${
                disabled
                  ? 'opacity-40 cursor-not-allowed text-white/30'
                  : isSelected
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
