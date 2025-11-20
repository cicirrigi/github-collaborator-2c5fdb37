'use client';

import { BookingWizard } from '@/features/booking/wizard/BookingWizard';

export default function CalendarTestV2Page() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 relative'>
      {/* Background decorative elements */}
      <div className='absolute inset-0 opacity-20'>
        <div className='absolute top-20 left-20 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl'></div>
        <div className='absolute top-60 right-40 w-32 h-32 bg-blue-400/15 rounded-full blur-2xl'></div>
        <div className='absolute bottom-40 left-1/3 w-48 h-48 bg-indigo-400/10 rounded-full blur-3xl'></div>
        <div className='absolute top-1/3 right-20 w-28 h-28 bg-violet-400/25 rounded-full blur-xl'></div>
        <div className='absolute bottom-20 right-1/4 w-44 h-44 bg-fuchsia-400/15 rounded-full blur-3xl'></div>
      </div>

      {/* Header for V2 */}
      <div className='relative z-10 pt-8 pb-4'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
            Calendar Test V2
          </h1>
          <p className='text-purple-200/80 mt-2 text-lg'>
            Enhanced booking wizard with improved styling
          </p>
        </div>
      </div>

      <BookingWizard />
    </div>
  );
}
