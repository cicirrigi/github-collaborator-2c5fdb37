'use client';

import { cn } from '@/lib/utils';
import { Briefcase, Minus, Plus } from 'lucide-react';
import { TRAVEL_PLANNER_PRO_THEME } from './constants';

interface TripLuggageProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

export const TripLuggage = ({ value, min = 0, max = 10, onChange }: TripLuggageProps) => {
  const canDecrease = value > min;
  const canIncrease = value < max;

  const handleChange = (next: number) => {
    if (next < min || next > max) return;
    onChange(next);
  };

  return (
    <div className='space-y-3'>
      <div className='flex items-center gap-2'>
        <Briefcase className='h-4 w-4 text-[var(--brand-primary)]' />
        <h5 className='font-medium text-neutral-200'>Luggage</h5>
        <span className='ml-auto text-xs text-neutral-500'>
          {min}–{max} pieces
        </span>
      </div>

      <div className='flex items-center justify-center gap-4 rounded-xl bg-white/[0.03] border border-white/[0.08] p-4'>
        <button
          type='button'
          onClick={() => canDecrease && handleChange(value - 1)}
          disabled={!canDecrease}
          className={cn(
            'w-8 h-8 flex items-center justify-center rounded-full',
            TRAVEL_PLANNER_PRO_THEME.motion.transition,
            canDecrease
              ? 'bg-white/[0.08] hover:bg-[rgba(var(--brand-primary-rgb),0.16)] text-neutral-200'
              : 'opacity-30 cursor-not-allowed',
            TRAVEL_PLANNER_PRO_THEME.motion.tap
          )}
        >
          <Minus className='h-4 w-4' />
        </button>

        <div className='flex flex-col items-center'>
          <span className='text-lg font-medium text-[var(--brand-primary)]'>{value}</span>
          <span className='text-xs text-neutral-500'>{value === 1 ? 'Piece' : 'Pieces'}</span>
        </div>

        <button
          type='button'
          onClick={() => canIncrease && handleChange(value + 1)}
          disabled={!canIncrease}
          className={cn(
            'w-8 h-8 flex items-center justify-center rounded-full',
            TRAVEL_PLANNER_PRO_THEME.motion.transition,
            canIncrease
              ? 'bg-white/[0.08] hover:bg-[rgba(var(--brand-primary-rgb),0.16)] text-neutral-200'
              : 'opacity-30 cursor-not-allowed',
            TRAVEL_PLANNER_PRO_THEME.motion.tap
          )}
        >
          <Plus className='h-4 w-4' />
        </button>
      </div>
    </div>
  );
};
