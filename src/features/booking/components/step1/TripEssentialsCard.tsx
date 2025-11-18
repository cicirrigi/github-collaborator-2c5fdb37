'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { Luggage, Plane, Users } from 'lucide-react';
import { CardHeader } from './CardHeader';

export function TripEssentialsCard() {
  const { tripConfiguration, setFlightNumberPickup, setPassengers, setLuggage } = useBookingState();

  return (
    <div className='vl-card-flex' style={{ height: 'auto', minHeight: 260 }}>
      <CardHeader icon={Plane} title='Trip Essentials' subtitle='Flight and passenger details' />
      <div className='vl-card-inner space-y-6'>
        {/* Flight Number */}
        <div>
          <div className='flex items-center gap-2 mb-3'>
            <div className='p-1.5 bg-blue-500/10 rounded-lg'>
              <Plane className='w-3 h-3 text-blue-400' />
            </div>
            <span className='text-white font-medium text-sm'>Flight Number</span>
          </div>
          <input
            type='text'
            placeholder='ex: EZY543 ▸ Heathrow T5'
            value={tripConfiguration.flightNumberPickup}
            onChange={e => setFlightNumberPickup(e.target.value)}
            className='vl-input text-sm'
          />
        </div>

        {/* Passengers & Luggage Grid */}
        <div className='grid grid-cols-2 gap-4'>
          {/* Passengers */}
          <div>
            <div className='flex items-center gap-2 mb-3'>
              <div className='p-1.5 bg-yellow-500/10 rounded-lg'>
                <Users className='w-3 h-3 text-yellow-400' />
              </div>
              <span className='text-white font-medium text-sm'>Passengers</span>
            </div>
            <div className='flex items-center gap-2'>
              <button
                onClick={() => setPassengers(Math.max(1, tripConfiguration.passengers - 1))}
                className='w-7 h-7 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white text-sm'
              >
                -
              </button>
              <div className='flex-1 text-center bg-white/5 rounded-lg py-2 text-white font-medium text-sm'>
                {tripConfiguration.passengers}
              </div>
              <button
                onClick={() => setPassengers(tripConfiguration.passengers + 1)}
                className='w-7 h-7 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white text-sm'
              >
                +
              </button>
            </div>
          </div>

          {/* Luggage */}
          <div>
            <div className='flex items-center gap-2 mb-3'>
              <div className='p-1.5 bg-purple-500/10 rounded-lg'>
                <Luggage className='w-3 h-3 text-purple-400' />
              </div>
              <span className='text-white font-medium text-sm'>Luggage</span>
            </div>
            <div className='flex items-center gap-2'>
              <button
                onClick={() => setLuggage(Math.max(0, tripConfiguration.luggage - 1))}
                className='w-7 h-7 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white text-sm'
              >
                -
              </button>
              <div className='flex-1 text-center bg-white/5 rounded-lg py-2 text-white font-medium text-sm'>
                {tripConfiguration.luggage}
              </div>
              <button
                onClick={() => setLuggage(tripConfiguration.luggage + 1)}
                className='w-7 h-7 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white text-sm'
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
