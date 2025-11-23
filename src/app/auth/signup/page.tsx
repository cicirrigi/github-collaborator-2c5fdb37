/**
 * 🔐 Sign Up Page - Vantage Lane 2.0
 *
 * Dedicated sign up page at /auth/signup
 */

import { Suspense } from 'react';
import { AuthContainer } from '@/features/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up | Vantage Lane',
  description: 'Create your Vantage Lane luxury chauffeur account',
};

interface SignUpPageProps {
  searchParams: Promise<{
    redirect?: string;
  }>;
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;
  const redirectTo = params.redirect || '/dashboard';

  return (
    <Suspense fallback={<AuthLoadingFallback />}>
      <AuthContainer defaultMode='signup' redirectTo={redirectTo} />
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
