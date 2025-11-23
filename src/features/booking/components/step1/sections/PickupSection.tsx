'use client';

import { MapPin } from 'lucide-react';
import { usePickupDropoffLogic } from '../hooks/usePickupDropoffLogic';

export function PickupSection() {
  const { pickup, handlePickupChange } = usePickupDropoffLogic();

  return (
    <div className='space-y-3'>
      <div className='relative'>
        <div className='absolute left-3 top-1/2 -translate-y-1/2 z-10'>
          <MapPin className='w-4 h-4 text-amber-200/60' />
        </div>
        <input
          type='text'
          value={pickup}
          onChange={e => handlePickupChange(e.target.value)}
          placeholder='Enter pickup address...'
          className='w-full bg-transparent border border-amber-200/20 rounded-md px-3 py-2 pl-10 text-amber-50 text-sm font-light placeholder:text-amber-200/40 focus:border-amber-300/40 focus:outline-none transition-colors'
        />
      </div>
    </div>
  );
}
