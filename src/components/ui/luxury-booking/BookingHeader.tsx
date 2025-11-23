'use client';

import { ZustandBookingTypeDock } from '@/components/booking/ZustandBookingTypeDock';
import { BOOKING_TOKENS } from './tokens/booking.tokens';

export function BookingHeader() {
  return (
    <div>
      <h2 className={BOOKING_TOKENS.sectionTitle}>Booking Type</h2>
      <p className='text-white/50 text-sm mb-4'>
        Choose One Way, Return Trip, Hourly, Daily, Fleet or Bespoke.
      </p>
      <ZustandBookingTypeDock />
    </div>
  );
}
