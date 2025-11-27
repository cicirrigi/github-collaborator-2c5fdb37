'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { getBookingRule } from '@/lib/booking/booking-rules';
import { BespokeRequirements } from '../../components/step1/BespokeRequirements';
import { BookingFormCard } from '../../components/step1/BookingFormCard';
import { CardAdditionalStops } from '../../components/step1/CardAdditionalStops';
import { CardReturnAdditionalStops } from '../../components/step1/CardReturnAdditionalStops';
import { DaysDurationSelector } from '../../components/step1/DaysDurationSelector';
import { HoursDurationSelector } from '../../components/step1/HoursDurationSelector';

export function Step1BookingDetails() {
  const { bookingType } = useBookingState();
  const bookingRule = getBookingRule(bookingType);

  return (
    <>
      {/* PREMIUM GRID */}
      <div className='vl-grid-premium'>
        {/* LEFT COLUMN */}
        <BookingFormCard />
        {bookingRule.showDuration && bookingType === 'hourly' && <HoursDurationSelector />}
        {bookingType === 'daily' && <DaysDurationSelector />}

        {/* RIGHT COLUMN - Weather widget moved to compact version in CardHeader */}
        <div className='space-y-3'>{bookingType !== 'bespoke' && <CardAdditionalStops />}</div>
        {bookingType === 'return' && <CardReturnAdditionalStops />}
      </div>

      {/* FULL WIDTH BESPOKE CARD */}
      {bookingType === 'bespoke' && <BespokeRequirements />}
    </>
  );
}
