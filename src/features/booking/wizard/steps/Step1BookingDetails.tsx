'use client';

import { BookingFormCard } from '../../components/step1/BookingFormCard';

interface Step1BookingDetailsProps {
  onNext?: () => void;
}

export function Step1BookingDetails({ onNext }: Step1BookingDetailsProps = {}) {
  return (
    <>
      <BookingFormCard {...(onNext && { onNext })} />
    </>
  );
}
