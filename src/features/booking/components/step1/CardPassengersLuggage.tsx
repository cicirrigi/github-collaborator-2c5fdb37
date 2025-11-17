'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { Luggage, Minus, Plus, Users } from 'lucide-react';
import { CardHeader } from './CardHeader';

export function CardPassengersLuggage() {
  const { tripConfiguration, setPassengers, setLuggage } = useBookingState();
  const { passengers, luggage } = tripConfiguration;

  return (
    <div className='vl-card-flex'>
      <CardHeader
        icon={Users}
        title='Passengers & Luggage'
        subtitle='Select number of travelers and bags'
      />

      <div className='vl-card-inner space-y-6'>
        {/* PASSENGERS ROW */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-[var(--brand-primary,#f5d469)]/10 rounded-lg'>
              <Users className='w-5 h-5 text-[var(--brand-primary,#f5d469)]' />
            </div>
            <div>
              <h4 className='text-white font-medium text-sm'>Passengers</h4>
              <p className='text-white/60 text-xs'>Traveling people</p>
            </div>
          </div>

          {/* COUNTER COMPONENT */}
          <div className='flex items-center gap-3'>
            <button
              onClick={() => setPassengers(Math.max(1, passengers - 1))}
              disabled={passengers <= 1}
              className='w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/15 transition disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <Minus className='w-4 h-4' />
            </button>

            <span className='text-white font-semibold text-lg min-w-[2ch] text-center'>
              {passengers}
            </span>

            <button
              onClick={() => setPassengers(passengers + 1)}
              className='w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/15 transition'
            >
              <Plus className='w-4 h-4' />
            </button>
          </div>
        </div>

        {/* DIVIDER */}
        <div className='border-t border-white/10'></div>

        {/* LUGGAGE ROW */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-blue-500/10 rounded-lg'>
              <Luggage className='w-5 h-5 text-blue-400' />
            </div>
            <div>
              <h4 className='text-white font-medium text-sm'>Luggage</h4>
              <p className='text-white/60 text-xs'>Number of bags</p>
            </div>
          </div>

          {/* COUNTER COMPONENT */}
          <div className='flex items-center gap-3'>
            <button
              onClick={() => setLuggage(Math.max(0, luggage - 1))}
              disabled={luggage <= 0}
              className='w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/15 transition disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <Minus className='w-4 h-4' />
            </button>

            <span className='text-white font-semibold text-lg min-w-[2ch] text-center'>
              {luggage}
            </span>

            <button
              onClick={() => setLuggage(luggage + 1)}
              className='w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/15 transition'
            >
              <Plus className='w-4 h-4' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
