'use client';

import { BookingWizard } from '@/features/booking/wizard/BookingWizard';

export default function BookingTestPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 relative'>
      {/* Background elements în nuanțe de negru/gri */}
      <div className='absolute inset-0 opacity-15'>
        <div className='absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl'></div>
        <div className='absolute top-60 right-40 w-24 h-24 bg-gray-300/8 rounded-full blur-lg'></div>
        <div className='absolute bottom-40 left-1/3 w-40 h-40 bg-neutral-400/6 rounded-full blur-2xl'></div>
        <div className='absolute top-1/3 right-20 w-20 h-20 bg-slate-200/12 rounded-full blur-lg'></div>
        <div className='absolute bottom-20 right-1/4 w-36 h-36 bg-zinc-100/8 rounded-full blur-xl'></div>
        <div className='absolute top-40 left-1/2 w-28 h-28 bg-gray-100/10 rounded-full blur-lg'></div>
      </div>

      <BookingWizard />
    </div>
  );
}
