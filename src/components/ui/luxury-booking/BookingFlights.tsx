'use client';

import { BOOKING_TOKENS } from './tokens/booking.tokens';

export function BookingFlights() {
  return (
    <div>
      <h2 className={BOOKING_TOKENS.sectionTitle}>Flight Numbers</h2>
      <div className='h-20 bg-white/5 rounded-lg border border-white/10' />
    </div>
  );
}
