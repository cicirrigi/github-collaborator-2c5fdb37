'use client';

import { useMemo, useState } from 'react';
import { PremiumBookingFormCard } from '@/features/booking/components/step1/PremiumBookingFormCard';
import { useBookingState } from '@/hooks/useBookingState';
import type { BookingType, LocationData } from '@/hooks/useBookingState/booking.types';

export default function PremiumBookingFormTestPage() {
  const {
    bookingType,
    setBookingType,
    setPickupDateTime,
    setPassengers,
    setLuggage,
    setPickup,
    setDropoff,
    resetTrip,
  } = useBookingState();

  const [autoFilled, setAutoFilled] = useState(false);

  const bookingTypes: { value: BookingType; label: string }[] = useMemo(
    () => [
      { value: 'oneway', label: 'One way' },
      { value: 'return', label: 'Return' },
      { value: 'hourly', label: 'Hourly' },
      { value: 'daily', label: 'Daily' },
      { value: 'fleet', label: 'Fleet' },
    ],
    []
  );

  const fillMock = () => {
    const future = new Date();
    future.setHours(future.getHours() + 2);

    setPickupDateTime(future);
    setPassengers(2);
    setLuggage(1);

    const pickup: LocationData = {
      placeId: 'temp-pickup',
      address: 'London Heathrow Airport (LHR), UK',
      coordinates: [51.47, -0.4543],
      type: 'airport',
      components: { airport_name: 'Heathrow Airport' },
    };

    const dropoff: LocationData = {
      placeId: 'temp-dropoff',
      address: 'The Shard, London SE1 9SG, UK',
      coordinates: [51.5045, -0.0865],
      type: 'address',
      components: { area: 'London Bridge' },
    };

    setPickup(pickup);
    setDropoff(dropoff);
    setAutoFilled(true);
  };

  const handleReset = () => {
    resetTrip();
    setAutoFilled(false);
  };

  return (
    <main className='min-h-screen bg-gradient-to-b from-neutral-950 via-black to-neutral-950 px-6 py-14'>
      <div className='mx-auto max-w-6xl'>
        <div className='mb-8 text-center'>
          <h1 className='text-4xl font-bold text-white'>Premium Booking Form (UI Test)</h1>
          <p className='mt-3 text-neutral-400'>
            Same Step 1 fields, but with a more premium layout and CTA.
          </p>
        </div>

        <section className='mb-8'>
          <div className='flex flex-wrap gap-2 justify-center'>
            {bookingTypes.map(t => (
              <button
                key={t.value}
                onClick={() => {
                  setBookingType(t.value);
                  setAutoFilled(false);
                }}
                className={[
                  'px-4 py-2 rounded-xl border text-sm transition-colors',
                  bookingType === t.value
                    ? 'bg-amber-400/15 border-amber-300/35 text-amber-100'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10',
                ].join(' ')}
              >
                {t.label}
              </button>
            ))}
          </div>
        </section>

        <section className='mb-8 flex flex-col sm:flex-row gap-3 justify-center'>
          <button
            onClick={fillMock}
            className='rounded-xl bg-amber-400/15 border border-amber-300/35 px-6 py-3 text-sm font-semibold text-amber-100 hover:bg-amber-400/25 transition-colors'
          >
            {autoFilled ? 'Re-fill mock data' : 'Fill mock data'}
          </button>

          <button
            onClick={handleReset}
            className='rounded-xl bg-white/5 border border-white/10 px-6 py-3 text-sm font-semibold text-white/80 hover:bg-white/10 transition-colors'
          >
            Reset
          </button>
        </section>

        <div className='max-w-6xl mx-auto mt-2'>
          <PremiumBookingFormCard onNext={() => {}} />
        </div>
      </div>
    </main>
  );
}
