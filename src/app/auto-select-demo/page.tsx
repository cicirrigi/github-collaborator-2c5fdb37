'use client';

export const dynamic = 'force-dynamic';

import { format } from 'date-fns';
import { useState } from 'react';

import {
  getEarliestValidBookingTime,
  getNextAvailableDateTime,
  getSmartAutoSelect,
  getUserFeedbackForSelection,
  isValidBookingDateTime,
} from '@/components/time/core/auto-select-utils';
import type { TimeValue } from '@/components/time/core/time-types';

export default function AutoSelectDemoPage() {
  // Get smart auto-select results
  const autoSelect = getSmartAutoSelect();

  // Demo states
  const [selectedDate, setSelectedDate] = useState<Date>(autoSelect.date);
  const [selectedTime, setSelectedTime] = useState<TimeValue | null>(autoSelect.time);

  // Calculate various scenarios
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const todayEarliestTime = getEarliestValidBookingTime(today);
  const tomorrowEarliestTime = getEarliestValidBookingTime(tomorrow);

  // Test validation
  const isCurrentValid =
    selectedDate && selectedTime ? isValidBookingDateTime(selectedDate, selectedTime) : false;

  // Get user feedback
  const feedback = getUserFeedbackForSelection(selectedDate);

  // Get next available for today (if invalid)
  const nextAvailable = getNextAvailableDateTime(today);

  return (
    <div className='min-h-screen bg-black text-white p-8'>
      <div className='max-w-4xl mx-auto space-y-8'>
        {/* Header */}
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-amber-300 mb-4'>
            🎯 Auto-Select Calendar & Time Demo
          </h1>
          <p className='text-amber-200/70'>
            Smart defaults for booking system with 2-hour lead time
          </p>
        </div>

        {/* Smart Auto-Select Results */}
        <div className='bg-white/5 rounded-xl p-6 border border-amber-200/20'>
          <h2 className='text-xl font-semibold text-amber-300 mb-4'>
            🤖 Smart Auto-Select Results
          </h2>
          <div className='grid grid-cols-2 gap-4 text-sm'>
            <div>
              <span className='text-amber-200/60'>Auto Date:</span>
              <p className='font-medium'>{format(autoSelect.date, 'EEEE, MMMM d, yyyy')}</p>
            </div>
            <div>
              <span className='text-amber-200/60'>Auto Time:</span>
              <p className='font-medium'>
                {String(autoSelect.time.hours).padStart(2, '0')}:
                {String(autoSelect.time.minutes).padStart(2, '0')}
              </p>
            </div>
            <div>
              <span className='text-amber-200/60'>Is Next Day:</span>
              <p
                className={`font-medium ${autoSelect.isNextDay ? 'text-orange-300' : 'text-green-300'}`}
              >
                {autoSelect.isNextDay ? '📅 Yes (jumped to tomorrow)' : '📅 No (today works)'}
              </p>
            </div>
            <div>
              <span className='text-amber-200/60'>Lead Time:</span>
              <p className='font-medium'>{autoSelect.leadTimeHours}h advance required</p>
            </div>
          </div>
        </div>

        {/* Current Selection Test */}
        <div className='bg-white/5 rounded-xl p-6 border border-amber-200/20'>
          <h2 className='text-xl font-semibold text-amber-300 mb-4'>🧪 Current Selection Test</h2>
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-amber-200/60 text-sm mb-2'>Selected Date:</label>
                <p className='font-medium'>{format(selectedDate, 'EEEE, MMMM d')}</p>
              </div>
              <div>
                <label className='block text-amber-200/60 text-sm mb-2'>Selected Time:</label>
                <p className='font-medium'>
                  {selectedTime
                    ? `${String(selectedTime.hours).padStart(2, '0')}:${String(selectedTime.minutes).padStart(2, '0')}`
                    : 'None'}
                </p>
              </div>
            </div>

            <div
              className={`p-3 rounded-lg ${isCurrentValid ? 'bg-green-900/30 border border-green-500/30' : 'bg-red-900/30 border border-red-500/30'}`}
            >
              <p className={`font-medium ${isCurrentValid ? 'text-green-300' : 'text-red-300'}`}>
                {isCurrentValid ? '✅ Valid booking time' : '❌ Invalid booking time'}
              </p>
            </div>
          </div>
        </div>

        {/* Scenario Analysis */}
        <div className='bg-white/5 rounded-xl p-6 border border-amber-200/20'>
          <h2 className='text-xl font-semibold text-amber-300 mb-4'>📊 Scenario Analysis</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Today Analysis */}
            <div className='space-y-3'>
              <h3 className='font-medium text-amber-200'>📅 Today ({format(today, 'MMM d')})</h3>
              <div className='text-sm space-y-2'>
                <div>
                  <span className='text-amber-200/60'>Earliest time:</span>
                  <p className='font-medium'>
                    {String(todayEarliestTime.hours).padStart(2, '0')}:
                    {String(todayEarliestTime.minutes).padStart(2, '0')}
                  </p>
                </div>
                <div>
                  <span className='text-amber-200/60'>Valid for booking:</span>
                  <p
                    className={`font-medium ${isValidBookingDateTime(today, todayEarliestTime) ? 'text-green-300' : 'text-red-300'}`}
                  >
                    {isValidBookingDateTime(today, todayEarliestTime) ? '✅ Yes' : '❌ No'}
                  </p>
                </div>
              </div>
            </div>

            {/* Tomorrow Analysis */}
            <div className='space-y-3'>
              <h3 className='font-medium text-amber-200'>
                📅 Tomorrow ({format(tomorrow, 'MMM d')})
              </h3>
              <div className='text-sm space-y-2'>
                <div>
                  <span className='text-amber-200/60'>Earliest time:</span>
                  <p className='font-medium'>
                    {String(tomorrowEarliestTime.hours).padStart(2, '0')}:
                    {String(tomorrowEarliestTime.minutes).padStart(2, '0')}
                  </p>
                </div>
                <div>
                  <span className='text-amber-200/60'>Valid for booking:</span>
                  <p
                    className={`font-medium ${isValidBookingDateTime(tomorrow, tomorrowEarliestTime) ? 'text-green-300' : 'text-red-300'}`}
                  >
                    {isValidBookingDateTime(tomorrow, tomorrowEarliestTime) ? '✅ Yes' : '❌ No'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Feedback Demo */}
        {feedback && (
          <div className='bg-white/5 rounded-xl p-6 border border-amber-200/20'>
            <h2 className='text-xl font-semibold text-amber-300 mb-4'>💬 User Feedback System</h2>
            <div
              className={`p-4 rounded-lg border ${
                feedback.type === 'warning'
                  ? 'bg-orange-900/30 border-orange-500/30'
                  : feedback.type === 'info'
                    ? 'bg-blue-900/30 border-blue-500/30'
                    : 'bg-green-900/30 border-green-500/30'
              }`}
            >
              <p
                className={`font-medium ${
                  feedback.type === 'warning'
                    ? 'text-orange-300'
                    : feedback.type === 'info'
                      ? 'text-blue-300'
                      : 'text-green-300'
                }`}
              >
                {feedback.message}
              </p>
              {feedback.suggestedAction && (
                <p className='text-white/60 text-sm mt-2'>💡 {feedback.suggestedAction}</p>
              )}
            </div>
          </div>
        )}

        {/* Next Available Demo */}
        {nextAvailable && (
          <div className='bg-white/5 rounded-xl p-6 border border-amber-200/20'>
            <h2 className='text-xl font-semibold text-amber-300 mb-4'>🔄 Next Available Helper</h2>
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <span className='text-amber-200/60'>Next Date:</span>
                <p className='font-medium'>{format(nextAvailable.date, 'EEEE, MMMM d')}</p>
              </div>
              <div>
                <span className='text-amber-200/60'>Next Time:</span>
                <p className='font-medium'>
                  {String(nextAvailable.time.hours).padStart(2, '0')}:
                  {String(nextAvailable.time.minutes).padStart(2, '0')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Implementation Notes */}
        <div className='bg-white/5 rounded-xl p-6 border border-amber-200/20'>
          <h2 className='text-xl font-semibold text-amber-300 mb-4'>📋 Implementation Notes</h2>
          <div className='text-sm space-y-2 text-amber-200/80'>
            <p>• All calculations are UK timezone aware (DST safe)</p>
            <p>• 2-hour lead time requirement enforced</p>
            <p>• Times rounded to 15-minute intervals</p>
            <p>• Auto-jumps to next day when today has no valid times</p>
            <p>• Provides user feedback for invalid selections</p>
            <p>• Ready for integration into calendar + time picker components</p>
          </div>
        </div>
      </div>
    </div>
  );
}
