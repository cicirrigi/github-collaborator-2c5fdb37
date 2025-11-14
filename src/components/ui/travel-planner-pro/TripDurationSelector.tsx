'use client';

import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';
import { TRAVEL_PLANNER_PRO_THEME } from './constants';

interface TripDurationSelectorProps {
  value: number | null;
  minHours?: number;
  maxHours?: number;
  onChange: (value: number) => void;
}

export const TripDurationSelector = ({
  value,
  minHours = 2,
  maxHours = 12,
  onChange,
}: TripDurationSelectorProps) => {
  const current = value ?? minHours;

  return (
    <div className='space-y-3'>
      <div className='flex items-center gap-2'>
        <Clock className='h-4 w-4 text-[var(--brand-primary)]' />
        <h5 className='font-medium text-neutral-200'>Duration (hourly)</h5>
        <span className='ml-auto text-xs text-neutral-500'>
          {minHours}–{maxHours} hours
        </span>
      </div>

      <div className='grid grid-cols-4 gap-2'>
        {Array.from({ length: maxHours - minHours + 1 }, (_, index) => {
          const hours = minHours + index;
          const isActive = hours === current;
          return (
            <button
              key={hours}
              type='button'
              onClick={() => onChange(hours)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-medium',
                TRAVEL_PLANNER_PRO_THEME.motion.transition,
                isActive
                  ? 'bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)] text-black shadow-md'
                  : 'bg-white/[0.04] text-neutral-300 hover:bg-white/[0.08]'
              )}
            >
              {hours}h
            </button>
          );
        })}
      </div>
    </div>
  );
};
