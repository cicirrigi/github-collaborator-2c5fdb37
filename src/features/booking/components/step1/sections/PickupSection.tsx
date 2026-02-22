'use client';

import { AutocompleteInput } from '@/components/ui/AutocompleteInput';
import { MapPin } from 'lucide-react';
import { usePickupDropoffLogic } from '../hooks/usePickupDropoffLogic';

export function PickupSection() {
  const { pickup, handlePickupChange, handlePickupPlaceSelect } = usePickupDropoffLogic();

  return (
    <div className='space-y-3'>
      <AutocompleteInput
        value={pickup}
        onChange={handlePickupChange}
        onPlaceSelect={handlePickupPlaceSelect}
        placeholder='Enter pickup address...'
        icon={<MapPin className='w-4 h-4 text-amber-200/60' />}
      />
    </div>
  );
}
