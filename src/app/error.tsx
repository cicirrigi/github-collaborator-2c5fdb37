'use client';

import { useEffect } from 'react';

import { log } from '@/lib/logger';
import { captureException } from '@/lib/monitoring';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error for monitoring
    log.error('Global error boundary triggered', error, {
      digest: error.digest,
      stack: error.stack,
    });

    // Send to Sentry
    captureException(error, {
      tags: {
        component: 'GlobalErrorBoundary',
        digest: error.digest,
      },
    });
  }, [error]);

  return (
    <div className='flex min-h-screen items-center justify-center bg-neutral-900 px-4'>
      <div className='w-full max-w-md text-center'>
        {/* Logo */}
        <div className='mb-8'>
          <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary'>
            <div className='text-xl font-bold text-white'>VL</div>
          </div>
        </div>

        {/* Error Message */}
        <div className='mb-8'>
          <h1 className='mb-4 text-2xl font-bold text-white'>Something went wrong</h1>
          <p className='leading-relaxed text-neutral-400'>
            We apologize for the inconvenience. Our team has been notified and is working to resolve
            this issue.
          </p>
        </div>

        {/* Error Details (Development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className='mb-8 rounded-lg bg-neutral-800 p-4 text-left'>
            <h3 className='mb-2 text-sm font-medium text-red-400'>Error Details (Development)</h3>
            <div className='overflow-x-auto font-mono text-xs text-neutral-300'>
              <div className='mb-2'>
                <strong>Message:</strong> {error.message}
              </div>
              {error.digest && (
                <div className='mb-2'>
                  <strong>Digest:</strong> {error.digest}
                </div>
              )}
              {error.stack && (
                <details className='mt-2'>
                  <summary className='cursor-pointer text-neutral-400'>Stack Trace</summary>
                  <pre className='mt-2 overflow-x-auto whitespace-pre-wrap text-xs'>
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className='space-y-4'>
          <button
            onClick={reset}
            className='hover:bg-brand-primary-600 w-full rounded-lg bg-brand-primary px-6 py-3 font-medium text-white transition-colors'
          >
            Try again
          </button>

          <button
            onClick={() => (window.location.href = '/')}
            className='w-full rounded-lg bg-neutral-800 px-6 py-3 font-medium text-white transition-colors hover:bg-neutral-700'
          >
            Go to homepage
          </button>
        </div>

        {/* Contact Support */}
        <div className='mt-8 border-t border-neutral-800 pt-8'>
          <p className='text-sm text-neutral-500'>
            Need help?{' '}
            <a
              href='/contact'
              className='hover:text-brand-primary-400 text-brand-primary transition-colors'
            >
              Contact our support team
            </a>
          </p>
        </div>

        {/* Error ID for support */}
        {error.digest && (
          <div className='mt-4'>
            <p className='text-xs text-neutral-600'>Error ID: {error.digest}</p>
          </div>
        )}
      </div>
    </div>
  );
}
