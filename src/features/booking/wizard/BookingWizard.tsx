'use client';

import { ZustandBookingTypeDock } from '@/components/booking/ZustandBookingTypeDock';
import { Container } from '@/components/layout/Container';
import { useBookingState } from '@/hooks/useBookingState';

import { WizardFooter } from './components/WizardFooter';
import { Step1BookingDetails } from './steps/Step1BookingDetails';
import { Step2Services } from './steps/Step2Services';
import { Step3Summary } from './steps/Step3Summary';
import { Step4Confirmation } from './steps/Step4Confirmation';

export function BookingWizard() {
  const { currentStep, nextStep, prevStep } = useBookingState();

  return (
    <>
      {/* 🔹 BOOKING TYPE DOCK AFARĂ */}
      <div className='w-full flex justify-center py-6'>
        <div className='w-full max-w-4xl'>
          <ZustandBookingTypeDock />
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
