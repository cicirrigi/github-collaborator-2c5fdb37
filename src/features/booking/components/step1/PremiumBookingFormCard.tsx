'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { ArrowRight, Sparkles } from 'lucide-react';
import { GlassmorphismCard } from '@/components/ui/GlassmorphismCard';
import { AdditionalStopsInline } from './AdditionalStopsInline';
import { BespokeRequirements } from './BespokeRequirements';
import { CalendarPlaceholder } from './CalendarPlaceholder';
import { DaysDurationSelector } from './DaysDurationSelector';
import { FlightInformationSection } from './FlightInformationSection';
import { HoursDurationSelector } from './HoursDurationSelector';
import { JourneySelectedSummary } from './JourneySelectedSummary';
import { PassengerLuggageSelector } from './PassengerLuggageSelector';
import { TravelRouteSection } from './TravelRouteSection';

const BOOKING_TYPE_LABELS: Record<string, string> = {
  oneway: 'ONE WAY',
  return: 'RETURN',
  hourly: 'HOURLY',
  daily: 'DAILY',
  fleet: 'FLEET',
  bespoke: 'BESPOKE',
  events: 'EVENTS',
  corporate: 'CORPORATE',
};

interface PremiumBookingFormCardProps {
  onNext?: () => void;
}

export function PremiumBookingFormCard({ onNext }: PremiumBookingFormCardProps = {}) {
  const { bookingType, validateStep1Complete, currentStep, totalSteps } = useBookingState();
  const bookingTypeLabel = BOOKING_TYPE_LABELS[bookingType] || 'BOOKING';

  const isHourlyBooking = bookingType === 'hourly';
  const isDailyBooking = bookingType === 'daily';
  const isBespokeBooking = bookingType === 'bespoke';

  const isStep1Valid = validateStep1Complete();

  const stepCount = typeof totalSteps === 'number' && totalSteps > 0 ? totalSteps : 4;
  const activeStep = typeof currentStep === 'number' ? currentStep : 1;

  return (
    <div className='relative'>
      <div className='absolute -inset-3 rounded-[32px] bg-[radial-gradient(ellipse_at_top,_rgba(245,212,105,0.45),_transparent_56%)] opacity-80 pointer-events-none' />

      <GlassmorphismCard className='rounded-[28px] border border-amber-300/25 shadow-[0_40px_120px_rgba(0,0,0,0.62)]'>
        <div className='relative p-6 sm:p-9'>
          {/* Top header */}
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <div className='flex items-center gap-3'>
                <div className='rounded-2xl bg-amber-400/10 border border-amber-300/25 p-2.5'>
                  <Sparkles className='h-5 w-5 text-amber-200' />
                </div>
                <div>
                  <p className='text-xs uppercase tracking-widest text-amber-200/70'>
                    Step {activeStep} of {stepCount}
                  </p>
                  <h2 className='text-lg sm:text-xl font-semibold text-white'>
                    {bookingTypeLabel} — Journey Details
                  </h2>
                </div>
              </div>

              <div className='flex items-center gap-2 text-xs text-white/70'>
                <span
                  className={[
                    'inline-flex items-center gap-2 rounded-full border bg-white/5 px-3 py-1',
                    isStep1Valid
                      ? 'border-amber-300/30 text-amber-100'
                      : 'border-white/10 text-white/60',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'h-1.5 w-1.5 rounded-full',
                      isStep1Valid
                        ? 'bg-amber-300 shadow-[0_0_18px_rgba(245,212,105,0.45)]'
                        : 'bg-white/30',
                    ].join(' ')}
                  />
                  {isStep1Valid ? 'Step 1 validated' : 'Complete required fields'}
                </span>
              </div>
            </div>

            {/* Step progress bar */}
            <div className='relative'>
              <div className='absolute left-0 right-0 top-3 h-px bg-gradient-to-r from-amber-300/10 via-white/10 to-amber-300/10' />
              <div className='relative flex items-center justify-between'>
                {Array.from({ length: stepCount }).map((_, idx) => {
                  const stepNo = idx + 1;
                  const isActive = stepNo === activeStep;
                  const isDone = stepNo < activeStep || (stepNo === activeStep && isStep1Valid);

                  return (
                    <div key={stepNo} className='flex flex-col items-center gap-2'>
                      <div
                        className={[
                          'h-6 w-6 rounded-full flex items-center justify-center border',
                          isDone
                            ? 'border-amber-300/35 bg-amber-400/15 shadow-[0_0_26px_rgba(245,212,105,0.22)]'
                            : 'border-white/10 bg-white/5',
                        ].join(' ')}
                        aria-label={`Step ${stepNo}`}
                      >
                        <div className='text-[11px] font-semibold text-amber-100/90'>
                          {isActive ? stepNo : isDone ? '✓' : stepNo}
                        </div>
                      </div>
                      <div className='text-[11px] text-white/55'>
                        {stepNo === 1
                          ? 'Journey'
                          : stepNo === 2
                            ? 'Vehicle'
                            : stepNo === 3
                              ? 'Payment'
                              : 'Confirm'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className='mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start'>
            {/* Left Side */}
            <div className='space-y-5'>
              <TravelRouteSection />
              <JourneySelectedSummary />
              <PassengerLuggageSelector />

              {/* Premium conditional block */}
              <div className='rounded-2xl border border-white/10 bg-white/5 px-5 py-4'>
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
            </div>

            {/* Right Side */}
            <div className='flex flex-col gap-4'>
              <div className='rounded-2xl border border-white/10 bg-white/5 p-4'>
                <CalendarPlaceholder />
              </div>

              <div className='rounded-2xl border border-white/10 bg-white/5 p-4'>
                <FlightInformationSection />
              </div>

              {onNext && (
                <button
                  onClick={onNext}
                  disabled={!isStep1Valid}
                  className={[
                    'w-full rounded-xl px-6 py-4 flex items-center justify-center gap-3 font-semibold',
                    'transition-all duration-200',
                    isStep1Valid
                      ? 'bg-[radial-gradient(ellipse_at_top,_rgba(245,212,105,0.45),_rgba(245,212,105,0.08),_transparent_70%)] border border-amber-300/40 text-amber-50 hover:shadow-[0_0_0_4px_rgba(245,212,105,0.14),0_22px_90px_rgba(245,212,105,0.12)] cursor-pointer'
                      : 'bg-white/5 border border-white/10 text-white/40 cursor-not-allowed opacity-60',
                  ].join(' ')}
                >
                  <span className='flex items-center gap-2'>
                    <span>Continue</span>
                    <span className='text-[11px] font-medium text-white/60'>
                      {isStep1Valid ? 'to Vehicle Selection' : 'Complete required fields'}
                    </span>
                  </span>
                  <ArrowRight className='h-5 w-5' />
                </button>
              )}

              <div className='rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-5'>
                <p className='text-sm font-semibold text-white'>Concierge Preview</p>
                <ul className='mt-3 space-y-2 text-sm text-white/70'>
                  <li className='flex gap-2'>
                    <span className='mt-1 h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_18px_rgba(245,212,105,0.35)]' />
                    Vehicle & fleet composition
                  </li>
                  <li className='flex gap-2'>
                    <span className='mt-1 h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_18px_rgba(245,212,105,0.35)]' />
                    Instant pricing snapshot
                  </li>
                  <li className='flex gap-2'>
                    <span className='mt-1 h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_18px_rgba(245,212,105,0.35)]' />
                    Secure payment via Stripe
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </GlassmorphismCard>
    </div>
  );
}
