'use client';

import { MapPin } from 'lucide-react';
import { CardHeader } from './CardHeader';
import { DropoffSection } from './sections/DropoffSection';
import { PickupSection } from './sections/PickupSection';
import { ReturnHintSection } from './sections/ReturnHintSection';

export function CompactTripCard() {
  return (
    <div className='vl-card-flex' style={{ height: 'auto' }}>
      <CardHeader icon={MapPin} title='🟢 COMPACT TRIP CARD' subtitle='Same logic, compact size' />
      <div className='vl-card-inner'>
        <PickupSection />
        <DropoffSection />
        <ReturnHintSection />
      </div>
    </div>
  );
}
