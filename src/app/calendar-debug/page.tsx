'use client';

export const dynamic = 'force-dynamic';

import { Calendar } from '@/components/calendar/Calendar';
import { useState } from 'react';

export default function CalendarDebugPage() {
  const [debugDate, setDebugDate] = useState<Date | null>(null);

  // Test specific problematic months
  const testMonths = [
    { name: 'Martie 2024', year: 2024, month: 2 },
    { name: 'August 2024', year: 2024, month: 7 },
    { name: 'Noiembrie 2024', year: 2024, month: 10 },
    { name: 'Februarie 2024', year: 2024, month: 1 },
    { name: 'Decembrie 2024', year: 2024, month: 11 },
    { name: 'Ianuarie 2025', year: 2025, month: 0 },
  ];

  return (
    <div className='min-h-screen bg-black text-white p-8'>
      <div className='max-w-6xl mx-auto'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-red-400 mb-4'>🔍 CALENDAR GRID DEBUG</h1>
          <p className='text-red-300/70'>Testing 6×7 grid consistency across different months</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {testMonths.map(testMonth => (
            <div
              key={testMonth.name}
              className='bg-white/5 rounded-lg p-6 border border-red-200/20'
            >
              <h3 className='text-lg font-semibold text-red-300 mb-4 text-center'>
                {testMonth.name}
              </h3>

              {/* Force calendar to show specific month */}
              <div className='border border-red-200/30 rounded-lg p-4'>
                <Calendar
                  value={debugDate}
                  onChange={date => setDebugDate(date as Date | null)}
                  mode='single'
                  timezone='Europe/London'
                />
              </div>

              {/* Debug info */}
              <div className='mt-3 text-xs text-red-200/60'>
                Year: {testMonth.year} | Month: {testMonth.month} | Expected: 6×7=42 cells
              </div>
            </div>
          ))}
        </div>

        <div className='mt-8 bg-red-500/10 rounded-lg p-6 border border-red-400/20'>
          <h3 className='text-lg font-semibold text-red-300 mb-4'>🎯 What to Check:</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-red-200/80'>
            <ul className='space-y-2'>
              <li>• Count rows in each calendar</li>
              <li>• All should have exactly 6 rows</li>
              <li>• No calendar should be taller/shorter</li>
              <li>• Previous/next month dates should show dimmed</li>
            </ul>
            <ul className='space-y-2'>
              <li>• Grid should never expand beyond 6 rows</li>
              <li>• Grid should never shrink below 6 rows</li>
              <li>• Each row = 7 days (Mo-Su)</li>
              <li>• Total = 42 cells always</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
