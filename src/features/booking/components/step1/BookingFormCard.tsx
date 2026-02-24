'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { ArrowRight, Route } from 'lucide-react';
import { AdditionalStopsInline } from './AdditionalStopsInline';
import { BespokeRequirements } from './BespokeRequirements';
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
  const { bookingType, validateStep1Complete } = useBookingState();
  const bookingTypeLabel = BOOKING_TYPE_LABELS[bookingType] || 'BOOKING';
  const isHourlyBooking = bookingType === 'hourly';
  const isDailyBooking = bookingType === 'daily';
  const isBespokeBooking = bookingType === 'bespoke';

  // Check if Step 1 is complete for validation
  const isStep1Valid = validateStep1Complete();

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
            {isBespokeBooking ? (
              <BespokeRequirements />
            ) : isHourlyBooking ? (
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
                disabled={!isStep1Valid}
                className={`w-full backdrop-filter backdrop-blur-md font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-4 shadow-lg ${
                  isStep1Valid
                    ? 'bg-amber-400/15 hover:bg-amber-400/25 border border-amber-300/30 text-amber-50 hover:shadow-amber-400/20 cursor-pointer'
                    : 'bg-neutral-500/10 border border-neutral-600/30 text-neutral-400 cursor-not-allowed opacity-50'
                }`}
              >
                <span className='flex'>
                  {(isStep1Valid ? 'Continue to Vehicle Selection' : 'Complete Required Fields')
                    .split('')
                    .map((letter, index) => (
                      <span
                        key={index}
                        className='inline-block'
                        style={{
                          animation: `shimmerWave 4s ease-in-out infinite`,
                          animationDelay: `${index * 0.08}s`,
                        }}
                      >
                        {letter === ' ' ? '\u00A0' : letter}
                      </span>
                    ))}
                </span>
                <ArrowRight className='w-5 h-5' />
                <style
                  dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes shimmerWave {
                      0% {
                        color: #fef3c7;
                      }
                      25% {
                        color: #ffffff;
                        text-shadow: 0 0 8px rgba(255,255,255,0.6);
                      }
                      50% {
                        color: #fef3c7;
                      }
                      100% {
                        color: #fef3c7;
                      }
                    }
                  `,
                  }}
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
