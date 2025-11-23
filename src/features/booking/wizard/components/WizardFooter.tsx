// WizardFooter.tsx - Back/Next buttons
interface WizardFooterProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
}

export function WizardFooter({ currentStep, totalSteps, onNext, onPrev }: WizardFooterProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className='flex justify-between items-center pt-8'>
      {/* Back Button */}
      {!isFirstStep ? (
        <button
          onClick={onPrev}
          className='px-6 py-3 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all duration-200'
        >
          ← Back
        </button>
      ) : (
        <div /> // Empty spacer
      )}

      {/* Next/Complete Button */}
      {!isLastStep ? (
        <button
          onClick={onNext}
          className='px-6 py-3 rounded-xl bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition-all duration-200'
        >
          Next →
        </button>
      ) : (
        <button className='px-6 py-3 rounded-xl bg-green-500 text-black font-semibold hover:bg-green-400 transition-all duration-200'>
          Complete Booking ✓
        </button>
      )}
    </div>
  );
}
