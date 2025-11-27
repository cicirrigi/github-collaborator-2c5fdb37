'use client';

import React from 'react';
import type { CalendarGridProps } from '../core/calendar-types';
import { generateWeekdays } from '../core/calendar-utils';
import { useCalendarMeasure } from '../core/useCalendarMeasure';
import { CalendarDay } from './CalendarDay';

export function CalendarGrid({
  month,
  onDateSelect,
  selection: _selection,
  mode: _mode,
  orientation = 'portrait', // ⭐ new
  className = '',
}: CalendarGridProps) {
  const { ref, width, sizeTier } = useCalendarMeasure();

  // 📐 Cell size fluid
  const cellSize = Math.floor(width / 7);
  const isLandscape = orientation === 'landscape';

  // 📏 Gap scaling
  const gap =
    sizeTier === 'xs'
      ? 'gap-[2px]'
      : sizeTier === 'sm'
        ? 'gap-0.5'
        : sizeTier === 'md'
          ? 'gap-1'
          : 'gap-1.5';

  // 📏 Weekday styles
  const weekdayClass =
    sizeTier === 'xs'
      ? 'py-0.5 text-[9px]'
      : sizeTier === 'sm'
        ? 'py-0.5 text-[10px]'
        : sizeTier === 'md'
          ? 'py-1 text-[11px]'
          : 'py-1 text-xs';

  // 📏 Day font scaling
  const dayFont =
    sizeTier === 'xs'
      ? 'text-[10px]'
      : sizeTier === 'sm'
        ? 'text-xs'
        : sizeTier === 'md'
          ? 'text-sm'
          : 'text-base';

  const weekdays = generateWeekdays('Europe/London');

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

      {/* GRID 6x7 */}
      <div className={`grid grid-cols-7 ${gap}`}>
        {month.weeks.map((week, wIndex) => (
          <React.Fragment key={wIndex}>
            {week.days.map((day, dIndex) => (
              <div
                key={`${wIndex}-${dIndex}`}
                style={{
                  width: cellSize,
                  height: isLandscape ? cellSize * 0.55 : cellSize, // ⭐ core landscape logic
                }}
              >
                <CalendarDay
                  date={day}
                  onSelect={onDateSelect}
                  className={`${dayFont} w-full h-full`}
                />
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
