'use client';

import { MapPin } from 'lucide-react';
import { BookingCard } from './BookingCard';
import { DropoffSection } from './sections/DropoffSection';
import { PickupSection } from './sections/PickupSection';
import { ReturnHintSection } from './sections/ReturnHintSection';

export function CardPickupDropoff() {
  return (
    <BookingCard title='Trip Locations' subtitle='Configure pickup and destination' icon={MapPin}>
      <PickupSection />
      <DropoffSection />
      <ReturnHintSection />
    </BookingCard>
  );
}
