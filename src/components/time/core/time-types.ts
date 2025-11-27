/**
 * 🕒 VANTAGE LANE — TIME PICKER TYPES
 * Strict, minimal, enterprise-grade type definitions.
 */

export interface TimeValue {
  hours: number; // 0–23
  minutes: number; // 0–59
}

export interface TimePickerProps {
  value?: TimeValue | null | undefined;
  onChange: (time: TimeValue | null) => void;

  // Behavior & constraints
  timezone: string; // MUST be IANA (ex: "Europe/London")
  interval?: number | undefined; // minutes step: 5, 10, 15, 30, 60
  minTime?: TimeValue | undefined; // earliest allowed slot
  maxTime?: TimeValue | undefined; // latest allowed slot
  leadMinutes?: number | undefined; // disable X minutes from now (ex: 120)

  // UI
  className?: string;
}

export interface TimeOptionProps {
  time: TimeValue;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: (t: TimeValue) => void;
  className?: string;
}

export interface TimeGridProps {
  slots: TimeValue[];
  selected: TimeValue | null;
  disabledChecker: (t: TimeValue) => boolean;
  onSelect: (t: TimeValue) => void;
  className?: string;
}
