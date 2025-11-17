'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { Plane } from 'lucide-react';
import { CardHeader } from './CardHeader';

export function CardFlightNumber() {
  const { tripConfiguration, setFlightNumberPickup } = useBookingState();

  return (
    <div className='vl-card-flex'>
      <CardHeader icon={Plane} title='Flight Number' subtitle='Optional for airport pickups' />
      <div className='vl-card-inner'>
        <input
          type='text'
          placeholder='ex: EZY543 ▸ Heathrow T5'
          value={tripConfiguration.flightNumberPickup}
          onChange={e => setFlightNumberPickup(e.target.value)}
          className='vl-input'
        />
      </div>
    </div>
  );
}
