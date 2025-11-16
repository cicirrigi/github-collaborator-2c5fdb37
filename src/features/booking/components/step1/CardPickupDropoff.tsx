'use client';

import { MapPin } from 'lucide-react';
import { PickupDropoffSection } from '../PickupDropoffSection';
import { CardHeader } from './CardHeader';

export function CardPickupDropoff() {
  return (
    <div className='space-y-6'>
      <CardHeader icon={MapPin} title='Locations' subtitle='Pickup & Destination' />
      <PickupDropoffSection />
    </div>
  );
}
