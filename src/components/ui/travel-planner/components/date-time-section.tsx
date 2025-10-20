'use client';

import React, { useState, useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DateTimeSectionProps, TimeSlot } from '../types';
import { TRAVEL_THEME, SECTION_ACCENTS, TIME_SLOTS, MOTION } from '../constants';
import { CalendarPicker } from './calendar-picker';
import { TimeSlotsPicker } from './time-slots-picker';

export const DateTimeSection = ({
  bookingType,
  pickupDate,
  returnDate,
  pickupTime,
  returnTime,
  onDateChange,
  onTimeChange,
  showReturn,
  isLoading = false,
  className
}: DateTimeSectionProps) => {
  const [currentMonth, setCurrentMonth] = useState(pickupDate || new Date());
  const [rangeMode, setRangeMode] = useState<'pickup' | 'return'>('pickup');

  // Navigation handler
  const handleMonthNavigate = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newMonth;
    });
  };

  // Date selection with smart range logic
  const handleDateSelect = (date: Date) => {
    if (rangeMode === 'pickup') {
      onDateChange(date, returnDate);
      if (showReturn) {
        setRangeMode('return'); // Auto-switch to return selection
      }
    } else {
      onDateChange(pickupDate!, date);
      setRangeMode('pickup'); // Reset for next interaction
    }
  };

  // Time selection handlers
  const handlePickupTimeSelect = (slot: TimeSlot) => {
    onTimeChange(slot, returnTime);
  };

  const handleReturnTimeSelect = (slot: TimeSlot) => {
    onTimeChange(pickupTime!, slot);
  };

  // Filter available return times (smart logic)
  const availableReturnTimes = useMemo(() => {
    if (!showReturn || !pickupTime || !pickupDate || !returnDate) return TIME_SLOTS;
    
    // Same day: only times after pickup
    if (pickupDate.toDateString() === returnDate.toDateString()) {
      return TIME_SLOTS.filter(slot => slot.value > pickupTime.value);
    }
    
    // Different day: all times available
    return TIME_SLOTS;
  }, [showReturn, pickupTime, pickupDate, returnDate]);

  if (isLoading) {
    return <DateTimeSectionSkeleton showReturn={showReturn} className={className} />;
  }

  return (
    <div className={cn(
      TRAVEL_THEME.sections.dateTime,
      SECTION_ACCENTS[bookingType],
      MOTION.transition,
      className
    )}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Select Date & Time
        </h3>
        {showReturn && (
          <div className="ml-auto text-sm text-gray-600 dark:text-gray-400">
            Mode: {rangeMode === 'pickup' ? 'Pickup' : 'Return'}
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Calendar Section */}
        <CalendarPicker
          currentMonth={currentMonth}
          pickupDate={pickupDate}
          returnDate={returnDate || null}
          onSelect={handleDateSelect}
          onNavigate={handleMonthNavigate}
          showReturn={showReturn}
        />

        {/* Time Selection Section */}
        <div className="space-y-6">
          {/* Pickup Time */}
          <TimeSlotsPicker
            type="pickup"
            selected={pickupTime}
            availableSlots={TIME_SLOTS}
            onSelect={handlePickupTimeSelect}
          />

          {/* Return Time (conditional) */}
          {showReturn && (
            <div className={cn(MOTION.fadeIn)}>
              <TimeSlotsPicker
                type="return"
                selected={returnTime || null}
                availableSlots={availableReturnTimes}
                onSelect={handleReturnTimeSelect}
                disabled={!pickupDate || !returnDate}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Skeleton loader component
const DateTimeSectionSkeleton = ({ 
  showReturn = false, 
  className 
}: { 
  showReturn?: boolean; 
  className?: string; 
}) => (
  <div className={cn(TRAVEL_THEME.sections.dateTime, className)}>
    <div className="grid lg:grid-cols-2 gap-6">
      <div className={cn(TRAVEL_THEME.skeleton.base, TRAVEL_THEME.skeleton.calendar)} />
      <div className="space-y-4">
        <div className={cn(TRAVEL_THEME.skeleton.base, 'h-32')} />
        {showReturn && <div className={cn(TRAVEL_THEME.skeleton.base, 'h-32')} />}
      </div>
    </div>
  </div>
);
