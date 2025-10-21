import type { TravelPlan } from './types';

interface TravelSummaryProps {
  plan: TravelPlan;
  isValid: boolean;
  showReturn: boolean;
}

export const TravelSummary = ({ plan, isValid, showReturn }: TravelSummaryProps) => {
  return (
    <div className='border-t border-gray-200 pt-6 dark:border-gray-700'>
      <div className='flex items-center justify-between'>
        <div className='text-sm text-gray-600 dark:text-gray-400'>
          {isValid ? (
            <span className='text-green-600 dark:text-green-400'>✓ Ready to proceed</span>
          ) : (
            <span className='text-amber-600 dark:text-amber-400'>
              Please complete all required fields
            </span>
          )}
        </div>

        <div className='text-right'>
          <div className='text-sm text-gray-500'>
            {plan.additionalStops.length > 0 && (
              <span>{plan.additionalStops.length} additional stops</span>
            )}
          </div>
          {plan.pickupDate && plan.pickupTime && (
            <div className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              {plan.pickupDate.toLocaleDateString()} at {plan.pickupTime.label}
              {showReturn && plan.returnDate && plan.returnTime && (
                <span className='ml-2'>
                  → {plan.returnDate.toLocaleDateString()} at {plan.returnTime.label}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
