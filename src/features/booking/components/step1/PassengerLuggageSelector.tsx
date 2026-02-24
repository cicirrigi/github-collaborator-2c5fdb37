'use client';

import { GlassmorphismCard } from '@/components/ui/GlassmorphismCard';
import { useBookingState } from '@/hooks/useBookingState';
import { Luggage, Users } from 'lucide-react';

export function PassengerLuggageSelector() {
  const { tripConfiguration, setPassengers, setLuggage } = useBookingState();

  return (
    <div className='grid grid-cols-2 gap-4 md:gap-8'>
      <GlassmorphismCard className='p-4'>
        <div className='flex items-center justify-center mb-4'>
          <div className='flex items-center gap-2'>
            <Users className='w-5 h-5 text-amber-200/60' />
            <span className='text-white text-base font-light tracking-wider'>Passengers</span>
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
      </GlassmorphismCard>

      <GlassmorphismCard className='p-4'>
        <div className='flex items-center justify-center mb-4'>
          <div className='flex items-center gap-2'>
            <Luggage className='w-5 h-5 text-amber-200/60' />
            <span className='text-white text-base font-light tracking-wider'>Luggage</span>
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
      </GlassmorphismCard>
    </div>
  );
}
