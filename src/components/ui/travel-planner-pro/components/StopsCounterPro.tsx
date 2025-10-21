'use client';

import { MapPin, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TRAVEL_PLANNER_PRO_THEME } from '../constants';
import { LocationPicker } from '../../location-picker';
import type { GooglePlace } from '../../location-picker/types';

interface StopsCounterProProps {
  value: number;
  max: number;
  min?: number;
  onChange: (v: number) => void;
  stops?: GooglePlace[];
  onStopsChange?: (stops: GooglePlace[]) => void;
  className?: string;
}

export const StopsCounterPro = ({
  value,
  max,
  min = 0,
  onChange,
  stops = [],
  onStopsChange,
  className,
}: StopsCounterProProps) => {
  const canDecrease = value > min;
  const canIncrease = value < max;

  // Update stops array when value changes
  const handleValueChange = (newValue: number) => {
    onChange(newValue);

    if (onStopsChange) {
      const newStops = [...stops];

      // Add new stops if increased
      while (newStops.length < newValue) {
        newStops.push({
          placeId: `stop-${Date.now()}-${newStops.length}`,
          address: '',
          components: { city: '', country: '' },
          type: 'address',
          coordinates: [0, 0],
        });
      }

      // Remove stops if decreased
      while (newStops.length > newValue) {
        newStops.pop();
      }

      onStopsChange(newStops);
    }
  };

  const handleStopChange = (index: number, location: GooglePlace | null) => {
    if (onStopsChange && location) {
      const newStops = [...stops];
      newStops[index] = location;
      onStopsChange(newStops);
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className='flex items-center gap-2'>
        <MapPin className='h-4 w-4 text-[#CBB26A]' />
        <h5 className='font-medium text-neutral-200'>Additional Stops</h5>
        <span className='ml-auto text-xs text-neutral-500'>Max {max}</span>
      </div>

      {/* Counter */}
      <div className='flex items-center justify-center gap-4 rounded-xl bg-white/[0.03] border border-white/[0.08] p-4'>
        <button
          onClick={() => canDecrease && handleValueChange(value - 1)}
          disabled={!canDecrease}
          className={cn(
            'w-8 h-8 flex items-center justify-center rounded-full',
            TRAVEL_PLANNER_PRO_THEME.motion.transition,
            canDecrease
              ? 'bg-white/[0.08] hover:bg-[#CBB26A]/20 text-neutral-200'
              : 'opacity-30 cursor-not-allowed',
            TRAVEL_PLANNER_PRO_THEME.motion.tap
          )}
        >
          <Minus className='h-4 w-4' />
        </button>

        <div className='flex flex-col items-center'>
          <span className='text-lg font-medium text-[#CBB26A]'>{value}</span>
          <span className='text-xs text-neutral-500'>
            {value === 0 ? 'No stops' : `${value} ${value === 1 ? 'stop' : 'stops'}`}
          </span>
        </div>

        <button
          onClick={() => canIncrease && handleValueChange(value + 1)}
          disabled={!canIncrease}
          className={cn(
            'w-8 h-8 flex items-center justify-center rounded-full',
            TRAVEL_PLANNER_PRO_THEME.motion.transition,
            canIncrease
              ? 'bg-white/[0.08] hover:bg-[#CBB26A]/20 text-neutral-200'
              : 'opacity-30 cursor-not-allowed',
            TRAVEL_PLANNER_PRO_THEME.motion.tap
          )}
        >
          <Plus className='h-4 w-4' />
        </button>
      </div>

      {/* Progress Bar */}
      <div className='h-1.5 rounded-full bg-white/[0.05] overflow-hidden'>
        <div
          className={cn(
            'h-1.5 bg-gradient-to-r transition-all duration-300',
            TRAVEL_PLANNER_PRO_THEME.accent.gold
          )}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>

      {/* Stop Address Fields */}
      {value > 0 && (
        <div className='space-y-3 pt-2'>
          <div className='text-xs text-neutral-500 mb-3'>Enter addresses for your stops:</div>
          {Array.from({ length: value }, (_, index) => (
            <div key={index} className='space-y-2'>
              <div className='text-xs text-neutral-400 flex items-center gap-2'>
                <span className='w-5 h-5 bg-[#CBB26A]/20 rounded-full flex items-center justify-center text-[10px] font-medium text-[#CBB26A]'>
                  {index + 1}
                </span>
                Stop {index + 1}
              </div>
              <LocationPicker
                variant='stop'
                placeholder={`Enter stop ${index + 1} address`}
                value={stops[index] || null}
                onChange={location => handleStopChange(index, location)}
                size='sm'
              />
            </div>
          ))}
        </div>
      )}

      {/* Description */}
      <p className='text-xs text-neutral-500 text-center'>
        {value === 0
          ? 'Add multiple stops to your journey for a customized route'
          : `${value} stop${value === 1 ? '' : 's'} added to your route`}
      </p>
    </div>
  );
};
