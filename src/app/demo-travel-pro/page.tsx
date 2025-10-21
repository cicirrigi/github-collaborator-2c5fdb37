'use client';

import { BookingTabsPro } from '@/components/ui/booking-tabs-pro';
import type { BookingTabType } from '@/components/ui/booking-tabs-pro/types';
import { TravelPlannerPro } from '@/components/ui/travel-planner-pro';
import { useState } from 'react';

export default function DemoTravelProPage() {
  const [bookingType, setBookingType] = useState<BookingTabType>('oneway');

  return (
    <div className='min-h-screen bg-gradient-to-b from-neutral-950 to-black p-8'>
      <div className='container mx-auto max-w-7xl'>
        {/* Header */}
        <div className='mb-8 text-center'>
          <h1 className='text-4xl font-bold text-white mb-4'>✨ Travel Planner Pro</h1>
          <p className='text-xl text-neutral-400'>Complete travel booking system with premium UI</p>
        </div>

        {/* Booking Type Selection */}
        <div className='mb-8'>
          <BookingTabsPro activeTab={bookingType} onTabChange={setBookingType} size='md' />
        </div>

        {/* Travel Planner */}
        <TravelPlannerPro
          onPlanChange={plan => {
            console.log('Plan changed:', plan, 'for booking type:', bookingType);
          }}
        />

        {/* Status Display */}
        <div className='mt-8 text-center'>
          <div className='inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2'>
            <div className='w-2 h-2 bg-[#CBB26A] rounded-full'></div>
            <span className='text-neutral-300 text-sm'>
              Current booking type:{' '}
              <span className='text-[#CBB26A] font-medium capitalize'>{bookingType}</span>
            </span>
          </div>
        </div>

        {/* Features List */}
        <div className='mt-12 text-center'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto'>
            <div className='bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl'>
              <div className='text-2xl mb-2'>📅</div>
              <h3 className='text-white font-semibold mb-2'>Premium Calendar</h3>
              <p className='text-neutral-400 text-sm'>Glass morphism calendar with gold accents</p>
            </div>
            <div className='bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl'>
              <div className='text-2xl mb-2'>⏰</div>
              <h3 className='text-white font-semibold mb-2'>Smart Time Slots</h3>
              <p className='text-neutral-400 text-sm'>Organized time selection by categories</p>
            </div>
            <div className='bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl'>
              <div className='text-2xl mb-2'>🛑</div>
              <h3 className='text-white font-semibold mb-2'>Additional Stops</h3>
              <p className='text-neutral-400 text-sm'>Counter with progress bar and limits</p>
            </div>
            <div className='bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl'>
              <div className='text-2xl mb-2'>🗺️</div>
              <h3 className='text-white font-semibold mb-2'>Route Preview</h3>
              <p className='text-neutral-400 text-sm'>Visual route planning and summary</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
