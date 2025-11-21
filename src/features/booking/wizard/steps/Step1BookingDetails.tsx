'use client';

import { BookingStepper } from '@/components/ui/booking-stepper/BookingStepper';
import { useBookingState } from '@/hooks/useBookingState';
import { getBookingRule } from '@/lib/booking/booking-rules';
import { BespokeRequirements } from '../../components/step1/BespokeRequirements';
import { CardAdditionalStops } from '../../components/step1/CardAdditionalStops';
import { CardReturnAdditionalStops } from '../../components/step1/CardReturnAdditionalStops';
import { DaysDurationSelector } from '../../components/step1/DaysDurationSelector';
import { HoursDurationSelector } from '../../components/step1/HoursDurationSelector';
import { SimpleTestCard } from '../../components/step1/SimpleTestCard';
import { WeatherWidget } from '../../components/step1/WeatherWidget';

// STEPS PENTRU STEPPER
const STEP1_STEPS = [
  { id: 1, label: 'Details', description: 'Trip info', clickable: true },
  { id: 2, label: 'Services', description: 'Add-ons', clickable: true },
  { id: 3, label: 'Payment', description: 'Checkout', clickable: true },
  { id: 4, label: 'Done', description: 'Complete', clickable: false },
];

export function Step1BookingDetails() {
  const { currentStep, completedSteps, setCurrentStep, canProceedToStep, bookingType } =
    useBookingState();
  const bookingRule = getBookingRule(bookingType);

  const handleStepClick = (stepNumber: number) => {
    if (canProceedToStep(stepNumber)) {
      setCurrentStep(stepNumber);
    }
  };

  return (
    <>
      {/* 🔹 STEPPER */}
      <div className='flex justify-center mb-12'>
        <div className='w-full max-w-lg'>
          <BookingStepper
            steps={STEP1_STEPS}
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={handleStepClick}
            size='sm'
            animated={true}
            pulseOnCurrent={true}
            showLabels={true}
            labelPosition='bottom'
            spacing='compact'
          />
        </div>
      </div>

      {/* 🔹 PREMIUM GRID */}
      <div className='vl-grid-premium'>
        {/* LEFT COLUMN */}
        <SimpleTestCard />
        {bookingRule.showDuration && bookingType === 'hourly' && <HoursDurationSelector />}
        {bookingType === 'daily' && <DaysDurationSelector />}
        {(bookingType === 'hourly' || bookingType === 'daily') && <WeatherWidget />}

        {/* RIGHT COLUMN */}
        <div className='space-y-3'>
          {bookingType !== 'bespoke' && <CardAdditionalStops />}
          {bookingType === 'oneway' && <WeatherWidget />}
        </div>
        {bookingType === 'return' && <CardReturnAdditionalStops />}
      </div>

      {/* FULL WIDTH BESPOKE CARD */}
      {bookingType === 'bespoke' && <BespokeRequirements />}
    </>
  );
}
