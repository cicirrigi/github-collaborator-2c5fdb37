'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { ShieldCheck } from 'lucide-react';
import { useCallback } from 'react';
import { Step3InlineAuthForm } from './Step3InlineAuthForm';

/**
 * 🔐 STEP 3 AUTH PROMPT
 *
 * Authentication prompt specifically designed for Step 3 of booking flow.
 * Embeds existing AuthContainer with booking context.
 *
 * Features:
 * - Reuses existing AuthContainer (no code duplication)
 * - Will save booking state before auth (to be implemented in Step 3)
 * - Will restore booking state after successful auth
 * - Matches Step 3 design patterns (vl-card styling)
 */
export function Step3AuthPrompt() {
  const bookingState = useBookingState();

  // Save current booking state to localStorage before auth
  // This preserves user progress across login flow
  const saveBookingState = useCallback(() => {
    const sessionData = {
      bookingType: bookingState.bookingType,
      tripConfiguration: bookingState.tripConfiguration,
      pricingState: bookingState.pricingState,
      currentStep: bookingState.currentStep,
      completedSteps: bookingState.completedSteps,
    };

    localStorage.setItem('pendingBookingState', JSON.stringify(sessionData));
  }, [bookingState]);

  // Handle when user starts interacting with auth forms
  const handleBeforeAuth = useCallback(() => {
    saveBookingState();
  }, [saveBookingState]);

  return (
    <div className='vl-card'>
      {/* Content */}
      <div className='vl-card-inner'>
        <div className='space-y-6'>
          {/* Auth Container - Clean Design */}
          <div
            className='space-y-4'
            onFocus={handleBeforeAuth} // Save state when user starts interacting with auth
          >
            <Step3InlineAuthForm defaultMode='signin' redirectTo='/booking' />
          </div>

          {/* Bottom Info - Clean with Hover Tooltip */}
          <div className='flex items-center justify-between pt-4 border-t border-white/5'>
            <p className='text-xs text-neutral-500'>Secure authentication powered by Supabase</p>

            {/* Info Icon with Hover Tooltip */}
            <div className='group relative'>
              <ShieldCheck className='w-4 h-4 text-neutral-400 hover:text-blue-400 transition-colors cursor-help' />

              {/* Tooltip */}
              <div className='absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50'>
                <div className='bg-neutral-800 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap border border-neutral-700 shadow-lg'>
                  Your progress is automatically saved
                  <div className='absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-neutral-800'></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
