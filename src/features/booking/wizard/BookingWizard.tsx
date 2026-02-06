'use client';

import { ZustandBookingTypeDock } from '@/components/booking/ZustandBookingTypeDock';
import { Container } from '@/components/layout/Container';
import { BookingStepper } from '@/components/ui/booking-stepper/BookingStepper';
import { useBookingState } from '@/hooks/useBookingState';
import { useEffect, useRef } from 'react';

import { WizardFooter } from './components/WizardFooter';
import { Step1BookingDetails } from './steps/Step1BookingDetails';
import { Step2Services } from './steps/Step2Services';
import { Step3Summary } from './steps/Step3Summary';
import { Step4Confirmation } from './steps/Step4Confirmation';

// STEPS PENTRU STEPPER
const BOOKING_STEPS = [
  { id: 1, label: 'Trip Info', description: '', clickable: true },
  { id: 2, label: 'Services', description: '', clickable: true },
  { id: 3, label: 'Payment', description: '', clickable: true },
  { id: 4, label: 'Confirmation', description: '', clickable: false },
];

export function BookingWizard() {
  const { currentStep, completedSteps, setCurrentStep, canProceedToStep, nextStep, prevStep } =
    useBookingState();

  // Ref pentru containerul principal al wizard-ului
  const wizardContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll la schimbarea step-ului (soluție standard din practică)
  useEffect(() => {
    // Skip initial render (step 1)
    if (currentStep === 1) return;

    // Single scroll method - no conflicts
    if (wizardContainerRef.current) {
      wizardContainerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  }, [currentStep]);

  const handleStepClick = (stepNumber: number) => {
    if (canProceedToStep(stepNumber)) {
      setCurrentStep(stepNumber);
    }
  };

  return (
    <div className='w-full space-y-8 overflow-x-hidden'>
      {/* 🔹 BOOKING STEPPER AFARĂ (din formular) */}
      <div className='w-full flex justify-center py-4 sm:py-6 px-0 sm:px-2'>
        <div className='w-full max-w-lg flex justify-center items-center'>
          <div className='w-full max-w-xs sm:max-w-lg flex justify-center items-center mx-auto'>
            <BookingStepper
              steps={BOOKING_STEPS}
              currentStep={currentStep}
              completedSteps={completedSteps}
              onStepClick={handleStepClick}
              size='xs'
              animated={true}
              pulseOnCurrent={true}
              showLabels={true}
              labelPosition='bottom'
              spacing='compact'
            />
          </div>
        </div>
      </div>

      {/* 2️⃣ BOOKING FORM — LUXURY BOX */}
      <Container size='lg' className='flex justify-center !px-1 sm:!px-2'>
        <div
          ref={wizardContainerRef}
          className='
          w-full
          max-w-[1440px]
          mx-auto
          bg-black/40 backdrop-blur-xl
          border border-white/10
          rounded-3xl
          shadow-[0_18px_60px_rgba(0,0,0,0.6)]
          pt-4 pb-10 px-2 sm:px-4 space-y-14
        '
        >
          {/* 🔹 BOOKING TYPE DOCK ÎNĂUNTRU */}
          <div className='w-full flex justify-center pt-4 -mb-6'>
            <div className='w-full max-w-4xl'>
              <ZustandBookingTypeDock />
            </div>
          </div>

          {currentStep === 1 && <Step1BookingDetails onNext={nextStep} />}
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
    </div>
  );
}
