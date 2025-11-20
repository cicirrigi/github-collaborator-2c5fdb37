'use client';

import { Minus, Plus, type LucideIcon } from 'lucide-react';
import { CardHeader } from './CardHeader';

interface DurationSelectorReusableProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  value: number | null;
  onChange: (value: number) => void;
  min: number;
  max: number;
  unit: string; // 'hour' | 'day'
  defaultValue: number;
}

export function DurationSelectorReusable({
  icon: Icon,
  title,
  subtitle,
  value,
  onChange,
  min,
  max,
  unit,
  defaultValue,
}: DurationSelectorReusableProps) {
  // Default value if null
  const current = value ?? defaultValue;
  const unitSuffix = unit === 'hour' ? 'h' : 'd';
  const unitLabel = unit === 'hour' ? 'Hours of service' : 'Days of service';

  const handleDecrease = () => {
    if (current > min) {
      onChange(current - 1);
    }
  };

  const handleIncrease = () => {
    if (current < max) {
      onChange(current + 1);
    }
  };

  return (
    <div className='vl-card-flex' style={{ height: 'auto' }}>
      <CardHeader icon={Icon} title={title} subtitle={subtitle} />

      <div className='vl-card-inner space-y-2'>
        {/* DURATION ROW - All in one line */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-amber-400/10 rounded-lg'>
              <Icon className='w-5 h-5 text-amber-400' />
            </div>
            <div>
              <h4 className='text-white font-medium text-sm'>Duration</h4>
              <p className='text-white/60 text-xs'>{unitLabel}</p>
            </div>
          </div>

          {/* COUNTER COMPONENT */}
          <div className='flex items-center gap-3'>
            <button
              onClick={handleDecrease}
              disabled={current <= min}
              className='w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/15 transition disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <Minus className='w-4 h-4' />
            </button>

            <span className='text-white font-semibold text-lg min-w-[3ch] text-center'>
              {current}
              {unitSuffix}
            </span>

            <button
              onClick={handleIncrease}
              disabled={current >= max}
              className='w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/15 transition disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <Plus className='w-4 h-4' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
