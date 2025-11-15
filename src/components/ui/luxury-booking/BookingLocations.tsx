'use client';

import { PickupDropoffSection } from '@/features/booking/components/PickupDropoffSection';
import { BOOKING_TOKENS } from './tokens/booking.tokens';

export function BookingLocations() {
  return (
    <div>
      <h2 className={BOOKING_TOKENS.sectionTitle}>Locations</h2>
      <p className='text-white/50 text-sm mb-4'>Set your pickup and dropoff points.</p>

      <PickupDropoffSection />
    </div>
  );
}
