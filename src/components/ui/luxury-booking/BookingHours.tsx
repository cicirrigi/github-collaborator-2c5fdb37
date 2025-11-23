'use client';

import { BOOKING_TOKENS } from './tokens/booking.tokens';

export function BookingHours() {
  return (
    <div>
      <h2 className={BOOKING_TOKENS.sectionTitle}>Time Selection</h2>
      <div className='h-32 bg-white/5 rounded-lg border border-white/10' />
    </div>
  );
}
