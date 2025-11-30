'use client';

import { StatefulTimePicker } from '@/components/time/StatefulTimePicker';
import type { TimeValue } from '@/components/time/core/time-types';
import { DesktopTimePickerModal } from '@/components/time/desktop/DesktopTimePickerModal';
import { MobileTimePickerModal } from '@/components/time/mobile/MobileTimePickerModal';
import { useState } from 'react';

function formatTime(time: TimeValue | null): string {
  if (!time) return 'None';
  return `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}`;
}

export default function TimePickerTestPage() {
  const [selectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<TimeValue | null>(null);
  const [tempTime, setTempTime] = useState<TimeValue | null>(null);

  // Desktop modal test
  const [isDesktopModalOpen, setIsDesktopModalOpen] = useState(false);

  // Mobile modal test
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  const handleOpenDesktop = () => {
    setTempTime(selectedTime);
    setIsDesktopModalOpen(true);
  };

  const handleDesktopSelect = (time: TimeValue | null) => {
    setTempTime(time);
  };

  const handleDesktopConfirm = () => {
    setSelectedTime(tempTime);
    setIsDesktopModalOpen(false);
  };

  const handleDesktopCancel = () => {
    setTempTime(selectedTime);
    setIsDesktopModalOpen(false);
  };

  return (
    <div className='min-h-screen bg-[#0c0c0c] text-white'>
      <div className='container mx-auto px-4 py-8 space-y-12'>
        {/* Header */}
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-amber-300 mb-4'>🕒 Time Picker Test Suite</h1>
          <p className='text-amber-200/70'>
            Desktop & Mobile time picker components with premium UX
          </p>
        </div>

        {/* Current Selection Display */}
        <div className='bg-white/5 rounded-xl p-6 border border-amber-200/20'>
          <h2 className='text-xl font-semibold text-amber-300 mb-4'>Current Selection</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-lg'>
            <div>
              <span className='text-amber-200/60'>Selected: </span>
              <span className='font-mono'>{formatTime(selectedTime)}</span>
            </div>
            <div>
              <span className='text-amber-200/60'>Temp: </span>
              <span className='font-mono'>{formatTime(tempTime)}</span>
            </div>
          </div>
        </div>

        {/* Test 1: StatefulTimePicker */}
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold text-amber-300'>
            Test 1: StatefulTimePicker (Auto Device Detection)
          </h2>
          <div className='bg-white/5 rounded-xl p-6 border border-white/10'>
            <StatefulTimePicker
              date={selectedDate}
              value={selectedTime}
              onChange={time => setSelectedTime(time)}
              interval={15}
            />
            <p className='text-xs text-amber-200/60 mt-2'>
              Automatically detects device and shows appropriate modal
            </p>
          </div>
        </div>

        {/* Test 2: Desktop Modal Direct */}
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold text-amber-300'>
            Test 2: Desktop Time Picker Modal
          </h2>
          <div className='bg-white/5 rounded-xl p-6 border border-white/10 space-y-4'>
            <button
              onClick={handleOpenDesktop}
              className='w-full p-3 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition'
            >
              Open Desktop Time Modal
            </button>
            <p className='text-xs text-amber-200/60'>
              Premium slide-up modal with temp/committed state pattern
            </p>
          </div>
        </div>

        {/* Test 3: Mobile Modal Direct */}
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold text-amber-300'>Test 3: Mobile Time Picker Modal</h2>
          <div className='bg-white/5 rounded-xl p-6 border border-white/10 space-y-4'>
            <button
              onClick={() => setIsMobileModalOpen(true)}
              className='w-full p-3 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition'
            >
              Open Mobile Time Modal
            </button>
            <p className='text-xs text-amber-200/60'>
              iOS-style fullscreen modal with premium animations
            </p>
          </div>
        </div>

        {/* Feature Showcase */}
        <div className='bg-white/5 rounded-xl p-6 border border-amber-200/20 space-y-4'>
          <h3 className='text-lg font-semibold text-amber-300'>Premium Features:</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-amber-200/80'>
            <ul className='space-y-1'>
              <li>✅ Desktop slide-up modal</li>
              <li>✅ Mobile iOS-style fullscreen</li>
              <li>✅ Temp/committed state pattern</li>
              <li>✅ 15-minute interval slots</li>
            </ul>
            <ul className='space-y-1'>
              <li>✅ Timezone-aware calculations</li>
              <li>✅ Lead time constraints</li>
              <li>✅ Min/max time bounds</li>
              <li>✅ Consistent Vantage Lane styling</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Desktop Modal */}
      <DesktopTimePickerModal
        isOpen={isDesktopModalOpen}
        onClose={handleDesktopCancel}
        onConfirm={handleDesktopConfirm}
        value={tempTime}
        date={selectedDate}
        interval={15}
      />

      {/* Mobile Modal */}
      <MobileTimePickerModal
        open={isMobileModalOpen}
        onClose={() => setIsMobileModalOpen(false)}
        onConfirm={time => {
          setSelectedTime(time);
          setIsMobileModalOpen(false);
        }}
        value={selectedTime}
        onChange={time => setSelectedTime(time)}
        date={selectedDate}
        interval={15}
      />
    </div>
  );
}
