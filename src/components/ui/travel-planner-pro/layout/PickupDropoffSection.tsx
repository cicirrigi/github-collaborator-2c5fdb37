'use client';

import type { PickupDropoffField, TripConfiguration } from '@/hooks/useBookingState/types';
import type { BookingRule } from '@/lib/booking/booking-rules';
import { LocationPicker } from '../../location-picker';
import { TRAVEL_PLANNER_PRO_THEME } from '../constants';

interface PickupDropoffSectionProps {
  bookingRule: BookingRule;
  tripConfiguration: TripConfiguration;
  onPickupChange: (location: PickupDropoffField) => void;
  onDropoffChange: (location: PickupDropoffField) => void;
}

export const PickupDropoffSection = ({
  bookingRule,
  tripConfiguration,
  onPickupChange,
  onDropoffChange,
}: PickupDropoffSectionProps) => {
  return (
    <div className={TRAVEL_PLANNER_PRO_THEME.card}>
      <h3 className={TRAVEL_PLANNER_PRO_THEME.sectionTitle}>Pickup & Drop-off</h3>
      <div className='space-y-4'>
        <LocationPicker
          variant='pickup'
          placeholder='Pickup location'
          value={tripConfiguration.pickup}
          onChange={onPickupChange}
        />
        <LocationPicker
          variant='destination'
          placeholder={
            bookingRule.dropoffOptional ? 'Drop-off location (optional)' : 'Drop-off location'
          }
          value={tripConfiguration.dropoff}
          onChange={onDropoffChange}
        />
      </div>
    </div>
  );
};
