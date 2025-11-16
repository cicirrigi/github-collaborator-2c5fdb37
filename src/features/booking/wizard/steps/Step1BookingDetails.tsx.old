'use client';

import { ZustandBookingTypeDock } from '@/components/booking/ZustandBookingTypeDock';
import { DateTimeSection } from '@/features/booking/components/DateTimeSection';
import { PickupDropoffSection } from '@/features/booking/components/PickupDropoffSection';

// Step1BookingDetails.tsx - FINAL FIXED VERSION (PERFECT 2 COLUMNS ALIGNED)
export function Step1BookingDetails() {
  return (
    <div
      className='
        relative
        w-full
        max-w-[1200px]
        mx-auto
        rounded-[32px]
        border border-white/10
        bg-black/30
        backdrop-blur-2xl
        shadow-[0_20px_80px_rgba(0,0,0,0.85)]
        p-10
        overflow-hidden
      '
    >
      {/* SMOKE LAYER */}
      <div
        className='
          absolute inset-0 -z-10
          bg-[radial-gradient(circle_at_50%_20%,rgba(0,0,0,0.7),rgba(0,0,0,0.45),transparent_70%)]
          blur-[40px]
        '
      />

      {/* HEADER */}
      <div className='text-center space-y-3 mb-12'>
        <h1 className='text-3xl md:text-4xl font-bold text-white'>Book Your Journey</h1>
        <p className='text-lg text-white/70 max-w-2xl mx-auto'>
          Premium chauffeur service in London
        </p>
      </div>

      {/* TRIP TYPE DOCK */}
      <div className='flex justify-center mb-12'>
        <div className='w-full max-w-4xl'>
          <ZustandBookingTypeDock />
        </div>
      </div>

      {/* TRUE PERFECT 2-COLUMN GRID */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
        {/* ROW 1 - LEFT → Locations */}
        <CardLocations />

        {/* ROW 1 - RIGHT → Date & Time */}
        <CardDateTime />

        {/* ROW 2 - LEFT → Additional Stops */}
        <CardAdditionalStops />

        {/* ROW 2 - RIGHT → Passengers */}
        <CardPassengers />

        {/* ROW 3 - LEFT → Luggage */}
        <CardLuggage />

        {/* ROW 3 - RIGHT → Flight Number */}
        <CardFlightNumber />
      </div>
    </div>
  );
}

// 🔹 LOCATIONS
function CardLocations() {
  return (
    <div className='space-y-6'>
      <CardHeader icon='📍' title='Locations' subtitle='Pickup and destination' />
      <PickupDropoffSection />
    </div>
  );
}

// 🔹 DATE & TIME
function CardDateTime() {
  return (
    <div className='space-y-6'>
      <CardHeader icon='📅' title='Date & Time' subtitle='When do you travel' />
      <DateTimeSection />
    </div>
  );
}

// 🔹 ADDITIONAL STOPS
function CardAdditionalStops() {
  return (
    <div className='space-y-6'>
      <CardHeader icon='🗺️' title='Additional Stops' subtitle='Add waypoints to your journey' />
      <Placeholder />
    </div>
  );
}

// 🔹 PASSENGERS
function CardPassengers() {
  return (
    <div className='space-y-6'>
      <CardHeader icon='👥' title='Passengers' subtitle='How many travelers' />
      <Placeholder />
    </div>
  );
}

// 🔹 LUGGAGE
function CardLuggage() {
  return (
    <div className='space-y-6'>
      <CardHeader icon='🧳' title='Luggage' subtitle='Bags and storage' />
      <Placeholder />
    </div>
  );
}

// 🔹 FLIGHT NUMBER
function CardFlightNumber() {
  return (
    <div className='space-y-6'>
      <CardHeader icon='✈️' title='Flight Number' subtitle='Optional' />
      <Placeholder />
    </div>
  );
}

// 🔹 CARD HEADER REUSABLE
function CardHeader({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div className='flex items-center space-x-3 mb-2'>
      <div className='w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center'>
        <span className='text-xl'>{icon}</span>
      </div>
      <div>
        <h3 className='text-xl font-semibold text-white'>{title}</h3>
        <p className='text-sm text-white/60'>{subtitle}</p>
      </div>
    </div>
  );
}

// 🔹 PLACEHOLDER PREMIUM
function Placeholder() {
  return (
    <div className='p-6 bg-white/5 rounded-2xl border border-white/10'>
      <p className='text-white/40 text-center'>Coming soon...</p>
    </div>
  );
}
