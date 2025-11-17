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
    <div className='vl-step-container'>
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
        <CardPickupDropoff />
        <CardDateTime />
        <CardJourneyInfo />
        <CardPassengersLuggage />
        <CardFlightNumber />
      </div>
    </div>
  );
}
