'use client';

import type { TripConfiguration } from '@/hooks/useBookingState/types';
import type { BookingRule } from '@/lib/booking/booking-rules';
import { TripLuggage } from '../TripLuggage';
import { TripPassengers } from '../TripPassengers';
import { TRAVEL_PLANNER_PRO_THEME } from '../constants';

interface PassengersLuggageSectionProps {
  bookingRule: BookingRule;
  tripConfiguration: TripConfiguration;
  onPassengersChange: (count: number) => void;
  onLuggageChange: (count: number) => void;
}

export const PassengersLuggageSection = ({
  bookingRule,
  tripConfiguration,
  onPassengersChange,
  onLuggageChange,
}: PassengersLuggageSectionProps) => {
  if (!bookingRule.showPassengers) return null;

  return (
    <div className={TRAVEL_PLANNER_PRO_THEME.card}>
      <div className='grid gap-6 md:grid-cols-2'>
        <TripPassengers value={tripConfiguration.passengers} onChange={onPassengersChange} />
        <TripLuggage value={tripConfiguration.luggage} onChange={onLuggageChange} />
      </div>
    </div>
  );
};
