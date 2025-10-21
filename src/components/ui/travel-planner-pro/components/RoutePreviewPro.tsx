'use client';

import { TRAVEL_PLANNER_PRO_THEME } from '../constants';

interface RoutePreviewProProps {
  className?: string;
}

export const RoutePreviewPro = ({ className }: RoutePreviewProProps) => (
  <div className={className}>
    <h3 className={TRAVEL_PLANNER_PRO_THEME.sectionTitle}>Route Preview</h3>

    <div className='space-y-4'>
      {/* Map Placeholder */}
      <div className='aspect-video bg-white/[0.03] border border-white/[0.07] rounded-xl flex items-center justify-center text-neutral-500 text-sm relative overflow-hidden'>
        <div className='text-center'>
          <div className='text-4xl mb-2'>🗺️</div>
          <p>Interactive Map</p>
          <p className='text-xs opacity-70'>(coming soon)</p>
        </div>

        {/* Subtle overlay gradient */}
        <div className='absolute inset-0 bg-gradient-to-br from-[#CBB26A]/5 to-transparent pointer-events-none' />
      </div>

      {/* Route Status */}
      <div className='grid grid-cols-3 gap-3 text-center'>
        <div className='bg-white/[0.03] border border-white/[0.05] rounded-lg p-3'>
          <div className='w-2 h-2 bg-green-500 rounded-full mx-auto mb-1'></div>
          <p className='text-xs text-neutral-400'>Pickup</p>
        </div>
        <div className='bg-white/[0.03] border border-white/[0.05] rounded-lg p-3'>
          <div className='w-2 h-2 bg-blue-500 rounded-full mx-auto mb-1'></div>
          <p className='text-xs text-neutral-400'>Stops</p>
        </div>
        <div className='bg-white/[0.03] border border-white/[0.05] rounded-lg p-3'>
          <div className='w-2 h-2 bg-red-500 rounded-full mx-auto mb-1'></div>
          <p className='text-xs text-neutral-400'>Drop-off</p>
        </div>
      </div>

      {/* Route Summary */}
      <div className='text-xs text-neutral-500 text-center'>
        Select pickup and destination to see route details
      </div>
    </div>
  </div>
);
