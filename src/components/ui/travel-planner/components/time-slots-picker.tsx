import { Clock } from 'lucide-react';

import { MOTION, TRAVEL_THEME } from '@/components/ui/travel-planner/constants';
import { type TimeSlot } from '@/components/ui/travel-planner/types';
import { cn } from '@/lib/utils';

interface TimeSlotsPickerProps {
  type: 'pickup' | 'return';
  selected: TimeSlot | null;
  availableSlots: TimeSlot[];
  onSelect: (slot: TimeSlot) => void;
  className?: string;
  disabled?: boolean;
}

export const TimeSlotsPicker = ({
  type,
  selected,
  availableSlots,
  onSelect,
  className,
  disabled = false,
}: TimeSlotsPickerProps) => {
  const getIconColor = () => {
    switch (type) {
      case 'pickup':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'return':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'pickup':
        return 'Pickup Time';
      case 'return':
        return 'Return Time';
      default:
        return 'Select Time';
    }
  };

  const handleSlotClick = (slot: TimeSlot) => {
    if (!disabled && !slot.disabled) {
      onSelect(slot);
    }
  };

  const getSlotStyle = (slot: TimeSlot) => {
    if (slot.disabled || disabled) {
      return cn(TRAVEL_THEME.timeSlots.slot, TRAVEL_THEME.timeSlots.slotDisabled);
    }

    if (selected?.value === slot.value) {
      return cn(TRAVEL_THEME.timeSlots.slot, TRAVEL_THEME.timeSlots.slotSelected);
    }

    return cn(
      TRAVEL_THEME.timeSlots.slot,
      TRAVEL_THEME.timeSlots.slotInactive,
      MOTION.transition,
      MOTION.tap
    );
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className='flex items-center gap-2'>
        <Clock className={cn('h-4 w-4', getIconColor())} />
        <h5 className='font-medium text-gray-700 dark:text-gray-300'>{getTitle()}</h5>
        {availableSlots.length > 0 && (
          <span className='ml-auto text-xs text-gray-500'>{availableSlots.length} available</span>
        )}
      </div>

      {/* Time slots grid */}
      {availableSlots.length > 0 ? (
        <div className={TRAVEL_THEME.timeSlots.container}>
          {availableSlots.map(slot => (
            <button
              key={`${type}-${slot.value}`}
              onClick={() => handleSlotClick(slot)}
              disabled={slot.disabled || disabled}
              className={getSlotStyle(slot)}
              aria-label={`${getTitle()}: ${slot.label}`}
              aria-pressed={selected?.value === slot.value}
            >
              {slot.label}
            </button>
          ))}
        </div>
      ) : (
        <div className='flex h-32 items-center justify-center text-sm text-gray-500'>
          {disabled ? 'Please select a date first' : 'No available time slots'}
        </div>
      )}
    </div>
  );
};
