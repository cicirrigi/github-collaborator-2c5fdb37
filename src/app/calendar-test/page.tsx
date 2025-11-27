'use client';

import { Calendar } from '@/components/calendar/Calendar';
import { DesktopCalendarModal } from '@/components/calendar/variants/modals/DesktopCalendarModal';
import { StatefulTimePicker } from '@/components/time/StatefulTimePicker';
import type { TimeValue } from '@/components/time/core/time-types';
import { useState } from 'react';

export default function CalendarTestPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<TimeValue | null>({ hours: 14, minutes: 30 });

  return (
    <div className='min-h-screen bg-black text-white p-8'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-amber-300 mb-4'>
            📅 Fluid Responsive Calendar Engine
          </h1>
          <p className='text-amber-200/70 text-lg'>
            Resize your browser to see the calendar adapt to any container size!
          </p>
        </div>

        {/* Calendar Showcase - Multiple Sizes */}
        <div className='space-y-16'>
          {/* Row 1: Mobile sizes */}
          <div>
            <h2 className='text-2xl font-semibold text-amber-300 mb-8 text-center'>
              📱 Mobile Sizes
            </h2>
            <div className='flex justify-center items-start gap-8 flex-wrap'>
              {/* 220px - Very compact */}
              <div className='text-center'>
                <p className='text-amber-200/60 text-sm mb-4'>Very Compact - 220px</p>
                <div
                  style={{
                    width: 220,
                    minHeight: 280, // ⭐ STABLE HEIGHT - prevents jump
                  }}
                  className='bg-white/5 border border-amber-200/20 rounded-xl p-4'
                >
                  <Calendar
                    value={selectedDate}
                    onChange={date => setSelectedDate(date as Date | null)}
                    mode='single'
                    timezone='Europe/London'
                  />
                </div>
              </div>

              {/* 280px - Mobile standard */}
              <div className='text-center'>
                <p className='text-amber-200/60 text-sm mb-4'>Mobile Standard - 280px</p>
                <div
                  style={{
                    width: 280,
                    minHeight: 300, // ⭐ STABLE HEIGHT
                  }}
                  className='bg-white/5 border border-amber-200/20 rounded-xl p-4'
                >
                  <Calendar
                    value={selectedDate}
                    onChange={date => setSelectedDate(date as Date | null)}
                    mode='single'
                    timezone='Europe/London'
                  />
                </div>
              </div>

              {/* 320px - Mobile large */}
              <div className='text-center'>
                <p className='text-amber-200/60 text-sm mb-4'>Mobile Large - 320px</p>
                <div
                  style={{
                    width: 320,
                    minHeight: 320, // ⭐ STABLE HEIGHT
                  }}
                  className='bg-white/5 border border-amber-200/20 rounded-xl p-4'
                >
                  <Calendar
                    value={selectedDate}
                    onChange={date => setSelectedDate(date as Date | null)}
                    mode='single'
                    timezone='Europe/London'
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Tablet sizes */}
          <div>
            <h2 className='text-2xl font-semibold text-amber-300 mb-8 text-center'>
              📱 Tablet Sizes
            </h2>
            <div className='flex justify-center items-start gap-8 flex-wrap'>
              {/* 360px - Tablet portrait */}
              <div className='text-center'>
                <p className='text-amber-200/60 text-sm mb-4'>Tablet Portrait - 360px</p>
                <div
                  style={{ width: 360 }}
                  className='bg-white/5 border border-amber-200/20 rounded-xl p-6'
                >
                  <Calendar
                    value={selectedDate}
                    onChange={date => setSelectedDate(date as Date | null)}
                    mode='single'
                    timezone='Europe/London'
                  />
                </div>
              </div>

              {/* 420px - Tablet comfortable */}
              <div className='text-center'>
                <p className='text-amber-200/60 text-sm mb-4'>Tablet Comfortable - 420px</p>
                <div
                  style={{ width: 420 }}
                  className='bg-white/5 border border-amber-200/20 rounded-xl p-6'
                >
                  <Calendar
                    value={selectedDate}
                    onChange={date => setSelectedDate(date as Date | null)}
                    mode='single'
                    timezone='Europe/London'
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Desktop sizes */}
          <div>
            <h2 className='text-2xl font-semibold text-amber-300 mb-8 text-center'>
              💻 Desktop Sizes
            </h2>
            <div className='flex justify-center items-start gap-8 flex-wrap'>
              {/* 480px - Desktop standard */}
              <div className='text-center'>
                <p className='text-amber-200/60 text-sm mb-4'>Desktop Standard - 480px</p>
                <div
                  style={{ width: 480 }}
                  className='bg-white/5 border border-amber-200/20 rounded-xl p-8'
                >
                  <Calendar
                    value={selectedDate}
                    onChange={date => setSelectedDate(date as Date | null)}
                    mode='single'
                    timezone='Europe/London'
                  />
                </div>
              </div>

              {/* 560px - Desktop luxury */}
              <div className='text-center'>
                <p className='text-amber-200/60 text-sm mb-4'>Desktop Luxury - 560px</p>
                <div
                  style={{ width: 560 }}
                  className='bg-white/5 border border-amber-200/20 rounded-xl p-8'
                >
                  <Calendar
                    value={selectedDate}
                    onChange={date => setSelectedDate(date as Date | null)}
                    mode='single'
                    timezone='Europe/London'
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Selection Display */}
          {selectedDate && (
            <div className='mt-12 p-8 bg-gradient-to-r from-amber-500/10 to-amber-600/10 rounded-xl border border-amber-400/20 text-center'>
              <p className='text-2xl text-amber-300 font-semibold'>
                ✅ Selected Date:{' '}
                <span className='text-amber-200'>
                  {selectedDate.toLocaleDateString('en-GB', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </p>
              <p className='text-amber-200/60 mt-2'>
                Selection is synced across all calendar sizes! Every calendar above shows the same
                selected date.
              </p>
            </div>
          )}

          {/* Landscape Orientation Test Section */}
          <div className='mt-20'>
            <div className='text-center mb-8'>
              <h2 className='text-3xl font-bold text-amber-300 mb-4'>
                🔄 Landscape Orientation Mode
              </h2>
              <p className='text-amber-200/70'>
                Same calendars but with landscape orientation - shorter, wider cells for compact
                displays!
              </p>
            </div>

            {/* Landscape Calendars */}
            <div className='space-y-16'>
              {/* Row 1: Mobile sizes - Landscape */}
              <div>
                <h3 className='text-xl font-semibold text-amber-300 mb-6 text-center'>
                  📱 Mobile Sizes - Landscape
                </h3>
                <div className='flex justify-center items-start gap-8 flex-wrap'>
                  {/* 220px - Very compact landscape */}
                  <div className='text-center'>
                    <p className='text-amber-200/60 text-sm mb-4'>Very Compact - 220px</p>
                    <div
                      style={{ width: 220 }}
                      className='bg-white/5 border border-amber-200/20 rounded-xl p-4'
                    >
                      <Calendar
                        value={selectedDate}
                        onChange={date => setSelectedDate(date as Date | null)}
                        mode='single'
                        timezone='Europe/London'
                        orientation='landscape'
                      />
                    </div>
                  </div>

                  {/* 280px - Mobile standard landscape */}
                  <div className='text-center'>
                    <p className='text-amber-200/60 text-sm mb-4'>Mobile Standard - 280px</p>
                    <div
                      style={{ width: 280 }}
                      className='bg-white/5 border border-amber-200/20 rounded-xl p-4'
                    >
                      <Calendar
                        value={selectedDate}
                        onChange={date => setSelectedDate(date as Date | null)}
                        mode='single'
                        timezone='Europe/London'
                        orientation='landscape'
                      />
                    </div>
                  </div>

                  {/* 320px - Mobile large landscape */}
                  <div className='text-center'>
                    <p className='text-amber-200/60 text-sm mb-4'>Mobile Large - 320px</p>
                    <div
                      style={{ width: 320 }}
                      className='bg-white/5 border border-amber-200/20 rounded-xl p-4'
                    >
                      <Calendar
                        value={selectedDate}
                        onChange={date => setSelectedDate(date as Date | null)}
                        mode='single'
                        timezone='Europe/London'
                        orientation='landscape'
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Tablet sizes - Landscape */}
              <div>
                <h3 className='text-xl font-semibold text-amber-300 mb-6 text-center'>
                  📱 Tablet & Desktop - Landscape
                </h3>
                <div className='flex justify-center items-start gap-8 flex-wrap'>
                  {/* 360px - Tablet portrait landscape */}
                  <div className='text-center'>
                    <p className='text-amber-200/60 text-sm mb-4'>Tablet Portrait - 360px</p>
                    <div
                      style={{ width: 360 }}
                      className='bg-white/5 border border-amber-200/20 rounded-xl p-6'
                    >
                      <Calendar
                        value={selectedDate}
                        onChange={date => setSelectedDate(date as Date | null)}
                        mode='single'
                        timezone='Europe/London'
                        orientation='landscape'
                      />
                    </div>
                  </div>

                  {/* 480px - Desktop standard landscape */}
                  <div className='text-center'>
                    <p className='text-amber-200/60 text-sm mb-4'>Desktop Standard - 480px</p>
                    <div
                      style={{ width: 480 }}
                      className='bg-white/5 border border-amber-200/20 rounded-xl p-8'
                    >
                      <Calendar
                        value={selectedDate}
                        onChange={date => setSelectedDate(date as Date | null)}
                        mode='single'
                        timezone='Europe/London'
                        orientation='landscape'
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Landscape Selection Display */}
            {selectedDate && (
              <div className='mt-8 p-6 bg-gradient-to-r from-emerald-500/10 to-teal-600/10 rounded-xl border border-emerald-400/20 text-center'>
                <p className='text-emerald-300 text-lg font-semibold'>
                  🔄 Landscape Mode Active - Selected:{' '}
                  <span className='text-emerald-200'>
                    {selectedDate.toLocaleDateString('en-GB', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </p>
                <p className='text-emerald-200/60 text-sm mt-2'>
                  Notice how landscape calendars are more compact vertically while maintaining full
                  functionality!
                </p>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className='mt-16 bg-gradient-to-br from-white/5 to-amber-500/5 rounded-xl p-8 border border-amber-200/10'>
            <h3 className='text-xl font-semibold text-amber-300 mb-6 text-center'>
              🚀 Fluid Responsive Features
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 text-center'>
              <div>
                <div className='text-amber-300 text-2xl mb-2'>📐</div>
                <h4 className='font-semibold text-amber-200 mb-2'>Perfect Scaling</h4>
                <p className='text-amber-200/70 text-sm'>
                  Calendar cells automatically scale to fit any container width while maintaining
                  perfect proportions.
                </p>
              </div>
              <div>
                <div className='text-amber-300 text-2xl mb-2'>⚡</div>
                <h4 className='font-semibold text-amber-200 mb-2'>Real-time Resize</h4>
                <p className='text-amber-200/70 text-sm'>
                  Resize your browser window and watch the calendars adapt instantly with no
                  flickering or layout breaks.
                </p>
              </div>
              <div>
                <div className='text-amber-300 text-2xl mb-2'>🎯</div>
                <h4 className='font-semibold text-amber-200 mb-2'>Enterprise Ready</h4>
                <p className='text-amber-200/70 text-sm'>
                  Production-ready with timezone support, accessibility, and performance
                  optimization for any screen size.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Calendar Modal Test Section */}
      <div className='mt-24 border-t border-amber-200/20 pt-16'>
        <DesktopModalTestSection />
      </div>

      {/* Time Picker Test Section */}
      <div className='mt-24 border-t border-amber-200/20 pt-16'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-amber-300 mb-4'>🕒 Desktop Time Picker</h2>
          <p className='text-amber-200/70 text-lg'>
            Consistent with Calendar modal UX - temp/committed pattern
          </p>
        </div>

        <div className='max-w-md mx-auto space-y-6'>
          <div className='bg-white/5 rounded-xl p-6 border border-amber-200/20'>
            <h3 className='text-lg font-semibold text-amber-300 mb-4'>Current Selection</h3>
            <p className='text-amber-200/80'>
              Time:{' '}
              {selectedTime
                ? `${String(selectedTime.hours).padStart(2, '0')}:${String(selectedTime.minutes).padStart(2, '0')}`
                : 'None'}
            </p>
          </div>

          <div className='bg-white/5 rounded-xl p-6 border border-amber-200/20'>
            <h3 className='text-lg font-semibold text-amber-300 mb-4'>Time Picker Test</h3>
            <StatefulTimePicker
              value={selectedTime}
              onChange={setSelectedTime}
              timezone='Europe/London'
              interval={15}
              className='w-full'
            />
            <p className='text-xs text-amber-200/60 mt-2'>
              Desktop: Confirm/Cancel flow | Mobile: Direct selection
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DesktopModalTestSection() {
  const [committedDate, setCommittedDate] = useState<Date | null>(null);
  const [tempDate, setTempDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = () => {
    setTempDate(committedDate); // Initialize temp with committed
    setIsModalOpen(true);
  };

  const handleSelect = (date: Date | null) => {
    setTempDate(date); // Update temp on selection
  };

  const handleConfirm = () => {
    setCommittedDate(tempDate); // Commit temp to final
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setTempDate(committedDate); // Reset temp to committed
    setIsModalOpen(false);
  };

  return (
    <div className='max-w-4xl mx-auto'>
      {/* Header */}
      <div className='text-center mb-12'>
        <h2 className='text-3xl font-bold text-amber-300 mb-4'>🖥️ Desktop Calendar Modal System</h2>
        <p className='text-amber-200/70 text-lg'>
          Premium luxury slide-up modal with Vantage Lane styling
        </p>
      </div>

      {/* Modal Test Controls */}
      <div className='bg-white/5 border border-amber-200/20 rounded-xl p-8'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h3 className='text-xl font-semibold text-amber-300 mb-2'>
              Modal Test Controls - PURE CONTROLLED MODAL
            </h3>
            <p className='text-amber-200/60 text-sm'>
              Committed: {committedDate?.toDateString() || 'None'}
            </p>
            <p className='text-amber-200/40 text-xs'>Temp: {tempDate?.toDateString() || 'None'}</p>
          </div>

          <button
            onClick={handleOpen}
            className='px-6 py-3 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition-all'
          >
            Open Calendar Modal
          </button>
        </div>

        {/* Modal Integration - PURE CONTROLLED */}
        <DesktopCalendarModal
          isOpen={isModalOpen}
          onClose={handleCancel}
          onSelect={handleSelect}
          onConfirm={handleConfirm}
          value={tempDate}
          timezone='Europe/London'
          label='Choose Your Journey Date'
        />
      </div>
    </div>
  );
}
