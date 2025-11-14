'use client';

import type { TripConfiguration } from '@/hooks/useBookingState/types';
import type { BookingRule } from '@/lib/booking/booking-rules';
import { TripDurationSelector } from '../TripDurationSelector';
import { TRAVEL_PLANNER_PRO_THEME } from '../constants';

interface DurationSectionProps {
  bookingRule: BookingRule;
  tripConfiguration: TripConfiguration;
  onHoursRequestedChange: (hours: number) => void;
}

export const DurationSection = ({
  bookingRule,
  tripConfiguration,
  onHoursRequestedChange,
}: DurationSectionProps) => {
  if (!bookingRule.showDuration) return null;

  return (
    <div className={TRAVEL_PLANNER_PRO_THEME.card}>
      <TripDurationSelector
        value={tripConfiguration.hoursRequested}
        onChange={onHoursRequestedChange}
      />
    </div>
  );
};
