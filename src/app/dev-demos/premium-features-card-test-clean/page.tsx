'use client';

import { PremiumFeaturesCardV2 } from '@/features/booking/components/step2/PremiumFeaturesCardV2';

export default function PremiumFeaturesCardTestPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-white mb-2'>Premium Features Card V2 - Test</h1>
          <p className='text-amber-200/60'>Real component with Zustand integration</p>
        </div>

        {/* Test Card */}
        <div className='max-w-md mx-auto'>
          <PremiumFeaturesCardV2 />
        </div>
      </div>
    </div>
  );
}
