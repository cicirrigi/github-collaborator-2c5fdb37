'use client';

import { BookingStepper } from '@/components/ui/booking-stepper/BookingStepper';
import { useBookingState } from '@/hooks/useBookingState';
import { CardDateTime } from '../../components/step1/CardDateTime';
import { CardFlightNumber } from '../../components/step1/CardFlightNumber';
import { CardJourneyInfo } from '../../components/step1/CardJourneyInfo';
import { CardPassengersLuggage } from '../../components/step1/CardPassengersLuggage';
import { CardPickupDropoff } from '../../components/step1/CardPickupDropoff';

// STEPS PENTRU STEPPER
const STEP1_STEPS = [
  { id: 1, label: 'Details', description: 'Trip info', clickable: true },
  { id: 2, label: 'Services', description: 'Add-ons', clickable: true },
  { id: 3, label: 'Payment', description: 'Checkout', clickable: true },
  { id: 4, label: 'Done', description: 'Complete', clickable: false },
];

export function Step1BookingDetails() {
  const { currentStep, completedSteps, setCurrentStep, canProceedToStep } = useBookingState();

  const handleStepClick = (stepNumber: number) => {
    if (canProceedToStep(stepNumber)) {
      setCurrentStep(stepNumber);
    }
  };

  return (
    <div className='relative w-full max-w-[1000px] mx-auto rounded-2xl border border-white/10 bg-black/30 backdrop-blur-2xl shadow-[0_12px_48px_rgba(0,0,0,0.75)] p-6 overflow-hidden'>
      {/* SMOKE BLEND */}
      <div className='absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_20%,rgba(0,0,0,0.7),rgba(0,0,0,0.45),transparent_70%)] blur-[40px]' />

      {/* STEPPER ÎNĂUNTRU */}
      <div className='flex justify-center mb-12 relative z-10'>
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

      {/* ULTRA COMPACT 2-COLUMN GRID */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 relative z-0'>
        {/* LEFT COL */}
        <div className='space-y-6'>
          <CardPickupDropoff />
          <CardJourneyInfo />
          <CardFlightNumber />
        </div>

        {/* RIGHT COL */}
        <div className='space-y-6'>
          <CardDateTime />
          <CardPassengersLuggage />
        </div>
      </div>
    </div>
  );
}
