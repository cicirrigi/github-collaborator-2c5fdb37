'use client';

import type { StopPoint, TripConfiguration } from '@/hooks/useBookingState/types';
import type { BookingRule } from '@/lib/booking/booking-rules';
import { StopsCounterPro } from '../components';
import { TRAVEL_PLANNER_PRO_THEME } from '../constants';

interface StopsSectionProps {
  bookingRule: BookingRule;
  tripConfiguration: TripConfiguration;
  onStopsCountChange: (value: number) => void;
  onStopsChange: (stops: StopPoint[]) => void;
}

export const StopsSection = ({
  bookingRule,
  tripConfiguration,
  onStopsCountChange,
  onStopsChange,
}: StopsSectionProps) => {
  if (!bookingRule.showStops) return null;

  return (
    <div className={TRAVEL_PLANNER_PRO_THEME.card}>
      <StopsCounterPro
        max={5}
        min={0}
        value={tripConfiguration.additionalStops.length}
        onChange={onStopsCountChange}
        stops={tripConfiguration.additionalStops}
        onStopsChange={onStopsChange}
      />
    </div>
  );
};
