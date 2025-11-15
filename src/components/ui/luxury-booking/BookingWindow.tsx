'use client';

import { cn } from '@/lib/utils';
import { BOOKING_TOKENS } from './tokens/booking.tokens';

// Sub-components (UI-only skeletons)
import { DateTimeSection } from '@/features/booking/components/DateTimeSection';
import { BookingFlights } from './BookingFlights';
import { BookingHeader } from './BookingHeader';
import { BookingLocations } from './BookingLocations';
import { BookingLuggage } from './BookingLuggage';
import { BookingPassengers } from './BookingPassengers';
import { BookingSummary } from './BookingSummary';

/**
 * � LuxuryBookingWindow – Enterprise UI Skeleton (NO LOGIC)
 * -----------------------------------------------------------
 * - Zero logic
 * - Zero state
 * - Zero backend
 * - 100% UI-only skeleton
 * - Fully isolated from TravelPlannerPro
 * - Perfect for premium UI & orchestration
 */

export function LuxuryBookingWindow({ className }: { className?: string }) {
  return (
    <div className={cn(BOOKING_TOKENS.window, className)}>
      <div className={BOOKING_TOKENS.grid}>
        {/* COL 1 – Main Booking Flow */}
        <div className='flex flex-col gap-8'>
          {/* 1. HEADER */}
          <div className={BOOKING_TOKENS.card}>
            <BookingHeader />
          </div>

          {/* 2. LOCATIONS */}
          <div className={BOOKING_TOKENS.card}>
            <BookingLocations />
          </div>

          {/* 3. DATE & TIME */}
          <div className={BOOKING_TOKENS.card}>
            <h2 className={BOOKING_TOKENS.sectionTitle}>Date & Time</h2>
            <p className='text-white/50 text-sm mb-4'>Select your pickup date and time.</p>
            <DateTimeSection />
          </div>
        </div>

        {/* COL 2 – Passenger & Details */}
        <div className='flex flex-col gap-8'>
          {/* PASSENGERS */}
          <div className={BOOKING_TOKENS.card}>
            <BookingPassengers />
          </div>

          {/* LUGGAGE */}
          <div className={BOOKING_TOKENS.card}>
            <BookingLuggage />
          </div>

          {/* FLIGHT NUMBERS */}
          <div className={BOOKING_TOKENS.card}>
            <BookingFlights />
          </div>

          {/* SUMMARY */}
          <div className={BOOKING_TOKENS.card}>
            <BookingSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
