'use client';

import { ZustandBookingTypeDock } from '@/components/booking/ZustandBookingTypeDock';
import { BookingStepper } from '@/components/ui/booking-stepper/BookingStepper';
import { WeatherWidgetCompact } from '@/components/ui/WeatherWidgetCompact';
import { useBookingState } from '@/hooks/useBookingState';
import { bookingSessionManager, PaymentState } from '@/lib/booking/session/BookingSessionManager';
import { useEffect, useRef } from 'react';

import { WizardFooter } from './components/WizardFooter';
import { Step1BookingDetails } from './steps/Step1BookingDetails';
import { Step2Services } from './steps/Step2Services';
import { Step3Summary } from './steps/Step3Summary';
import { Step4Confirmation } from './steps/Step4Confirmation';

export function BookingWizard() {
  const { currentStep, completedSteps, setCurrentStep, canProceedToStep, nextStep, prevStep } =
    useBookingState();

  // Helper to check if payment is completed
  const isPaymentCompleted = () => {
    const sessionStats = bookingSessionManager.getSessionStats();
    return sessionStats.hasActiveSession && sessionStats.paymentState === PaymentState.SUCCEEDED;
  };

  // STEPS PENTRU STEPPER - Dynamic based on payment state
  const BOOKING_STEPS = [
    { id: 1, label: 'Trip Info', description: '', clickable: true },
    { id: 2, label: 'Services', description: '', clickable: true },
    {
      id: 3,
      label: 'Payment',
      description: '',
      clickable: !isPaymentCompleted() || currentStep < 4,
    },
    { id: 4, label: 'Confirmation', description: '', clickable: false },
  ];

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
      <div className='flex justify-center px-1 sm:px-2 relative'>
        {/* 🌤️ WEATHER WIDGET - FLOATING ABOVE GREEN BORDER */}
        <div className='absolute top-2 right-2 z-50'>
          <WeatherWidgetCompact />
        </div>

        <div
          ref={wizardContainerRef}
          className='
          w-full
          max-w-[1440px]
          mx-auto
          backdrop-blur-md
          border border-white/10
          rounded-3xl
          shadow-[0_18px_60px_rgba(0,0,0,0.6)]
          pt-6 pb-12 px-3 sm:px-5 space-y-14
        '
          style={{
            background: `
              radial-gradient(ellipse 500px 250px at 50% 30%, rgba(203,178,106,0.10) 0%, transparent 70%),
              rgba(0,0,0,0.4)
            `,
            minHeight: '800px',
          }}
        >
          {/* 🔹 BOOKING TYPE DOCK ÎNĂUNTRU */}
          <div
            className='w-full flex justify-center pt-4 -mb-6 max-w-2xl mx-auto rounded-3xl px-4 py-3'
            style={{ border: '1px solid rgba(255, 193, 7, 0.15)' }}
          >
            <ZustandBookingTypeDock />
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
      </div>
    </div>
  );
}
