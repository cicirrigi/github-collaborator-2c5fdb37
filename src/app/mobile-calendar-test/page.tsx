'use client';

import { DatePicker } from '@/components/calendar/DatePicker';
import { MobileCalendarModal } from '@/components/calendar/variants/modals/MobileCalendarModal';
import { useState } from 'react';

export default function MobileCalendarTestPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDirectModalOpen, setIsDirectModalOpen] = useState(false);

  return (
    <div className='min-h-screen bg-[#0c0c0c] text-white'>
      {/* Mobile-optimized container */}
      <div className='px-4 py-6 space-y-8'>
        {/* Header */}
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-amber-300 mb-2'>📱 Mobile Calendar Test</h1>
          <p className='text-amber-200/70 text-sm'>iOS-style fullscreen calendar modal</p>
        </div>

        {/* Current Selection Display */}
        <div className='bg-white/5 rounded-xl p-4 border border-amber-200/20'>
          <h2 className='text-lg font-semibold text-amber-300 mb-2'>Selected Date</h2>
          <p className='text-white'>
            {selectedDate ? selectedDate.toDateString() : 'None selected'}
          </p>
        </div>

        {/* Test 1: DatePicker Component (Auto-detects mobile) */}
        <div className='space-y-4'>
          <h2 className='text-lg font-semibold text-amber-300'>Test 1: DatePicker Component</h2>
          <div className='bg-white/5 rounded-xl p-4 border border-white/10'>
            <DatePicker
              value={selectedDate}
              onChange={date => setSelectedDate(date as Date)}
              timezone='Europe/London'
              placeholder='Tap to select date'
              className='w-full p-3 bg-white/10 rounded-lg border border-white/20 text-white'
            />
          </div>
          <p className='text-xs text-amber-200/60'>
            This uses device detection to show mobile modal automatically
          </p>
        </div>

        {/* Test 2: Direct Mobile Modal */}
        <div className='space-y-4'>
          <h2 className='text-lg font-semibold text-amber-300'>Test 2: Direct Mobile Modal</h2>
          <button
            onClick={() => setIsDirectModalOpen(true)}
            className='w-full p-3 bg-amber-500 text-black font-semibold rounded-lg'
          >
            Open Mobile Calendar Modal
          </button>
          <p className='text-xs text-amber-200/60'>This opens mobile modal directly for testing</p>
        </div>

        {/* Feature List */}
        <div className='bg-white/5 rounded-xl p-4 border border-amber-200/20 space-y-3'>
          <h3 className='text-base font-semibold text-amber-300'>Premium Features:</h3>
          <ul className='space-y-1 text-sm text-amber-200/80'>
            <li>✅ Fullscreen iOS-style modal</li>
            <li>✅ Backdrop blur + tap to close</li>
            <li>✅ Sticky header with Cancel button</li>
            <li>✅ Scrollable calendar content</li>
            <li>✅ Sticky footer with Confirm button</li>
            <li>✅ Smooth slide-up animation</li>
            <li>✅ Background scroll lock</li>
            <li>✅ Premium Vantage Lane styling</li>
          </ul>
        </div>
      </div>

      {/* Direct Mobile Modal */}
      <MobileCalendarModal
        open={isDirectModalOpen}
        onClose={() => setIsDirectModalOpen(false)}
        value={selectedDate}
        onChange={date => setSelectedDate(date as Date)}
        timezone='Europe/London'
      />
    </div>
  );
}
