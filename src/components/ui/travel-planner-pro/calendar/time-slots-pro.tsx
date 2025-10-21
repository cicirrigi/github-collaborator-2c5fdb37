'use client';

import { cn } from '@/lib/utils';
import { TIME_SLOTS } from '@/components/ui/travel-planner/constants';
import { TRAVEL_PLANNER_PRO_THEME } from '../constants';

interface TimeSlotsProProps {
  selected?: string;
  onSelect: (value: string) => void;
  disabled?: string[];
  className?: string;
}

export const TimeSlotsPro = ({
  selected,
  onSelect,
  disabled = [],
  className,
}: TimeSlotsProProps) => {
  const getSlotStyle = (slotValue: string) => {
    const isSelected = selected === slotValue;
    const isDisabled = disabled.includes(slotValue);

    return cn(TRAVEL_PLANNER_PRO_THEME.calendar.slot, TRAVEL_PLANNER_PRO_THEME.motion.transition, {
      [TRAVEL_PLANNER_PRO_THEME.calendar.slotSelected]: isSelected,
      'opacity-50 cursor-not-allowed': isDisabled,
    });
  };

  const handleSlotClick = (slotValue: string) => {
    if (!disabled.includes(slotValue)) {
      onSelect(slotValue);
    }
  };

  return (
    <div className={cn(TRAVEL_PLANNER_PRO_THEME.calendar.sidebar, className)}>
      {/* Header */}
      <div className='mb-3 pb-2 border-b border-white/10'>
        <h4 className='text-sm font-medium text-neutral-300'>Select Time</h4>
      </div>

      {/* Time slots grouped by category */}
      {['morning', 'afternoon', 'evening'].map(category => {
        const categorySlots = TIME_SLOTS.filter(slot => slot.category === category);

        if (categorySlots.length === 0) return null;

        return (
          <div key={category} className='mb-4'>
            <div className='text-xs uppercase tracking-wide text-neutral-500 mb-2 px-2'>
              {category}
            </div>
            <div className='grid grid-cols-2 md:grid-cols-1 gap-1'>
              {categorySlots.map(slot => (
                <button
                  key={slot.value}
                  onClick={() => handleSlotClick(slot.value)}
                  disabled={disabled.includes(slot.value)}
                  className={getSlotStyle(slot.value)}
                  aria-label={`Select ${slot.label}`}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
