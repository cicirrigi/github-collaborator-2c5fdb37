'use client';

import { cn } from '@/lib/utils';
import { Plane } from 'lucide-react';
import { TRAVEL_PLANNER_PRO_THEME } from './constants';

interface TripFlightNumbersProps {
  showReturn: boolean;
  pickupFlightNumber: string;
  returnFlightNumber?: string;
  onPickupChange: (value: string) => void;
  onReturnChange?: (value: string) => void;
}

export const TripFlightNumbers = ({
  showReturn,
  pickupFlightNumber,
  returnFlightNumber,
  onPickupChange,
  onReturnChange,
}: TripFlightNumbersProps) => {
  return (
    <div className='space-y-3'>
      <div className='flex items-center gap-2'>
        <Plane className='h-4 w-4 text-[var(--brand-primary)]' />
        <h5 className='font-medium text-neutral-200'>Flight details</h5>
        <span className='ml-auto text-xs text-neutral-500'>Optional</span>
      </div>

      <div className='space-y-3'>
        <div>
          <label className='mb-1 block text-xs text-neutral-400'>Pickup flight number</label>
          <input
            type='text'
            value={pickupFlightNumber}
            onChange={event => onPickupChange(event.target.value)}
            placeholder='e.g. BA 884'
            className={cn(
              'w-full rounded-xl border bg-black/20 px-3 py-2 text-sm text-neutral-100',
              'border-white/10 placeholder:text-neutral-500',
              TRAVEL_PLANNER_PRO_THEME.motion.transition,
              'focus:border-[var(--brand-primary)] focus:outline-none focus:ring-0'
            )}
          />
        </div>

        {showReturn && onReturnChange && (
          <div>
            <label className='mb-1 block text-xs text-neutral-400'>Return flight number</label>
            <input
              type='text'
              value={returnFlightNumber ?? ''}
              onChange={event => onReturnChange(event.target.value)}
              placeholder='e.g. BA 885'
              className={cn(
                'w-full rounded-xl border bg-black/20 px-3 py-2 text-sm text-neutral-100',
                'border-white/10 placeholder:text-neutral-500',
                TRAVEL_PLANNER_PRO_THEME.motion.transition,
                'focus:border-[var(--brand-primary)] focus:outline-none focus:ring-0'
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
};
