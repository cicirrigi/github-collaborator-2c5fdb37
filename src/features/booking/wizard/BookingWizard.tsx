'use client';

import { Container } from '@/components/layout/Container';
import { BookingStepper } from '@/components/ui/booking-stepper/BookingStepper';
import { useBookingState } from '@/hooks/useBookingState';

import { WizardFooter } from './components/WizardFooter';
import { Step1BookingDetails } from './steps/Step1BookingDetails';
import { Step2Services } from './steps/Step2Services';
import { Step3Summary } from './steps/Step3Summary';
import { Step4Confirmation } from './steps/Step4Confirmation';

// 🎯 4 PAȘI PENTRU BOOKING WORKFLOW (CU CIFRE)
const BOOKING_WIZARD_STEPS = [
  {
    id: 1,
    label: 'Trip Details',
    description: 'Type, locations & dates',
    clickable: true,
  },
  {
    id: 2,
    label: 'Services',
    description: 'Add-ons & pricing',
    clickable: true,
  },
  {
    id: 3,
    label: 'Payment',
    description: 'Review & checkout',
    clickable: true,
  },
  {
    id: 4,
    label: 'Confirmation',
    description: 'Booking complete',
    clickable: false,
  },
];

export function BookingWizard() {
  const { currentStep, completedSteps, setCurrentStep, nextStep, prevStep, canProceedToStep } =
    useBookingState();

  const handleStepClick = (stepNumber: number) => {
    if (canProceedToStep(stepNumber)) {
      setCurrentStep(stepNumber);
    }
  };

  return (
    <>
      {/* 1️⃣ STEP 1 — STEP PROGRESS BAR (FULL WIDTH, CENTRAT) */}
      <div className='w-full flex justify-center py-10'>
        <div className='w-full max-w-5xl'>
          <BookingStepper
            steps={BOOKING_WIZARD_STEPS}
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={handleStepClick}
            size='md'
            animated={true}
            pulseOnCurrent={true}
            showLabels={true}
            labelPosition='bottom'
          />
        </div>
      </div>

      {/* 2️⃣ STEP 2 — LUXURY BOX */}
      <Container size='lg' className='flex justify-center'>
        <div
          className='
            w-full max-w-[1200px]
            bg-black/40 backdrop-blur-xl
            border border-white/10
            rounded-3xl shadow-[0_18px_60px_rgba(0,0,0,0.6)]
            p-8 space-y-10
          '
        >
          {currentStep === 1 && <Step1BookingDetails />}
          {currentStep === 2 && <Step2Services />}
          {currentStep === 3 && <Step3Summary />}
          {currentStep === 4 && <Step4Confirmation />}

          <WizardFooter
            currentStep={currentStep}
            totalSteps={4}
            onNext={nextStep}
            onPrev={prevStep}
          />
        </div>
      </Container>
    </>
  );
}
