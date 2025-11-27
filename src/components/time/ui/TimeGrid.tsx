/**
 * 🕒 VANTAGE LANE — TimeGrid
 * Displays a vertical list of time slots (00:00 → 23:45).
 * Zero styling — only structure + data attributes.
 */

'use client';

import { useEffect, useRef } from 'react';
import type { TimeGridProps } from '../core/time-types';
import { TimeOption } from './TimeOption';

export function TimeGrid({
  slots,
  selected,
  disabledChecker,
  onSelect,
  className = '',
}: TimeGridProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  /* -----------------------------------------------------
     🔥 AUTO SCROLL TO SELECTED TIME
  ----------------------------------------------------- */
  useEffect(() => {
    if (!containerRef.current || !selected) return;

    const index = slots.findIndex(
      s => s.hours === selected.hours && s.minutes === selected.minutes
    );
    if (index === -1) return;

    const container = containerRef.current;
    const item = container.querySelector(`[data-time-item="${index}"]`) as HTMLElement | null;

    if (item) {
      const offset = item.offsetTop - container.clientHeight / 2 + item.clientHeight / 2;

      container.scrollTo({
        top: offset,
        behavior: 'smooth',
      });
    }
  }, [selected, slots]);

  return (
    <div
      ref={containerRef}
      className={`
        max-h-48 overflow-y-auto
        border border-amber-200/20 rounded-lg
        p-2 bg-black/20
        scroll-smooth
        ${className}
      `}
      data-time-grid='true'
    >
      {slots.map((slot, index) => {
        const disabled = disabledChecker(slot);

        const isSelected =
          selected && selected.hours === slot.hours && selected.minutes === slot.minutes;

        return (
          <div key={index} data-time-item={index}>
            <TimeOption
              time={slot}
              isDisabled={disabled}
              isSelected={!!isSelected}
              onSelect={onSelect}
              className={`
                w-full p-2 mb-1 text-left rounded text-sm transition-colors
                ${
                  isSelected
                    ? 'bg-amber-500 text-black font-medium'
                    : disabled
                      ? 'text-amber-200/30 cursor-not-allowed'
                      : 'text-amber-100 hover:bg-amber-200/10 hover:text-amber-50'
                }
              `}
            />
          </div>
        );
      })}
    </div>
  );
}
