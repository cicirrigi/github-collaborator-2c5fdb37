/**
 * 🕒 VANTAGE LANE — TimePicker (Core Desktop Component)
 * Pure logic + structure, no styling.
 * Uses useTimePicker() and displays TimeGrid.
 */

import type { TimePickerProps } from './core/time-types';
import { useTimePicker } from './core/useTimePicker';
import { TimeGrid } from './ui/TimeGrid';

export function TimePicker({
  value,
  onChange,
  timezone,
  interval,
  minTime,
  maxTime,
  leadMinutes,
  className = '',
}: TimePickerProps) {
  const { slots, selected, disabledChecker, handleSelect } = useTimePicker({
    value,
    onChange,
    timezone,
    interval,
    minTime,
    maxTime,
    leadMinutes,
  });

  return (
    <div className={className} data-time-picker='true'>
      <TimeGrid
        slots={slots}
        selected={selected}
        disabledChecker={disabledChecker}
        onSelect={handleSelect}
      />
    </div>
  );
}
