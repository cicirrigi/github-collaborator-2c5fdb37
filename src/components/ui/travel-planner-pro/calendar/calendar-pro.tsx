'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { TRAVEL_PLANNER_PRO_THEME } from '../constants';

interface CalendarProProps {
  currentMonth: Date;
  pickupDate?: Date | null;
  returnDate?: Date | null;
  onSelect: (date: Date) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  showReturn?: boolean;
  className?: string;
}

export const CalendarPro = ({
  currentMonth,
  pickupDate,
  returnDate,
  onSelect,
  onNavigate,
  showReturn = false,
  className,
}: CalendarProProps) => {
  const calendarData = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return { days, month, year };
  }, [currentMonth]);

  // Date helpers
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isToday = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  };

  const isPast = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d < today;
  };

  const isSameDay = (a?: Date | null, b?: Date | null) =>
    !!a && !!b && a.toDateString() === b.toDateString();

  const isCurrentMonth = (date: Date) => date.getMonth() === calendarData.month;

  const inRange = (date: Date) =>
    pickupDate && returnDate && date > pickupDate && date < returnDate;

  const getDayStyle = (date: Date) => {
    const classes: string[] = [TRAVEL_PLANNER_PRO_THEME.calendar.dayBase];

    if (isPast(date)) {
      classes.push(TRAVEL_PLANNER_PRO_THEME.calendar.dayDisabled);
    } else if (isSameDay(date, pickupDate) || isSameDay(date, returnDate)) {
      classes.push(TRAVEL_PLANNER_PRO_THEME.calendar.daySelected);
    } else if (showReturn && inRange(date)) {
      classes.push(TRAVEL_PLANNER_PRO_THEME.calendar.dayInRange);
    } else if (isToday(date)) {
      classes.push(TRAVEL_PLANNER_PRO_THEME.calendar.dayToday);
    } else if (!isCurrentMonth(date)) {
      classes.push(TRAVEL_PLANNER_PRO_THEME.calendar.dayOtherMonth);
    }

    return cn(...classes);
  };

  const handleDateClick = (date: Date) => {
    if (!isPast(date)) {
      onSelect(date);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Calendar Header */}
      <div className={TRAVEL_PLANNER_PRO_THEME.calendar.header}>
        <button
          onClick={() => onNavigate('prev')}
          className={cn(
            'p-2 rounded-full',
            TRAVEL_PLANNER_PRO_THEME.motion.transition,
            'hover:bg-white/[0.05]'
          )}
          aria-label='Previous month'
        >
          <ChevronLeft className='w-5 h-5 opacity-80 hover:opacity-100' />
        </button>

        <span className='text-base font-medium'>
          {currentMonth.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </span>

        <button
          onClick={() => onNavigate('next')}
          className={cn(
            'p-2 rounded-full',
            TRAVEL_PLANNER_PRO_THEME.motion.transition,
            'hover:bg-white/[0.05]'
          )}
          aria-label='Next month'
        >
          <ChevronRight className='w-5 h-5 opacity-80 hover:opacity-100' />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className={TRAVEL_PLANNER_PRO_THEME.calendar.grid}>
        {/* Week headers */}
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className={TRAVEL_PLANNER_PRO_THEME.calendar.weekHeader}>
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarData.days.map((date, index) => (
          <button
            key={index}
            onClick={() => handleDateClick(date)}
            disabled={isPast(date)}
            className={getDayStyle(date)}
            aria-label={`${date.toDateString()}${
              isSameDay(date, pickupDate) ? ' (Pickup date)' : ''
            }${isSameDay(date, returnDate) ? ' (Return date)' : ''}`}
          >
            {date.getDate()}
          </button>
        ))}
      </div>
    </div>
  );
};
