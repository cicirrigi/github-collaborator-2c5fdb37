'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { BespokeRequirements } from '../../components/step1/BespokeRequirements';
import { BookingFormCard } from '../../components/step1/BookingFormCard';

interface Step1BookingDetailsProps {
  onNext?: () => void;
}

export function Step1BookingDetails({ onNext }: Step1BookingDetailsProps = {}) {
  const { bookingType } = useBookingState();

  return (
    <>
      {/* PREMIUM GRID */}
      <div className='vl-grid-premium'>
        {/* LEFT COLUMN */}
        <BookingFormCard {...(onNext && { onNext })} />

        {/* RIGHT COLUMN - Empty for now, components integrated into BookingFormCard */}
        <div className='space-y-3'>{/* Additional components can go here if needed */}</div>
      </div>

      {/* FULL WIDTH BESPOKE CARD */}
      {bookingType === 'bespoke' && <BespokeRequirements />}
    </>
  );
}
