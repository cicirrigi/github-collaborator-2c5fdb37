'use client';

import { useState } from 'react';
import { BookingTabsPro } from './index';
import type { BookingTabType } from './types';

export const BookingTabsProDemo = () => {
  const [tab, setTab] = useState<BookingTabType>('oneway');

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-neutral-950 to-black p-10'>
      <div className='mb-8 text-center'>
        <h1 className='text-4xl font-bold text-white mb-4'>Booking Tabs Pro</h1>
        <p className='text-xl text-neutral-400'>Premium pill navigation with dynamic gradients</p>
      </div>

      <BookingTabsPro activeTab={tab} onTabChange={setTab} size='md' />

      <div className='mt-10 text-center'>
        <h2 className='text-2xl font-semibold text-white mb-2'>Selected:</h2>
        <p className='text-[var(--brand-primary)] text-xl font-medium capitalize'>{tab}</p>
      </div>

      <div className='mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl'>
        <div className='bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl'>
          <div className='text-2xl mb-2'>🎨</div>
          <h3 className='text-white font-semibold mb-2'>Dynamic Gradients</h3>
          <p className='text-neutral-400 text-sm'>
            Each tab has unique gradient that animates with the pill
          </p>
        </div>
        <div className='bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl'>
          <div className='text-2xl mb-2'>⚡</div>
          <h3 className='text-white font-semibold mb-2'>Spring Animations</h3>
          <p className='text-neutral-400 text-sm'>
            Smooth spring physics for natural feeling interactions
          </p>
        </div>
        <div className='bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl'>
          <div className='text-2xl mb-2'>💎</div>
          <h3 className='text-white font-semibold mb-2'>Premium Design</h3>
          <p className='text-neutral-400 text-sm'>
            Glass morphism with backdrop blur and golden accents
          </p>
        </div>
      </div>
    </div>
  );
};
