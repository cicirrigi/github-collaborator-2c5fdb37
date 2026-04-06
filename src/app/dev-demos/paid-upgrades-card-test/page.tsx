'use client';

export const dynamic = 'force-dynamic';

import { PaidUpgradesCardV2 } from '@/features/booking/components/step2/PaidUpgradesCardV2';

export default function PaidUpgradesCardTestPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-white mb-2'>Premium Upgrades Card V2 - Test</h1>
          <p className='text-amber-200/60'>
            Interactive premium upgrades with tooltips, selection and total cost
          </p>
          <div className='flex justify-center gap-2 mt-4'>
            <span className='px-3 py-1 rounded text-xs bg-purple-400/20 text-purple-200'>
              Wine Theme
            </span>
            <span className='px-3 py-1 rounded text-xs bg-gray-400/20 text-gray-200'>
              Click to Select
            </span>
            <span className='px-3 py-1 rounded text-xs bg-blue-400/20 text-blue-200'>
              Hover for Tooltips
            </span>
            <span className='px-3 py-1 rounded text-xs bg-yellow-400/20 text-yellow-200'>
              Live Total Cost
            </span>
          </div>
        </div>

        {/* Test Card */}
        <div className='max-w-md mx-auto'>
          <PaidUpgradesCardV2 />
        </div>

        {/* Instructions */}
        <div className='text-center mt-8'>
          <p className='text-white/60 text-sm'>
            💡 Click on upgrades to select them and see the total cost update
          </p>
          <p className='text-white/40 text-xs mt-2'>
            Upgrades: Flowers (Standard/Exclusive), Champagne (Moët/Dom Pérignon), Security Escort
          </p>
        </div>
      </div>
    </div>
  );
}
