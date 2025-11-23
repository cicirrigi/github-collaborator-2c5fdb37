'use client';

import { ZustandBookingTypeDock } from '@/components/booking/ZustandBookingTypeDock';
import { Container } from '@/components/layout/Container';
import { BookingStepper } from '@/components/ui/booking-stepper/BookingStepper';
import { useBookingState } from '@/hooks/useBookingState';

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

  const handleStepClick = (stepNumber: number) => {
    if (canProceedToStep(stepNumber)) {
      setCurrentStep(stepNumber);
    }
  };

  return (
    <div className='w-full space-y-8'>
      {/* 🔹 BOOKING STEPPER AFARĂ (din formular) */}
      <div className='w-full flex justify-center py-4 sm:py-6 px-2 sm:px-4'>
        <div className='w-full max-w-lg'>
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

      {/* 2️⃣ BOOKING FORM — LUXURY BOX */}
      <Container size='lg' className='flex justify-center !px-2 sm:!px-6'>
        <div
          className='
            w-full sm:max-w-5xl
            bg-black/40 backdrop-blur-xl
            border border-white/10
            rounded-2xl sm:rounded-3xl shadow-[0_18px_60px_rgba(0,0,0,0.6)]
            pt-1 pb-2 px-2 sm:pt-4 sm:pb-8 sm:px-8 space-y-4 sm:space-y-10
          '
        >
          {/* 🔹 BOOKING TYPE DOCK ÎNĂUNTRU */}
          <div className='w-full flex justify-center pt-4 -mb-6'>
            <div className='w-full max-w-4xl'>
              <ZustandBookingTypeDock />
            </div>
          </div>

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
    </div>
  );
}
