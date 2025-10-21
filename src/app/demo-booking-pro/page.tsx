'use client';

import { useState } from 'react';
import { BookingTabsPro } from '@/components/ui/booking-tabs-pro';
import type { BookingTabType } from '@/components/ui/booking-tabs-pro/types';

export default function DemoBookingProPage() {
  const [tab, setTab] = useState<BookingTabType>('oneway');

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-neutral-950 to-black p-10'>
      <div className='mb-8 text-center'>
        <h1 className='text-4xl font-bold text-white mb-4'>🎨 Booking Tabs Pro</h1>
        <p className='text-xl text-neutral-400'>Premium tabs cu gradiente aurii dinamice</p>
      </div>

      <BookingTabsPro activeTab={tab} onTabChange={setTab} size='md' />

      <div className='mt-10 text-center'>
        <h2 className='text-2xl font-semibold text-white mb-2'>Selected:</h2>
        <p className='text-[#CBB26A] text-xl font-medium capitalize'>{tab}</p>
      </div>

      {/* Test colors */}
      <div className='mt-8 flex gap-4'>
        <div
          className='w-20 h-10 rounded'
          style={{ background: 'linear-gradient(to right, #CBB26A, #D4AF37)' }}
        ></div>
        <div
          className='w-20 h-10 rounded'
          style={{ background: 'linear-gradient(to right, #FFD479, #E2B64C)' }}
        ></div>
        <div
          className='w-20 h-10 rounded'
          style={{ background: 'linear-gradient(to right, #EAB308, #CBB26A)' }}
        ></div>
        <div
          className='w-20 h-10 rounded'
          style={{ background: 'linear-gradient(to right, #D4AF37, #A07F3E)' }}
        ></div>
      </div>
    </div>
  );
}
