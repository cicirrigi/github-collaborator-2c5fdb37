'use client';

import { WeatherWidgetCompact } from '@/components/ui/WeatherWidgetCompact';
import { LucideIcon } from 'lucide-react';

export function CardHeader({
  icon: Icon,
  title,
  subtitle,
  showWeather = false,
}: {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  showWeather?: boolean;
}) {
  return (
    <div className='flex items-center justify-between mb-4'>
      <div className='flex items-center gap-3'>
        <div className='w-8 h-8 rounded-xl bg-white/5 border border-amber-200/20 flex items-center justify-center'>
          <Icon className='w-4 h-4 text-amber-200/60' />
        </div>

        <div>
          <div className='text-white text-sm font-medium tracking-wide'>{title}</div>
          {subtitle && (
            <div className='mt-1'>
              <span className='inline-flex items-center px-2.5 py-1 rounded-md bg-amber-400/20 border border-amber-400/30 text-amber-200 text-xs font-semibold tracking-wider uppercase'>
                {subtitle}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Weather Widget pe aceeași linie cu titlul */}
      {showWeather && (
        <div className='flex-shrink-0'>
          <WeatherWidgetCompact />
        </div>
      )}
    </div>
  );
}
