// WizardFooter.tsx - Back/Next buttons
import { useBookingState } from '@/hooks/useBookingState';

interface WizardFooterProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
}

export function WizardFooter({ currentStep, totalSteps, onNext, onPrev }: WizardFooterProps) {
  const { resetTrip, setCurrentStep } = useBookingState();

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;
  const isConfirmationStep = currentStep === 4; // Step 4 is confirmation

  const handleStartNewBooking = () => {
    resetTrip();
    setCurrentStep(1);
  };

  return (
    <div className='flex justify-between items-center pt-8'>
      {/* Back Button - Hidden on Step 4 (confirmation) */}
      {!isFirstStep && !isConfirmationStep ? (
        <button
          onClick={onPrev}
          className='px-6 py-3 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all duration-200'
        >
          ← Back
        </button>
      ) : (
        <div /> // Empty spacer
      )}

      {/* Next/Complete/Start New Button - Hidden on Step 1 since Next is integrated in form */}
      {!isLastStep && !isFirstStep ? (
        <button
          onClick={onNext}
          className='px-6 py-3 rounded-xl bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition-all duration-200'
        >
          Next →
        </button>
      ) : isFirstStep ? (
        <div /> // Empty spacer for Step 1 - Next button is integrated in form
      ) : isConfirmationStep ? (
        <button
          onClick={handleStartNewBooking}
          className='px-6 py-3 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-all duration-200'
        >
          Start New Booking
        </button>
      ) : (
        <button
          onClick={onNext}
          className='px-6 py-3 rounded-xl bg-green-500 text-black font-semibold hover:bg-green-400 transition-all duration-200'
        >
          Complete Booking ✓
        </button>
      )}
    </div>
  );
}
