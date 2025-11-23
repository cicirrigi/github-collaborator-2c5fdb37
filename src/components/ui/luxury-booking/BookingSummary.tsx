'use client';

import { BOOKING_TOKENS } from './tokens/booking.tokens';

export function BookingSummary() {
  return (
    <div>
      <h2 className={BOOKING_TOKENS.sectionTitle}>Summary</h2>
      <div className='h-24 bg-white/5 rounded-lg border border-white/10' />
    </div>
  );
}
