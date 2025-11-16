'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { Luggage, Users } from 'lucide-react';
import { CardHeader } from './CardHeader';

export function CardPassengersLuggage() {
  const { tripConfiguration, setPassengers, setLuggage } = useBookingState();
  const { passengers, luggage } = tripConfiguration;

  return (
    <div className='space-y-6'>
      <CardHeader icon={Users} title='Passengers' subtitle='How many people are traveling?' />
      <input
        type='number'
        min={1}
        value={passengers}
        onChange={e => setPassengers(Number(e.target.value))}
        className='w-full rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 p-3 text-white placeholder:text-white/30 focus:ring-2 focus:ring-white/30 transition'
      />

      <CardHeader icon={Luggage} title='Luggage' subtitle='How much luggage?' />
      <input
        type='number'
        min={0}
        value={luggage}
        onChange={e => setLuggage(Number(e.target.value))}
        className='w-full rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 p-3 text-white placeholder:text-white/30 focus:ring-2 focus:ring-white/30 transition'
      />
    </div>
  );
}
