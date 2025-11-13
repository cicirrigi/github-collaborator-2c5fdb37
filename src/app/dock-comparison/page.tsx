'use client';

import { ArrowRight, RefreshCw, Clock, Car } from 'lucide-react';
import { BookingFloatingDock } from '@/components/ui/booking-floating-dock';
import { BookingFloatingDock as ElegantDock } from '@/components/ui/booking-floating-dock/BookingFloatingDock.elegant';

/**
 * 🔄 DOCK COMPARISON - Old vs New Design
 */
export default function DockComparisonPage() {
  const testItems = [
    {
      title: 'Instant',
      icon: <ArrowRight className='h-full w-full' />,
      onClick: () => console.log('Instant clicked'),
    },
    {
      title: 'Scheduled',
      icon: <RefreshCw className='h-full w-full' />,
      onClick: () => console.log('Scheduled clicked'),
    },
    {
      title: 'By Hour',
      icon: <Clock className='h-full w-full' />,
      onClick: () => console.log('Hourly clicked'),
    },
    {
      title: 'Fleet',
      icon: <Car className='h-full w-full' />,
      onClick: () => console.log('Fleet clicked'),
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-8'>
      {/* Header */}
      <div className='text-center mb-16'>
        <h1 className='text-4xl md:text-6xl font-bold text-white mb-4'>🔄 Dock Comparison</h1>
        <p className='text-xl text-blue-200 max-w-2xl mx-auto'>
          Compare our current complex dock vs the new elegant design
        </p>
      </div>

      {/* Comparison */}
      <div className='w-full max-w-4xl space-y-16'>
        {/* Current Dock */}
        <div className='text-center'>
          <h2 className='text-2xl font-semibold text-white mb-2'>🔧 Current Dock (Complex)</h2>
          <p className='text-blue-200 mb-8'>
            Gaussian magnification + lens effect + heavy glass morphism
          </p>
          <div className='flex justify-center'>
            <BookingFloatingDock items={testItems} />
          </div>
        </div>

        <div className='border-t border-white/10'></div>

        {/* New Elegant Dock */}
        <div className='text-center'>
          <h2 className='text-2xl font-semibold text-white mb-2'>✨ New Elegant Dock (Simple)</h2>
          <p className='text-blue-200 mb-8'>
            Clean scaling + tooltips + minimal design + mobile support
          </p>
          <div className='flex justify-center'>
            <ElegantDock items={testItems} />
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className='mt-16 max-w-md text-center'>
        <h3 className='text-lg font-medium text-white mb-4'>How to test:</h3>
        <ul className='text-blue-200 space-y-2 text-left'>
          <li>
            • <strong>Hover slowly</strong> over both docks
          </li>
          <li>
            • <strong>Notice tooltips</strong> on the elegant version
          </li>
          <li>
            • <strong>Try mobile</strong> - elegant has collapsible menu
          </li>
          <li>
            • <strong>Compare smoothness</strong> and visual weight
          </li>
        </ul>
      </div>
    </div>
  );
}
