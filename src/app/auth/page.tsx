/**
 * 🔐 Auth Page - Vantage Lane 2.0
 *
 * Universal auth page cu mode din URL query
 * /auth?mode=signin sau /auth?mode=signup
 */

import { Suspense } from 'react';
import { AuthContainer } from '@/features/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Vantage Lane',
  description: 'Sign in to your Vantage Lane luxury chauffeur account',
};

interface AuthPageProps {
  searchParams: {
    mode?: 'signin' | 'signup';
    redirect?: string;
  };
}

export default function AuthPage({ searchParams }: AuthPageProps) {
  const mode = searchParams.mode || 'signin';
  const redirectTo = searchParams.redirect || '/dashboard';

  return (
    <Suspense fallback={<AuthLoadingFallback />}>
      <AuthContainer defaultMode={mode} redirectTo={redirectTo} />
    </Suspense>
  );
}

/**
 * Loading fallback
 */
function AuthLoadingFallback() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='animate-pulse'>
        <div className='h-12 w-12 rounded-full border-2 border-[var(--brand-primary)] border-t-transparent animate-spin' />
      </div>
    </div>
  );
}
