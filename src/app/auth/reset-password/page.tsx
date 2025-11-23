/**
 * 🔐 Reset Password Page - Vantage Lane 2.0
 *
 * Pagină pentru setarea unei parole noi cu token
 * Folosește AuthContainer cu mode='reset-password'
 */

import { Suspense } from 'react';
import type { Metadata } from 'next';

import { AuthContainer } from '@/features/auth/components/AuthContainer';

export const metadata: Metadata = {
  title: 'Reset Password | Vantage Lane',
  description: 'Set a new password for your Vantage Lane luxury chauffeur account',
};

interface ResetPasswordPageProps {
  searchParams: Promise<{
    redirect?: string;
    access_token?: string;
  }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;
  const redirectTo = params.redirect || '/auth/signin';

  return (
    <Suspense fallback={<ResetPasswordLoadingFallback />}>
      <AuthContainer defaultMode='reset-password' redirectTo={redirectTo} />
    </Suspense>
  );
}

/**
 * Loading fallback pentru reset password
 */
function ResetPasswordLoadingFallback() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='animate-pulse'>
        <div className='h-12 w-12 rounded-full border-2 border-[var(--brand-primary)] border-t-transparent animate-spin' />
      </div>
    </div>
  );
}
