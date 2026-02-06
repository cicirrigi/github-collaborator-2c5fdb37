'use client';

import { GlassmorphismCard } from '@/components/ui/GlassmorphismCard';
import { useBookingState } from '@/hooks/useBookingState';
import { Plane } from 'lucide-react';

export function FlightInformationSection() {
  const { tripConfiguration, bookingType, setFlightNumberPickup, setFlightNumberReturn } =
    useBookingState();

  return (
    <>
      {/* Flight Numbers - EXACT STYLING FROM COMMIT */}
      {bookingType === 'return' && (
        <GlassmorphismCard className='p-4'>
          <div className='flex items-center gap-2 mb-3'>
            <Plane className='w-4 h-4 text-amber-200/60' />
            <span className='text-white font-medium text-sm'>Flight Numbers</span>
          </div>
          <div className='space-y-3'>
            {/* Departure Flight */}
            <div>
              <label className='text-amber-200/80 text-xs font-medium tracking-wider mb-1 block'>
                DEPARTURE FLIGHT
              </label>
              <input
                type='text'
                value={tripConfiguration.flightNumberPickup}
                onChange={e => setFlightNumberPickup(e.target.value)}
                placeholder='Optional flight number (e.g., BA123)'
                className='w-full bg-transparent border border-amber-200/20 rounded-md px-3 py-2 text-amber-50 text-sm font-light placeholder:text-amber-200/40 focus:border-amber-200/40 focus:outline-none transition-colors'
              />
            </div>
            {/* Return Flight */}
            <div>
              <label className='text-amber-200/80 text-xs font-medium tracking-wider mb-1 block'>
                RETURN FLIGHT
              </label>
              <input
                type='text'
                value={tripConfiguration.flightNumberReturn}
                onChange={e => setFlightNumberReturn(e.target.value)}
                placeholder='Optional flight number (e.g., LH456)'
                className='w-full bg-transparent border border-amber-200/20 rounded-md px-3 py-2 text-amber-50 text-sm font-light placeholder:text-amber-200/40 focus:border-amber-200/40 focus:outline-none transition-colors'
              />
            </div>
          </div>
        </GlassmorphismCard>
      )}

      {/* Flight Number - doar pentru non-return trips */}
      {bookingType !== 'return' && (
        <GlassmorphismCard className='p-4'>
          <div className='flex items-center gap-2 mb-3'>
            <Plane className='w-4 h-4 text-amber-200/60' />
            <span className='text-white font-medium text-sm'>Flight Number</span>
          </div>
          <input
            type='text'
            value={tripConfiguration.flightNumberPickup}
            onChange={e => setFlightNumberPickup(e.target.value)}
            placeholder='Optional flight number'
            className='w-full bg-transparent border border-amber-200/20 rounded-md px-3 py-2 text-amber-50 text-sm font-light placeholder:text-amber-200/40 focus:border-amber-200/40 focus:outline-none transition-colors'
          />
        </GlassmorphismCard>
      )}
    </>
  );
}
