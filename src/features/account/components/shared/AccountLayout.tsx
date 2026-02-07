/**
 * 🏗️ Account Layout - Main Layout Container
 *
 * Layout principal pentru sistemul de conturi
 * Responsive cu sidebar, mobile-friendly
 */

'use client';

import { useAuth } from '@/features/auth/context/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AccountSidebarDesktop } from '../desktop/AccountSidebarDesktop';
import { AccountSidebarMobile } from '../mobile/AccountSidebarMobile';

interface AccountLayoutProps {
  readonly children: React.ReactNode;
  readonly title: string;
  readonly description?: string;
}

export function AccountLayout({ children, title, description }: AccountLayoutProps) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Redirect to sign in if not authenticated (after loading complete)
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin');
    }
  }, [isLoading, isAuthenticated, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-pulse'>
          <div className='h-12 w-12 rounded-full border-2 border-amber-500 border-t-transparent animate-spin' />
        </div>
      </div>
    );
  }

  // Require authentication
  if (!user) {
    return (
      <div className='min-h-screen flex items-center justify-center p-6'>
        <div className='text-center max-w-md'>
          <h1 className='text-2xl font-bold text-neutral-900 dark:text-white mb-4'>
            Authentication Required
          </h1>
          <p className='text-neutral-600 dark:text-neutral-400 mb-6'>
            Please sign in to access your account dashboard.
          </p>
          <a
            href='/auth/signin'
            className='inline-flex items-center justify-center px-6 py-3 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition-colors'
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-neutral-50 dark:bg-neutral-950'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex gap-8'>
          {/* Desktop Sidebar */}
          <div className='hidden lg:block'>
            <AccountSidebarDesktop />
          </div>

          {/* Main Content */}
          <main className='flex-1 min-w-0'>
            {/* Mobile Header */}
            <div className='lg:hidden mb-6'>
              <AccountMobileHeader title={title} onMenuToggle={() => setIsMobileMenuOpen(true)} />
            </div>

            {/* Page Header */}
            <div className='hidden lg:block mb-8'>
              <AccountPageHeader title={title} {...(description && { description })} />
            </div>

            {/* Page Content */}
            <div className='bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm'>
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AccountSidebarMobile isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </div>
  );
}

interface AccountMobileHeaderProps {
  readonly title: string;
  readonly onMenuToggle: () => void;
}

function AccountMobileHeader({ title, onMenuToggle }: AccountMobileHeaderProps) {
  return (
    <div className='flex items-center justify-between mb-4'>
      <h1 className='text-2xl font-bold text-neutral-900 dark:text-white'>{title}</h1>

      <button
        onClick={onMenuToggle}
        className='p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors lg:hidden'
        aria-label='Open navigation menu'
      >
        <div className='w-5 h-5 text-neutral-700 dark:text-neutral-300'>☰</div>
      </button>
    </div>
  );
}

interface AccountPageHeaderProps {
  readonly title: string;
  readonly description?: string;
}

function AccountPageHeader({ title, description }: AccountPageHeaderProps) {
  return (
    <div>
      <h1 className='text-3xl font-bold text-neutral-900 dark:text-white'>{title}</h1>
      {description && <p className='text-neutral-600 dark:text-neutral-400 mt-2'>{description}</p>}
    </div>
  );
}
