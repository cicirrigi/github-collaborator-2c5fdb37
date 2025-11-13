'use client';

import { ArrowRight, RefreshCw, Clock, Car } from 'lucide-react';
import { BookingFloatingDock } from '@/components/ui/booking-floating-dock';

/**
 * 🧪 TEST DOCK PAGE - Pentru debugging dock-ul
 */
export default function TestDockPage() {
  const testItems = [
    {
      title: 'One Way',
      icon: <ArrowRight className='h-full w-full' />,
      onClick: () => console.log('One Way clicked'),
      isActive: true,
    },
    {
      title: 'Return',
      icon: <RefreshCw className='h-full w-full' />,
      onClick: () => console.log('Return clicked'),
    },
    {
      title: 'Hourly',
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
    <div className='min-h-screen bg-black flex items-center justify-center'>
      <div className='text-center space-y-8'>
        <h1 className='text-4xl font-bold text-white'>🧪 DOCK TEST</h1>

        <div className='bg-neutral-900 p-8 rounded-xl'>
          <h2 className='text-white mb-4'>BookingFloatingDock:</h2>
          <BookingFloatingDock items={testItems} />
        </div>

        <p className='text-neutral-400'>Dacă vezi dock-ul aici, înseamnă că funcționează!</p>
      </div>
    </div>
  );
}
