'use client';

export const dynamic = 'force-dynamic';

import { BookingFloatingDock } from '@/components/ui/booking-floating-dock/BookingFloatingDock.modular';
import { ArrowRight, Car, Clock, RefreshCw } from 'lucide-react';

/**
 * 🧩 MODULAR DOCK TEST - New Clean Architecture
 */
export default function DockModularTestPage() {
  const testItems = [
    { title: 'Instant', icon: ArrowRight, onClick: () => {}, isActive: true },
    { title: 'Scheduled', icon: RefreshCw, onClick: () => {}, isActive: false },
    { title: 'By Hour', icon: Clock, onClick: () => {}, isActive: false },
    { title: 'Fleet', icon: Car, onClick: () => {}, isActive: false },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-8'>
      {/* Header */}
      <div className='text-center mb-16'>
        <h1 className='text-4xl md:text-6xl font-bold text-white mb-4'>🧩 Modular Dock Test</h1>
        <p className='text-xl text-blue-200 max-w-2xl mx-auto'>
          Clean architecture: 4 separate components, no trembling, Apple-style icons
        </p>
      </div>

      {/* New Modular Dock */}
      <div className='w-full max-w-4xl'>
        <div className='text-center mb-8'>
          <h2 className='text-2xl font-semibold text-white mb-2'>✨ Modular Architecture</h2>
          <p className='text-blue-200 mb-8'>
            IconContainer + FloatingDockDesktop + FloatingDockMobile + Orchestrator
          </p>
          <div className='flex justify-center'>
            <BookingFloatingDock items={testItems} />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className='mt-16 max-w-2xl text-center'>
        <h3 className='text-lg font-medium text-white mb-6'>✨ New Features:</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-200'>
          <div className='p-4 bg-white/5 rounded-lg border border-white/10'>
            <strong>🎯 No Trembling</strong>
            <p className='text-sm mt-2'>Stable centerX calculation + calmer spring physics</p>
          </div>
          <div className='p-4 bg-white/5 rounded-lg border border-white/10'>
            <strong>🍎 Apple Style</strong>
            <p className='text-sm mt-2'>Gradient circles, plin icons, premium shadows</p>
          </div>
          <div className='p-4 bg-white/5 rounded-lg border border-white/10'>
            <strong>📱 Mobile First</strong>
            <p className='text-sm mt-2'>Collapsible hamburger menu with stagger animation</p>
          </div>
          <div className='p-4 bg-white/5 rounded-lg border border-white/10'>
            <strong>🧩 Modular</strong>
            <p className='text-sm mt-2'>4 focused components, each under 100 lines</p>
          </div>
        </div>
      </div>
    </div>
  );
}
