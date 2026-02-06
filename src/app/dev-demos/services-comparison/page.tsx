'use client';

import { IncludedServicesCardV2 } from '@/features/booking/components/step2/IncludedServicesCardV2';
import { IncludedServicesCardV3 } from '@/features/booking/components/step2/IncludedServicesCardV3';

export default function ServicesComparisonPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-white mb-4'>Services Cards Comparison</h1>
          <p className='text-amber-200/60 text-lg'>V2 (Standard) vs V3 (Premium Luxury)</p>
        </div>

        {/* Comparison Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto'>
          {/* V2 Card */}
          <div className='space-y-4'>
            <div className='text-center'>
              <h2 className='text-2xl font-bold text-white mb-2'>Version 2</h2>
              <p className='text-emerald-200/60'>Standard Card Design</p>
              <div className='flex justify-center gap-2 mt-2'>
                <span className='px-2 py-1 rounded text-xs bg-emerald-400/20 text-emerald-200'>
                  Emerald Theme
                </span>
                <span className='px-2 py-1 rounded text-xs bg-gray-400/20 text-gray-200'>
                  Basic Glass
                </span>
              </div>
            </div>
            <IncludedServicesCardV2 />
          </div>

          {/* V3 Card */}
          <div className='space-y-4'>
            <div className='text-center'>
              <h2 className='text-2xl font-bold text-white mb-2'>Version 3</h2>
              <p className='text-amber-200/60'>Premium Luxury Design</p>
              <div className='flex justify-center gap-2 mt-2'>
                <span className='px-2 py-1 rounded text-xs bg-yellow-400/20 text-yellow-200'>
                  Gold Crystal
                </span>
                <span className='px-2 py-1 rounded text-xs bg-purple-400/20 text-purple-200'>
                  Black Glass
                </span>
                <span className='px-2 py-1 rounded text-xs bg-blue-400/20 text-blue-200'>
                  Diamond Tooltips
                </span>
              </div>
            </div>
            <IncludedServicesCardV3 />
          </div>
        </div>

        {/* Features Comparison */}
        <div className='mt-12 max-w-4xl mx-auto'>
          <h3 className='text-2xl font-bold text-white text-center mb-6'>Key Differences</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* V2 Features */}
            <div className='p-6 rounded-2xl bg-white/5 border border-emerald-400/20'>
              <h4 className='text-lg font-semibold text-emerald-400 mb-4'>V2 Standard</h4>
              <ul className='space-y-2'>
                <li className='text-white/80 text-sm'>• Emerald accent theme</li>
                <li className='text-white/80 text-sm'>• Standard glass background</li>
                <li className='text-white/80 text-sm'>• Basic icon containers</li>
                <li className='text-white/80 text-sm'>• Simple tooltips</li>
                <li className='text-white/80 text-sm'>• Clean, minimal design</li>
              </ul>
            </div>

            {/* V3 Features */}
            <div className='p-6 rounded-2xl bg-white/5 border border-yellow-400/20'>
              <h4 className='text-lg font-semibold text-yellow-400 mb-4'>V3 Premium</h4>
              <ul className='space-y-2'>
                <li className='text-white/80 text-sm'>• Gold crystal accent theme</li>
                <li className='text-white/80 text-sm'>• Luxury black-glass with blur</li>
                <li className='text-white/80 text-sm'>• 3D gold crystal icon containers</li>
                <li className='text-white/80 text-sm'>• Floating diamond tooltips</li>
                <li className='text-white/80 text-sm'>• Premium typography & spacing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
