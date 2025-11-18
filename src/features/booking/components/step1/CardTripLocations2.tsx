'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { MapPin, Route } from 'lucide-react';
import { CardHeader } from './CardHeader';

export function CardTripLocations2() {
  const { tripConfiguration } = useBookingState();

  return (
    <div className='vl-card-flex' style={{ height: 'auto' }}>
      <CardHeader icon={Route} title=' NEW TRIP DESIGN' subtitle='Compact locations layout' />
      <div className='vl-card-inner'>
        {/* Vertical From-To Layout */}
        <div className='space-y-3 mb-4'>
          <div>
            <div className='flex items-center gap-2 mb-2'>
              <MapPin className='w-4 h-4 text-green-400' />
              <span className='text-green-400 text-xs font-medium'>FROM</span>
            </div>
            <div className='bg-white/5 rounded-lg p-2 text-white text-sm'>
              {tripConfiguration.pickup?.address || 'Pick pickup location'}
            </div>
          </div>

          <div>
            <div className='flex items-center gap-2 mb-2'>
              <MapPin className='w-4 h-4 text-red-400' />
              <span className='text-red-400 text-xs font-medium'>TO</span>
            </div>
            <div className='bg-white/5 rounded-lg p-2 text-white text-sm'>
              {tripConfiguration.dropoff?.address || 'Pick destination'}
            </div>
          </div>
        </div>

        {/* Journey Info Compact */}
        <div className='flex items-center justify-between bg-white/5 rounded-lg p-2'>
          <span className='text-white/70 text-xs'>Journey</span>
          <span className='text-white text-xs font-medium'>25 km • 30 min</span>
        </div>
      </div>
    </div>
  );
}
