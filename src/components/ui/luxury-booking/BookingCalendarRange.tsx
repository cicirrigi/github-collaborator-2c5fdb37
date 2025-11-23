'use client';

import { BOOKING_TOKENS } from './tokens/booking.tokens';

export function BookingCalendarRange() {
  return (
    <div>
      <h2 className={BOOKING_TOKENS.sectionTitle}>Dates (Departure & Return)</h2>
      <div className='h-52 bg-white/5 rounded-lg border border-white/10' />
    </div>
  );
}
