import { MapPin, Minus, Plus } from 'lucide-react';

import { MOTION, TRAVEL_THEME } from '@/components/ui/travel-planner/constants';
import { type StopsCounterProps } from '@/components/ui/travel-planner/types';
import { cn } from '@/lib/utils';

export const StopsCounter = ({
  value,
  max,
  min = 0,
  onChange,
  disabled = false,
  className,
}: StopsCounterProps) => {
  const canDecrease = value > min;
  const canIncrease = value < max;

  const handleDecrease = () => {
    if (canDecrease && !disabled) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (canIncrease && !disabled) {
      onChange(value + 1);
    }
  };

  const getButtonStyle = (active: boolean) => {
    if (disabled || !active) {
      return cn(TRAVEL_THEME.counters.button, 'cursor-not-allowed opacity-50');
    }
    return cn(
      TRAVEL_THEME.counters.button,
      TRAVEL_THEME.counters.buttonInactive,
      MOTION.transition,
      MOTION.tap
    );
  };

  const getDisplayStyle = () => {
    return cn(TRAVEL_THEME.counters.display, disabled && 'opacity-50');
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className='flex items-center gap-2'>
        <MapPin className='h-4 w-4 text-yellow-600 dark:text-yellow-400' />
        <h5 className='font-medium text-gray-700 dark:text-gray-300'>Additional Stops</h5>
        <span className='ml-auto text-xs text-gray-500'>Max {max}</span>
      </div>

      {/* Counter Controls */}
      <div className='flex items-center justify-center gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50'>
        {/* Decrease Button */}
        <button
          onClick={handleDecrease}
          disabled={!canDecrease || disabled}
          className={getButtonStyle(canDecrease)}
          aria-label='Decrease stops count'
        >
          <Minus className='h-4 w-4' />
        </button>

        {/* Current Value Display */}
        <div className='flex flex-col items-center gap-1'>
          <span className={getDisplayStyle()}>{value}</span>
          <span className='text-xs text-gray-500'>
            {value === 0 ? 'No stops' : value === 1 ? '1 stop' : `${value} stops`}
          </span>
        </div>

        {/* Increase Button */}
        <button
          onClick={handleIncrease}
          disabled={!canIncrease || disabled}
          className={getButtonStyle(canIncrease)}
          aria-label='Increase stops count'
        >
          <Plus className='h-4 w-4' />
        </button>
      </div>

      {/* Progress Bar (visual feedback) */}
      {max > 0 && (
        <div className='space-y-1'>
          <div className='flex justify-between text-xs text-gray-500'>
            <span>Usage</span>
            <span>{Math.round((value / max) * 100)}%</span>
          </div>
          <div className='h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700'>
            <div
              className='h-1.5 rounded-full bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)] transition-all duration-300'
              style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Helper Text */}
      {value > 0 && (
        <p className='text-center text-xs text-gray-600 dark:text-gray-400'>
          {value === max ? `Maximum ${max} stops reached` : `Add up to ${max - value} more stops`}
        </p>
      )}
    </div>
  );
};
