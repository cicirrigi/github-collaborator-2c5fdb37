'use client';

import { TIME_SLOTS } from '@/components/ui/travel-planner/constants';
import { cn } from '@/lib/utils';
import { TRAVEL_PLANNER_PRO_THEME } from '../constants';

interface TimeSlotsProProps {
  selected?: string;
  onSelect: (value: string) => void;

  // RETURN SUPPORT
  showReturn?: boolean;
  returnSelected?: string;
  onReturnSelect?: (value: string) => void;

  disabled?: string[];
  className?: string;
}

export const TimeSlotsPro = ({
  selected,
  onSelect,
  showReturn: _showReturn = false,
  returnSelected: _returnSelected,
  onReturnSelect: _onReturnSelect,
  disabled = [],
  className,
}: TimeSlotsProProps) => {
  const renderSlotButton = (slotValue: string, label: string, isReturn: boolean) => {
    const isSelected = isReturn ? _returnSelected === slotValue : selected === slotValue;
    const isDisabled = disabled.includes(slotValue);

    return (
      <button
        key={slotValue}
        disabled={isDisabled}
        onClick={() => {
          if (isDisabled) return;
          if (isReturn) {
            _onReturnSelect?.(slotValue);
          } else {
            onSelect(slotValue);
          }
        }}
        className={cn(
          TRAVEL_PLANNER_PRO_THEME.calendar.slot,
          TRAVEL_PLANNER_PRO_THEME.motion.transition,
          {
            [TRAVEL_PLANNER_PRO_THEME.calendar.slotSelected]: isSelected,
            'opacity-50 cursor-not-allowed': isDisabled,
          }
        )}
      >
        {label}
      </button>
    );
  };

  const renderColumn = (isReturn: boolean) => (
    <div className={cn(TRAVEL_PLANNER_PRO_THEME.calendar.sidebar, className)}>
      {/* HEADER */}
      <div className='mb-3 pb-2 border-b border-white/10'>
        <h4 className='text-sm font-medium text-neutral-300'>
          {isReturn ? 'Return Time' : 'Pickup Time'}
        </h4>
      </div>

      {['morning', 'afternoon', 'evening'].map(category => {
        const categorySlots = TIME_SLOTS.filter(s => s.category === category);

        return (
          <div key={category} className='mb-4'>
            <div className='text-xs uppercase tracking-wide text-neutral-500 mb-2 px-2'>
              {category}
            </div>

            <div className='grid grid-cols-2 md:grid-cols-1 gap-1'>
              {categorySlots.map(slot => renderSlotButton(slot.value, slot.label, isReturn))}
            </div>
          </div>
        );
      })}
    </div>
  );

  // Pentru return trips, folosim două componente separate în DateTimeSection
  // Aici afișăm doar o singură coloană
  return renderColumn(false);
};
