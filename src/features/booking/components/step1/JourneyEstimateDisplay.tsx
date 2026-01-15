'use client';

import { GlassmorphismCard } from '@/components/ui/GlassmorphismCard';
import { Route } from 'lucide-react';

export function JourneyEstimateDisplay() {
  return (
    <GlassmorphismCard className='p-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Route className='w-4 h-4 text-amber-200/60' />
          <span className='text-white text-sm font-light tracking-wider'>Journey</span>
        </div>
        <div className='text-amber-50 font-light text-sm tabular-nums'>25 km • 30 min</div>
      </div>
    </GlassmorphismCard>
  );
}
