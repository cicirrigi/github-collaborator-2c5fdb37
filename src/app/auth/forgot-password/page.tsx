/**
 * 🔄 Forgot Password Page - Vantage Lane 2.0
 *
 * Pagină pentru solicitarea resetării parolei
 * Folosește AuthContainer cu mode='forgot-password'
 */

import { Suspense } from 'react';
import type { Metadata } from 'next';

import { AuthContainer } from '@/features/auth/components/AuthContainer';

export const metadata: Metadata = {
  title: 'Forgot Password | Vantage Lane',
  description: 'Reset your password for Vantage Lane luxury chauffeur account',
};

interface ForgotPasswordPageProps {
  searchParams: Promise<{
    redirect?: string;
  }>;
}

export default async function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  const params = await searchParams;
  const redirectTo = params.redirect || '/auth/signin';

  return (
    <Suspense fallback={<ForgotPasswordLoadingFallback />}>
      <AuthContainer defaultMode='forgot-password' redirectTo={redirectTo} />
    </Suspense>
  );
}

/**
 * Loading fallback pentru forgot password
 */
function ForgotPasswordLoadingFallback() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='animate-pulse'>
        <div className='h-12 w-12 rounded-full border-2 border-[var(--brand-primary)] border-t-transparent animate-spin' />
      </div>
    </div>
  );
}
