'use client';

import { usePickupDropoffLogic } from '../hooks/usePickupDropoffLogic';

export function PickupSection() {
  const { pickup, handlePickupChange } = usePickupDropoffLogic();

  return (
    <div className='space-y-3'>
      <input
        type='text'
        value={pickup}
        onChange={e => handlePickupChange(e.target.value)}
        placeholder='Enter pickup address...'
        className='w-full bg-transparent border border-amber-200/20 rounded-md px-3 py-2 text-amber-50 text-sm font-light placeholder:text-amber-200/40 focus:border-amber-300/40 focus:outline-none transition-colors'
      />
    </div>
  );
}
