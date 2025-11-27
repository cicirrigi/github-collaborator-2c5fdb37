/**
 * 🕒 VANTAGE LANE — MobileTimePickerModal
 * Fullscreen modal used on mobile devices.
 * No styling, only structure and accessibility attributes.
 */

import { TimePicker } from '../TimePicker';
import type { TimePickerProps, TimeValue } from '../core/time-types';

interface MobileTimePickerModalProps extends TimePickerProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: (t: TimeValue | null) => void;
}

export function MobileTimePickerModal({
  open,
  onClose,
  onConfirm,
  value,
  onChange,
  timezone,
  interval,
  minTime,
  maxTime,
  leadMinutes,
}: MobileTimePickerModalProps) {
  if (!open) return null;

  const handleConfirm = () => {
    if (onConfirm) onConfirm(value ?? null);
    onClose();
  };

  return (
    <div data-mobile-time-modal='true' role='dialog' aria-modal='true'>
      {/* Header */}
      <div data-mobile-time-header='true'>
        <button type='button' data-action='cancel' onClick={onClose}>
          Cancel
        </button>

        <button type='button' data-action='confirm' onClick={handleConfirm}>
          Done
        </button>
      </div>

      {/* Time Picker Core */}
      <TimePicker
        value={value}
        onChange={onChange}
        timezone={timezone}
        interval={interval}
        minTime={minTime}
        maxTime={maxTime}
        leadMinutes={leadMinutes}
      />
    </div>
  );
}
