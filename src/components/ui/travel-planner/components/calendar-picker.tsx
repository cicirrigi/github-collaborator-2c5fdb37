'use client';

import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TRAVEL_THEME, MOTION } from '../constants';

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
  showReturn = false,
  className
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
    if (isPastDate(date)) return cn(TRAVEL_THEME.calendar.day, 'cursor-not-allowed opacity-40');
    if (isPickupDate(date)) return cn(TRAVEL_THEME.calendar.day, TRAVEL_THEME.calendar.daySelected);
    if (isReturnDate(date)) return cn(TRAVEL_THEME.calendar.day, 'bg-gradient-to-r from-[#CBB26A] to-[#D4AF37] text-white');
    if (isInRange(date)) return cn(TRAVEL_THEME.calendar.day, TRAVEL_THEME.calendar.dayInRange);
    if (isToday(date)) return cn(TRAVEL_THEME.calendar.day, TRAVEL_THEME.calendar.dayToday);
    if (!isCurrentMonth(date)) return cn(TRAVEL_THEME.calendar.day, TRAVEL_THEME.calendar.dayInactive);
    return cn(TRAVEL_THEME.calendar.day, TRAVEL_THEME.calendar.dayHover, MOTION.transition);
  };

  const handleDateClick = (date: Date) => {
    if (!isPastDate(date)) {
      onSelect(date);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Calendar Header */}
      <div className={TRAVEL_THEME.calendar.header}>
        <button
          onClick={() => onNavigate('prev')}
          className={cn('p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800', MOTION.transition, MOTION.tap)}
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        <h4 className="text-lg font-semibold">
          {calendarData.firstDay.toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
          })}
        </h4>
        
        <button
          onClick={() => onNavigate('next')}
          className={cn('p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800', MOTION.transition, MOTION.tap)}
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className={TRAVEL_THEME.calendar.grid}>
        {/* Week headers */}
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {calendarData.days.map((date, index) => (
          <button
            key={index}
            onClick={() => handleDateClick(date)}
            disabled={isPastDate(date)}
            className={getDayStyle(date)}
            aria-label={`${date.toDateString()}${isPickupDate(date) ? ' (Pickup date)' : ''}${isReturnDate(date) ? ' (Return date)' : ''}`}
          >
            {date.getDate()}
          </button>
        ))}
      </div>
    </div>
  );
};
