'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { Plane } from 'lucide-react';
import { CardHeader } from './CardHeader';

export function CardFlightNumber() {
  const { tripConfiguration, setFlightNumberPickup } = useBookingState();

  return (
    <div className='space-y-6'>
      <CardHeader icon={Plane} title='Flight Number' subtitle='Optional for airport pickups' />
      <input
        type='text'
        placeholder='ex: EZY543 ▸ Heathrow T5'
        value={tripConfiguration.flightNumberPickup}
        onChange={e => setFlightNumberPickup(e.target.value)}
        className='w-full rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 p-3 text-white placeholder:text-white/30 focus:ring-2 focus:ring-white/30 transition'
      />
    </div>
  );
}
