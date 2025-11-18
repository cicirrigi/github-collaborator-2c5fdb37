'use client';

import { usePickupDropoffLogic } from '../hooks/usePickupDropoffLogic';

export function DropoffSection() {
  const { bookingType, dropoff, handleDropoffChange } = usePickupDropoffLogic();

  if (bookingType === 'hourly') return null;

  return (
    <div className='space-y-3'>
      <input
        type='text'
        value={dropoff}
        onChange={e => handleDropoffChange(e.target.value)}
        placeholder='Enter destination address...'
        className='w-full bg-transparent border border-amber-200/20 rounded-md px-3 py-2 text-amber-50 text-sm font-light placeholder:text-amber-200/40 focus:border-amber-300/40 focus:outline-none transition-colors'
      />
    </div>
  );
}
