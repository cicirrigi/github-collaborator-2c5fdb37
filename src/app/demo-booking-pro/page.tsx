'use client';

import { useState } from 'react';
import { BookingTabsPro } from '@/components/ui/booking-tabs-pro';
import { demoTokens } from '@/lib/design-tokens/demo.tokens';
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
        <p
          className={`${demoTokens.typography.subtitle.size} ${demoTokens.typography.subtitle.weight} ${demoTokens.typography.subtitle.color} ${demoTokens.typography.subtitle.transform}`}
        >
          {tab}
        </p>
      </div>

      {/* Test colors */}
      <div className='mt-8 flex gap-4'>
        <div
          className='w-20 h-10 rounded'
          style={{ background: demoTokens.gradients.primary }}
        ></div>
        <div className='w-20 h-10 rounded' style={{ background: demoTokens.gradients.gold }}></div>
        <div className='w-20 h-10 rounded' style={{ background: demoTokens.gradients.warm }}></div>
        <div className='w-20 h-10 rounded' style={{ background: demoTokens.gradients.rich }}></div>
      </div>
    </div>
  );
}
