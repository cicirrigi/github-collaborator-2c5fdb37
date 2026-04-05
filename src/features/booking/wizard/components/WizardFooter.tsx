// WizardFooter.tsx - Back/Next buttons
import { useBookingState } from '@/hooks/useBookingState';

interface WizardFooterProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
}

export function WizardFooter({ currentStep, totalSteps, onNext, onPrev }: WizardFooterProps) {
  const { resetTrip, setCurrentStep, validateStep2Complete, calculatePricing } = useBookingState();

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;
  const isConfirmationStep = currentStep === 4; // Step 4 is confirmation

  // Check if current step is valid before allowing proceed
  const isCurrentStepValid = currentStep === 2 ? validateStep2Complete().isValid : true;

  const handleStartNewBooking = () => {
    resetTrip();
    setCurrentStep(1);
  };

  // 🆕 Handle Step 2 -> Step 3 transition with pricing recalculation
  const handleNextFromStep2 = async () => {
    console.log('🔄 Step 2 -> Step 3: Recalculating pricing with servicePackages selections');
    // Recalculate pricing to include user's service selections
    await calculatePricing();
    // Then proceed to Step 3
    onNext();
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
          onClick={currentStep === 2 ? handleNextFromStep2 : onNext}
          disabled={!isCurrentStepValid}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 backdrop-filter backdrop-blur-md border shadow-lg ${
            isCurrentStepValid
              ? 'bg-amber-400/15 hover:bg-amber-400/25 border-amber-300/30 text-amber-50 hover:shadow-amber-400/20 cursor-pointer'
              : 'bg-neutral-500/10 border-neutral-600/30 text-neutral-400 cursor-not-allowed opacity-50'
          }`}
        >
          {currentStep === 2 && !isCurrentStepValid ? (
            'Select Vehicle to Continue'
          ) : currentStep === 2 ? (
            <>
              <span className='flex'>
                {'Continue To Payment'.split('').map((letter, index) => (
                  <span
                    key={index}
                    className='inline-block'
                    style={{
                      animation: `shimmerWave 4s ease-in-out infinite`,
                      animationDelay: `${index * 0.08}s`,
                    }}
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </span>
                ))}
              </span>
              <style
                dangerouslySetInnerHTML={{
                  __html: `
                  @keyframes shimmerWave {
                    0% {
                      color: #fef3c7;
                    }
                    25% {
                      color: #ffffff;
                      text-shadow: 0 0 8px rgba(255,255,255,0.6);
                    }
                    50% {
                      color: #fef3c7;
                    }
                    100% {
                      color: #fef3c7;
                    }
                  }
                `,
                }}
              />
            </>
          ) : (
            'Next →'
          )}
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
