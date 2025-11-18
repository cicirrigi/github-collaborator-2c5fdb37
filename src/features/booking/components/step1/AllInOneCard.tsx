'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { Luggage, Route, Users } from 'lucide-react';
import { CardHeader } from './CardHeader';

export function AllInOneCard() {
  const { tripConfiguration, setPassengers, setLuggage } = useBookingState();

  return (
    <div className='vl-card-flex'>
      <CardHeader
        icon={Route}
        title='🚀 ALL-IN-ONE TRIP'
        subtitle='Complete trip info in one card'
      />
      <div className='vl-card-inner'>
        {/* Route Section */}
        <div className='mb-4'>
          <div className='grid grid-cols-1 gap-2'>
            {/* FROM */}
            <div className='flex items-center gap-3'>
              <div className='w-3 h-3 bg-green-400 rounded-full'></div>
              <div className='flex-1 bg-white/5 rounded-lg px-3 py-2'>
                <span className='text-green-400 text-xs font-medium block mb-1'>FROM</span>
                <span className='text-white text-sm'>
                  {tripConfiguration.pickup?.address || 'Pickup location'}
                </span>
              </div>
            </div>

            {/* TO */}
            <div className='flex items-center gap-3'>
              <div className='w-3 h-3 bg-red-400 rounded-full'></div>
              <div className='flex-1 bg-white/5 rounded-lg px-3 py-2'>
                <span className='text-red-400 text-xs font-medium block mb-1'>TO</span>
                <span className='text-white text-sm'>
                  {tripConfiguration.dropoff?.address || 'Destination'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Passengers & Luggage Section */}
        <div className='grid grid-cols-2 gap-4'>
          {/* Passengers */}
          <div className='bg-white/5 rounded-lg p-3'>
            <div className='flex items-center gap-2 mb-3'>
              <Users className='w-4 h-4 text-blue-400' />
              <span className='text-blue-400 text-xs font-medium'>PASSENGERS</span>
            </div>
            <div className='flex items-center justify-center gap-2'>
              <button
                onClick={() => setPassengers(Math.max(1, tripConfiguration.passengers - 1))}
                className='w-6 h-6 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-md transition-colors text-white text-sm'
              >
                -
              </button>
              <div className='bg-blue-400/20 rounded-lg px-3 py-1 text-blue-100 font-bold text-lg min-w-[40px] text-center'>
                {tripConfiguration.passengers}
              </div>
              <button
                onClick={() => setPassengers(tripConfiguration.passengers + 1)}
                className='w-6 h-6 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-md transition-colors text-white text-sm'
              >
                +
              </button>
            </div>
          </div>

          {/* Luggage */}
          <div className='bg-white/5 rounded-lg p-3'>
            <div className='flex items-center gap-2 mb-3'>
              <Luggage className='w-4 h-4 text-purple-400' />
              <span className='text-purple-400 text-xs font-medium'>LUGGAGE</span>
            </div>
            <div className='flex items-center justify-center gap-2'>
              <button
                onClick={() => setLuggage(Math.max(0, tripConfiguration.luggage - 1))}
                className='w-6 h-6 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-md transition-colors text-white text-sm'
              >
                -
              </button>
              <div className='bg-purple-400/20 rounded-lg px-3 py-1 text-purple-100 font-bold text-lg min-w-[40px] text-center'>
                {tripConfiguration.luggage}
              </div>
              <button
                onClick={() => setLuggage(tripConfiguration.luggage + 1)}
                className='w-6 h-6 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-md transition-colors text-white text-sm'
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
