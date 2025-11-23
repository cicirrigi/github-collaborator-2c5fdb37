import type { TravelPlan } from './types';

interface RoutePreviewProps {
  plan: TravelPlan;
}

export const RoutePreview = ({ plan }: RoutePreviewProps) => {
  return (
    <div className='min-h-80 rounded-xl border border-gray-200/50 bg-gray-50/50 p-6 dark:border-gray-700/50 dark:bg-gray-800/50'>
      <div className='mb-4 flex items-center gap-3'>
        <div className='h-5 w-5 rounded-full bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)]' />
        <h4 className='font-semibold text-gray-700 dark:text-gray-300'>Route Preview</h4>
      </div>

      <div className='mb-4 flex aspect-video items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800'>
        <div className='text-center text-gray-500'>
          <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700'>
            🗺️
          </div>
          <p className='text-sm'>Interactive map</p>
          <p className='mt-1 text-xs'>Coming soon</p>
        </div>
      </div>

      {/* Route Summary */}
      {(plan.pickup || plan.destination || plan.additionalStops.length > 0) && (
        <div className='space-y-2'>
          <h5 className='text-sm font-medium text-gray-600 dark:text-gray-400'>Route Summary:</h5>
          <div className='max-h-32 space-y-1 overflow-y-auto text-sm text-gray-700 dark:text-gray-300'>
            {plan.pickup && (
              <div className='flex items-center gap-2'>
                <span className='h-2 w-2 flex-shrink-0 rounded-full bg-green-500'></span>
                <span className='truncate'>{plan.pickup.address}</span>
              </div>
            )}
            {plan.additionalStops.map((stop, index) => (
              <div key={stop.id} className='flex items-center gap-2'>
                <span className='h-2 w-2 flex-shrink-0 rounded-full bg-blue-500'></span>
                <span className='truncate'>{stop.address || `Stop ${index + 1}`}</span>
              </div>
            ))}
            {plan.destination && (
              <div className='flex items-center gap-2'>
                <span className='h-2 w-2 flex-shrink-0 rounded-full bg-red-500'></span>
                <span className='truncate'>{plan.destination.address}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
