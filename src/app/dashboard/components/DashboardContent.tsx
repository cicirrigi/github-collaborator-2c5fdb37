/**
 * 🎯 Dashboard Content - Vantage Lane 2.0
 *
 * Componentă simplă pentru validarea flow-ului auth
 * Doar mesaj de succes + sign out - modular, va fi extins ulterior
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { signOut, getCurrentUser } from '@/features/auth/services/supabaseAuth';

interface User {
  email?: string;
  id?: string;
}

export function DashboardContent() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verifică auth status la mount
  const checkAuth = useCallback(async () => {
    try {
      const { user, error } = await getCurrentUser();
      if (error || !user) {
        // Nu e autentificat, redirect la login
        router.push('/auth/signin');
        return;
      }
      setUser(user);
    } catch {
      router.push('/auth/signin');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      const { error } = await signOut();

      if (error) {
        // Log error for debugging (production should use proper logger)
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('Sign out error:', error);
        }
        return;
      }

      // FORȚEAZĂ refresh complet pentru a curăța cache
      window.location.href = '/auth/signin';
    } catch (err) {
      // Log error for debugging (production should use proper logger)
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('Unexpected sign out error:', err);
      }
      // Fallback - forțează redirect oricum
      window.location.href = '/auth/signin';
    } finally {
      setIsSigningOut(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className='min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center p-6'>
        <div className='animate-pulse text-center'>
          <div className='h-12 w-12 mx-auto rounded-full border-2 border-[var(--brand-primary)] border-t-transparent animate-spin mb-4' />
          <p className='text-neutral-600 dark:text-neutral-400'>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center p-6'>
      <div className='max-w-md w-full text-center'>
        {/* Success Card */}
        <div className='bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-lg border border-neutral-200 dark:border-neutral-800'>
          {/* Success Icon */}
          <div className='w-16 h-16 mx-auto mb-6 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center'>
            <svg
              className='w-8 h-8 text-green-600 dark:text-green-400'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                clipRule='evenodd'
              />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className='text-2xl font-bold text-neutral-900 dark:text-white mb-2'>
            ✅ Ești logat!
          </h1>

          <p className='text-neutral-600 dark:text-neutral-400 mb-2'>
            Autentificarea a fost realizată cu succes în sistemul Vantage Lane.
          </p>

          {user && (
            <p className='text-sm text-neutral-500 dark:text-neutral-500 mb-8'>
              Welcome, {user.email}
            </p>
          )}

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className='w-full py-3 px-6 bg-[var(--brand-primary)] text-[var(--background-dark)] font-medium rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-[var(--brand-primary)]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
          >
            {isSigningOut ? (
              <span className='flex items-center justify-center gap-2'>
                <svg className='animate-spin h-4 w-4' viewBox='0 0 24 24'>
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                    fill='none'
                  />
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  />
                </svg>
                Signing out...
              </span>
            ) : (
              'Sign Out'
            )}
          </button>

          {/* Note for development */}
          <p className='text-xs text-neutral-500 dark:text-neutral-500 mt-6'>
            Dashboard modular va fi extins în următoarea fază
          </p>
        </div>
      </div>
    </div>
  );
}
