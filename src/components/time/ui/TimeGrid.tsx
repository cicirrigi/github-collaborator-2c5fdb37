/**
 * 🕒 VANTAGE LANE — TimeGrid
 * Displays a vertical list of time slots (00:00 → 23:45).
 * Zero styling — only structure + data attributes.
 */

import type { TimeGridProps } from '../core/time-types';
import { TimeOption } from './TimeOption';

export function TimeGrid({
  slots,
  selected,
  disabledChecker,
  onSelect,
  className = '',
}: TimeGridProps) {
  return (
    <div
      className={`max-h-48 overflow-y-auto border border-amber-200/20 rounded-lg p-2 bg-black/20 ${className}`}
      data-time-grid='true'
    >
      {slots.map((slot, index) => {
        const disabled = disabledChecker(slot);
        const isSelected =
          selected && selected.hours === slot.hours && selected.minutes === slot.minutes;

        return (
          <TimeOption
            key={index}
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
        );
      })}
    </div>
  );
}
