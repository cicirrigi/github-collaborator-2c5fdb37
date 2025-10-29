'use client';

import { cn } from '@/lib/utils';
import { LocationPicker } from '../../location-picker';
import type { GooglePlace } from '../../location-picker/types';
import { TRAVEL_PLANNER_PRO_THEME as theme } from '../constants';

interface ReturnLocationFieldProps {
  label: string;
  value: GooglePlace | null;
  onChange: (location: GooglePlace | null) => void;
  placeholder: string;
  variant: 'pickup' | 'destination';
  disabled?: boolean;
  className?: string;
}

/**
 * 🗺️ ReturnLocationField
 * Extracted subcomponent pentru eliminarea codului duplicat din ReturnJourneyCard
 * Reduces code duplication și îmbunătățește mentenabilitatea
 */
export const ReturnLocationField = ({
  label,
  value,
  onChange,
  placeholder,
  variant,
  disabled = false,
  className,
}: ReturnLocationFieldProps) => {
  return (
    <div className={className}>
      <label className={cn("block text-sm font-medium mb-2", theme.colors.neutral.text.muted)}>
        {label}
      </label>
      <LocationPicker
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        variant={variant}
        disabled={disabled}
      />
    </div>
  );
};

export default ReturnLocationField;
