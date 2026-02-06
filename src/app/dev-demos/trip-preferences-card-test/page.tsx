'use client';

import { TripPreferencesCardV2 } from '@/features/booking/components/step2/TripPreferencesCardV2';

export default function TripPreferencesCardTestPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-white mb-2'>Trip Preferences Card V2 - Test</h1>
          <p className='text-amber-200/60'>
            Simple dropdown preferences without card selection - clean and focused
          </p>
          <div className='flex justify-center gap-2 mt-4'>
            <span className='px-3 py-1 rounded text-xs bg-gray-400/20 text-gray-200'>
              Click to Expand
            </span>
            <span className='px-3 py-1 rounded text-xs bg-yellow-400/20 text-yellow-200'>
              Hover in Dropdown
            </span>
            <span className='px-3 py-1 rounded text-xs bg-green-400/20 text-green-200'>
              Selection Only in List
            </span>
          </div>
        </div>

        {/* Test Card */}
        <div className='max-w-md mx-auto'>
          <TripPreferencesCardV2 />
        </div>

        {/* Instructions */}
        <div className='text-center mt-8'>
          <p className='text-white/60 text-sm'>
            💡 Click to open dropdowns - hover over options to see highlight effects
          </p>
          <p className='text-white/40 text-xs mt-2'>
            Cards stay neutral - selection feedback only in dropdown lists
          </p>
        </div>
      </div>
    </div>
  );
}
