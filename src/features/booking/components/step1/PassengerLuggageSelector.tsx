'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { Luggage, Users } from 'lucide-react';

export function PassengerLuggageSelector() {
  const { tripConfiguration, setPassengers, setLuggage } = useBookingState();

  return (
    <div className='grid grid-cols-2 gap-8'>
      <div className='bg-white/3 rounded-lg p-4 border border-amber-200/10'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-2'>
            <Users className='w-4 h-4 text-amber-200/60' />
            <span className='text-amber-100/80 text-sm font-light tracking-wider'>Passengers</span>
          </div>
        </div>
        <div className='flex items-center justify-between'>
          <button
            onClick={() => setPassengers(Math.max(1, tripConfiguration.passengers - 1))}
            className='w-7 h-7 rounded-full border border-amber-200/20 text-amber-200/70 hover:border-amber-200/40 hover:text-amber-200 transition-all duration-200 text-sm font-light'
          >
            −
          </button>
          <div className='text-amber-50 font-light text-lg tabular-nums'>
            {tripConfiguration.passengers}
          </div>
          <button
            onClick={() => setPassengers(tripConfiguration.passengers + 1)}
            className='w-7 h-7 rounded-full border border-amber-200/20 text-amber-200/70 hover:border-amber-200/40 hover:text-amber-200 transition-all duration-200 text-sm font-light'
          >
            +
          </button>
        </div>
      </div>

      <div className='bg-white/3 rounded-lg p-4 border border-amber-200/10'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-2'>
            <Luggage className='w-4 h-4 text-amber-200/60' />
            <span className='text-amber-100/80 text-sm font-light tracking-wider'>Luggage</span>
          </div>
        </div>
        <div className='flex items-center justify-between'>
          <button
            onClick={() => setLuggage(Math.max(0, tripConfiguration.luggage - 1))}
            className='w-7 h-7 rounded-full border border-amber-200/20 text-amber-200/70 hover:border-amber-200/40 hover:text-amber-200 transition-all duration-200 text-sm font-light'
          >
            −
          </button>
          <div className='text-amber-50 font-light text-lg tabular-nums'>
            {tripConfiguration.luggage}
          </div>
          <button
            onClick={() => setLuggage(tripConfiguration.luggage + 1)}
            className='w-7 h-7 rounded-full border border-amber-200/20 text-amber-200/70 hover:border-amber-200/40 hover:text-amber-200 transition-all duration-200 text-sm font-light'
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
