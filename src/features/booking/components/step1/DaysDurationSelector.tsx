'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { Calendar } from 'lucide-react';
import { DurationSelectorReusable } from './DurationSelectorReusable';

export function DaysDurationSelector() {
  const { tripConfiguration, setDaysRequested } = useBookingState();

  return (
    <DurationSelectorReusable
      icon={Calendar}
      title='Service Duration'
      subtitle='Days needed for your service'
      value={tripConfiguration.daysRequested}
      onChange={setDaysRequested}
      min={1}
      max={30}
      unit='day'
      defaultValue={1}
    />
  );
}
