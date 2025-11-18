'use client';

import { BookingStepper } from '@/components/ui/booking-stepper/BookingStepper';
import { useBookingState } from '@/hooks/useBookingState';
import { CardAdditionalStops } from '../../components/step1/CardAdditionalStops';
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
        <SimpleTestCard />
        <CardAdditionalStops />
        <WeatherWidget />
      </div>
    </div>
  );
}
