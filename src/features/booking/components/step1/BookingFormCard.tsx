'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { ArrowRight, Route } from 'lucide-react';
import { AdditionalStopsInline } from './AdditionalStopsInline';
import { CalendarPlaceholder } from './CalendarPlaceholder';
import { CardHeader } from './CardHeader';
import { DaysDurationSelector } from './DaysDurationSelector';
import { FlightInformationSection } from './FlightInformationSection';
import { HoursDurationSelector } from './HoursDurationSelector';
import { JourneyEstimateDisplay } from './JourneyEstimateDisplay';
import { PassengerLuggageSelector } from './PassengerLuggageSelector';
import { TravelRouteSection } from './TravelRouteSection';

// Booking type display names
const BOOKING_TYPE_LABELS = {
  oneway: 'ONE WAY',
  return: 'RETURN',
  hourly: 'HOURLY',
  daily: 'DAILY',
  fleet: 'FLEET',
  bespoke: 'BESPOKE',
  events: 'EVENTS',
  corporate: 'CORPORATE',
} as const;

interface BookingFormCardProps {
  onNext?: () => void;
}

export function BookingFormCard({ onNext }: BookingFormCardProps = {}) {
  const { bookingType } = useBookingState();
  const bookingTypeLabel = BOOKING_TYPE_LABELS[bookingType] || 'BOOKING';
  const isHourlyBooking = bookingType === 'hourly';
  const isDailyBooking = bookingType === 'daily';

  return (
    <div className='vl-card-flex col-span-1 lg:col-span-2'>
      <CardHeader
        icon={Route}
        title='Selected Booking'
        subtitle={bookingTypeLabel}
        showWeather={true}
      />
      <div className='vl-card-inner'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 h-full relative'>
          {/* Left Side - Trip Details */}
          <div className='space-y-6'>
            <TravelRouteSection />
            <PassengerLuggageSelector />
            <JourneyEstimateDisplay />

            {/* Conditional Components based on booking type */}
            {isHourlyBooking ? (
              <HoursDurationSelector />
            ) : isDailyBooking ? (
              <DaysDurationSelector />
            ) : (
              <AdditionalStopsInline />
            )}
          </div>

          {/* Refined Divider - Desktop Only */}
          <div className='hidden lg:block absolute left-1/2 top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-amber-200/15 to-transparent transform -translate-x-1/2'></div>

          {/* Right Side - Calendar PLACEHOLDER + Flight Numbers */}
          <div className='flex flex-col gap-4'>
            <CalendarPlaceholder />
            <FlightInformationSection />

            {/* Continue Button - Integrated in Form */}
            {onNext && (
              <button
                onClick={onNext}
                className='w-full bg-amber-400/15 hover:bg-amber-400/25 backdrop-filter backdrop-blur-md border border-amber-300/30 text-amber-50 font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-4 shadow-lg hover:shadow-amber-400/20'
              >
                <span>Continue to Vehicle Selection</span>
                <ArrowRight className='w-5 h-5' />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
