/**
 * 📅 VANTAGE LANE CALENDAR TYPES
 * Core TypeScript interfaces for the calendar system
 */

export type CalendarMode = 'single' | 'range';
export type CalendarVariant = 'inline' | 'modal';
export type CalendarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface CalendarDate {
  date: Date;
  isToday: boolean;
  isSelected: boolean;
  isInRange: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isDisabled: boolean;
  isCurrentMonth: boolean;
  isPreviousMonth: boolean;
  isNextMonth: boolean;
}

export interface CalendarSelection {
  single: Date | null;
  range: [Date, Date] | null;
}

export interface CalendarState {
  currentMonth: Date;
  selection: CalendarSelection;
  mode: CalendarMode;
  timezone: string;
}

export interface CalendarProps {
  // Core functionality
  value?: Date | [Date, Date] | null | undefined;
  onChange: (date: Date | [Date, Date] | null) => void;

  // Configuration
  mode?: CalendarMode;
  variant?: CalendarVariant;
  timezone: string; // IANA format (e.g., "Europe/London")

  // Constraints
  minDate?: Date | undefined;
  maxDate?: Date | undefined;

  // Layout & Styling
  size?: CalendarSize;
  className?: string;

  // ⭐ NEW — Orientation type
  orientation?: 'portrait' | 'landscape';

  // Optional features
  showToday?: boolean;
  showClear?: boolean;
  disabled?: boolean;

  // Callbacks
  onMonthChange?: (month: Date) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

export interface CalendarWeek {
  days: CalendarDate[];
}

export interface CalendarMonth {
  year: number;
  month: number;
  weeks: CalendarWeek[];
}

export interface CalendarHeaderProps {
  currentMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  className?: string;
}

export interface CalendarGridProps {
  month: CalendarMonth;
  onDateSelect: (date: Date) => void;
  selection: CalendarSelection;
  mode: CalendarMode;
  className?: string;

  // ⭐ NEW
  orientation?: 'portrait' | 'landscape';
}

export interface CalendarDayProps {
  date: CalendarDate;
  onSelect: (date: Date) => void;
  className?: string;
}

export interface CalendarFooterProps {
  onClear?: () => void;
  onToday?: () => void;
  onConfirm?: () => void;
  showClear?: boolean;
  showToday?: boolean;
  showConfirm?: boolean;
  className?: string;
}
