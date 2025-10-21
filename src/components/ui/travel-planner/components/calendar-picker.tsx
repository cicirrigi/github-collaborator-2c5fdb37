'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';

import { MOTION } from '@/components/ui/travel-planner/constants';
import { cn } from '@/lib/utils';

interface CalendarPickerProps {
  currentMonth: Date;
  pickupDate?: Date | null;
  returnDate?: Date | null;
  onSelect: (date: Date) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  showReturn?: boolean;
  className?: string;
}

export const CalendarPicker = ({
  currentMonth,
  pickupDate,
  returnDate,
  onSelect,
  onNavigate,
  showReturn: _showReturn = false,
  className,
}: CalendarPickerProps) => {
  // Calendar logic
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

    return { days, month, year, firstDay };
  }, [currentMonth]);

  // Date helpers
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === calendarData.month;
  };

  const isPickupDate = (date: Date) => {
    return pickupDate && date.toDateString() === pickupDate.toDateString();
  };

  const isReturnDate = (date: Date) => {
    return returnDate && date.toDateString() === returnDate.toDateString();
  };

  const isInRange = (date: Date) => {
    if (!pickupDate || !returnDate) return false;
    return date > pickupDate && date < returnDate;
  };

  // Get day styling
  const getDayStyle = (date: Date) => {
    if (isPastDate(date)) return 'cursor-not-allowed opacity-40 text-gray-400';
    if (isPickupDate(date))
      return 'bg-gradient-to-r from-[#CBB26A] to-[#D4AF37] text-white shadow-md';
    if (isReturnDate(date))
      return 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md';
    if (isInRange(date))
      return 'bg-yellow-100/80 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200';
    if (isToday(date))
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/30';
    if (!isCurrentMonth(date)) return 'text-gray-400 dark:text-gray-600';
    return 'hover:bg-yellow-50 dark:hover:bg-yellow-900/20 text-gray-700 dark:text-gray-300';
  };

  const handleDateClick = (date: Date) => {
    if (!isPastDate(date)) {
      onSelect(date);
    }
  };

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Calendar Header */}
      <div className='mb-4 flex items-center justify-between px-2'>
        <button
          onClick={() => onNavigate('prev')}
          className={cn(
            'rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800',
            MOTION.transition,
            MOTION.tap
          )}
          aria-label='Previous month'
        >
          <ChevronLeft className='h-4 w-4' />
        </button>

        <h4 className='text-lg font-semibold'>
          {calendarData.firstDay.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </h4>

        <button
          onClick={() => onNavigate('next')}
          className={cn(
            'rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800',
            MOTION.transition,
            MOTION.tap
          )}
          aria-label='Next month'
        >
          <ChevronRight className='h-4 w-4' />
        </button>
      </div>

      {/* Calendar Grid - Full Width */}
      <div className='grid w-full grid-cols-7 gap-1 text-center'>
        {/* Week headers */}
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className='p-2 text-sm font-medium text-gray-500'>
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarData.days.map((date, index) => (
          <button
            key={index}
            onClick={() => handleDateClick(date)}
            disabled={isPastDate(date)}
            className={cn(
              'flex aspect-square w-full cursor-pointer items-center justify-center rounded-lg text-sm font-medium transition-all',
              getDayStyle(date)
            )}
            aria-label={`${date.toDateString()}${isPickupDate(date) ? ' (Pickup date)' : ''}${isReturnDate(date) ? ' (Return date)' : ''}`}
          >
            {date.getDate()}
          </button>
        ))}
      </div>
    </div>
  );
};
