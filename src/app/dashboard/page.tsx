/**
 * 🏠 Dashboard Page - Vantage Lane 2.0
 *
 * Dashboard simplu pentru testarea flow-ului auth
 * Doar mesaj success + sign out - modular va fi extins ulterior
 */

import { Suspense } from 'react';
import type { Metadata } from 'next';

import { DashboardContent } from './components/DashboardContent';

export const metadata: Metadata = {
  title: 'Dashboard | Vantage Lane',
  description: 'Vantage Lane luxury chauffeur dashboard',
};

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoadingFallback />}>
      <DashboardContent />
    </Suspense>
  );
}

/**
 * Loading fallback pentru dashboard
 */
function DashboardLoadingFallback() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950'>
      <div className='animate-pulse text-center'>
        <div className='h-12 w-12 mx-auto rounded-full border-2 border-[var(--brand-primary)] border-t-transparent animate-spin mb-4' />
        <p className='text-neutral-600 dark:text-neutral-400'>Loading dashboard...</p>
      </div>
    </div>
  );
}
