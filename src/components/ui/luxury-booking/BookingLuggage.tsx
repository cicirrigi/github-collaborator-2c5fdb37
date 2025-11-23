'use client';

import { BOOKING_TOKENS } from './tokens/booking.tokens';

export function BookingLuggage() {
  return (
    <div>
      <h2 className={BOOKING_TOKENS.sectionTitle}>Luggage</h2>
      <div className='h-16 bg-white/5 rounded-lg border border-white/10' />
    </div>
  );
}
