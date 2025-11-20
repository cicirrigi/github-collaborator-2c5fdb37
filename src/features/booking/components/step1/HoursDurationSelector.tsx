'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { Clock } from 'lucide-react';
import { DurationSelectorReusable } from './DurationSelectorReusable';

export function HoursDurationSelector() {
  const { tripConfiguration, setHoursRequested } = useBookingState();

  return (
    <DurationSelectorReusable
      icon={Clock}
      title='Service Duration'
      subtitle='Hours needed for your service'
      value={tripConfiguration.hoursRequested}
      onChange={setHoursRequested}
      min={2}
      max={12}
      unit='hour'
      defaultValue={2}
    />
  );
}
