'use client';

import type { TripConfiguration } from '@/hooks/useBookingState/types';
import type { BookingRule } from '@/lib/booking/booking-rules';
import { TripFlightNumbers } from '../TripFlightNumbers';
import { TRAVEL_PLANNER_PRO_THEME } from '../constants';

interface FlightNumbersSectionProps {
  bookingRule: BookingRule;
  tripConfiguration: TripConfiguration;
  onFlightNumberPickupChange: (flightNumber: string) => void;
  onFlightNumberReturnChange: (flightNumber: string) => void;
}

export const FlightNumbersSection = ({
  bookingRule,
  tripConfiguration,
  onFlightNumberPickupChange,
  onFlightNumberReturnChange,
}: FlightNumbersSectionProps) => {
  if (!bookingRule.showFlightNumbers) return null;

  return (
    <div className={TRAVEL_PLANNER_PRO_THEME.card}>
      <TripFlightNumbers
        showReturn={bookingRule.showReturn}
        pickupFlightNumber={tripConfiguration.flightNumberPickup || ''}
        returnFlightNumber={tripConfiguration.flightNumberReturn || ''}
        onPickupChange={onFlightNumberPickupChange}
        onReturnChange={onFlightNumberReturnChange}
      />
    </div>
  );
};
