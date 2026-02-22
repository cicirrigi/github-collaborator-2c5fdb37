'use client';

import { useAuth } from '@/features/auth/context/AuthProvider';
import { PaymentCard } from './PaymentCard';
import { Step3AuthPrompt } from './Step3AuthPrompt';

/**
 * 🔐 AUTH-AWARE PAYMENT COMPONENT
 *
 * Simple conditional rendering based on authentication status:
 * - LOGGED IN: Show existing PaymentCard (zero changes)
 * - LOGGED OUT: Show AuthPrompt (to be created next)
 *
 * This component ensures no breaking changes for existing users
 * while enabling auth-aware booking flow for logged-out users.
 */
export function AuthAwarePayment() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className='vl-card'>
        <div className='text-center py-8'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400 mx-auto mb-4'></div>
          <p className='text-neutral-400 text-sm'>Checking authentication...</p>
        </div>
      </div>
    );
  }

  // LOGGED IN: Show existing PaymentCard (unchanged behavior)
  if (isAuthenticated) {
    return <PaymentCard />;
  }

  // LOGGED OUT: Show Step3AuthPrompt with embedded AuthContainer
  return <Step3AuthPrompt />;
}
