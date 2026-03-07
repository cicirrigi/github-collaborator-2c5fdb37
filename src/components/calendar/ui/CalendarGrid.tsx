'use client';

import React, { useMemo } from 'react';
import type { CalendarGridProps } from '../core/calendar-types';
import { generateWeekdays } from '../core/calendar-utils';
import { useCalendarMeasure } from '../core/useCalendarMeasure';
import { CalendarDay } from './CalendarDay';

function CalendarGridBase({
  month,
  onDateSelect,
  orientation = 'portrait',
  className = '',
}: CalendarGridProps) {
  const { ref, width, sizeTier, isReady } = useCalendarMeasure();

  const weekdays = useMemo(() => generateWeekdays(), []);

  // 🔥 FIX FINAL — Loading state fără duplicate key
  if (!isReady || width < 60) {
    return (
      <div ref={ref} className={className} style={{ minHeight: 320 }}>
        {/* păstrăm headerul ca să nu dispară luni/săptămâni */}
        <div className='grid grid-cols-7 opacity-30'>
          {weekdays.map(w => (
            <div key={w.full} className='text-xs py-1 text-center'>
              {w.short}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const cellSize = Math.floor(width / 7);
  const isLandscape = orientation === 'landscape';
  const weeks = month.weeks;

  const gap =
    sizeTier === 'xs'
      ? 'gap-[2px]'
      : sizeTier === 'sm'
        ? 'gap-0.5'
        : sizeTier === 'md'
          ? 'gap-1'
          : 'gap-1.5';

  const weekdayClass =
    sizeTier === 'xs'
      ? 'py-0.5 text-[9px]'
      : sizeTier === 'sm'
        ? 'py-0.5 text-[10px]'
        : sizeTier === 'md'
          ? 'py-1 text-[11px]'
          : 'py-1 text-xs';

  const dayFont =
    sizeTier === 'xs'
      ? 'text-[10px]'
      : sizeTier === 'sm'
        ? 'text-xs'
        : sizeTier === 'md'
          ? 'text-sm'
          : 'text-base';

  return (
    <div ref={ref} className={`flex flex-col ${className}`}>
      {/* WEEKDAY HEADER */}
      <div className={`grid grid-cols-7 text-center select-none ${gap}`}>
        {weekdays.map(w => (
          <div key={w.full} className={`${weekdayClass} font-medium uppercase opacity-70`}>
            {w.short}
          </div>
        ))}
      </div>

      {/* GRID */}
      <div className={`grid grid-cols-7 ${gap}`}>
        {weeks.map((week, wIndex) => (
          <React.Fragment key={wIndex}>
            {week.days.map((day, dIndex) => (
              <div
                key={`${wIndex}-${dIndex}`}
                style={{
                  width: cellSize,
                  height: isLandscape ? cellSize * 0.55 : cellSize,
                }}
              >
                <CalendarDay date={day} onSelect={onDateSelect} className={`${dayFont}`} />
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// 🧠 EXTREME MEMOIZATION
// 🧠 MEMO TEMPORARILY REMOVED - WAS PREVENTING selection UPDATES
export const CalendarGrid = CalendarGridBase;
