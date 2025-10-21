import * as Sentry from '@sentry/nextjs';

import { env } from '@/lib/env';

const SENTRY_DSN = env.SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,

    // Performance monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Session replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Environment
    environment: process.env.NODE_ENV || 'development',

    // User context
    beforeSend(event) {
      // Filter out development errors
      if (process.env.NODE_ENV === 'development') {
        return null;
      }
      return event;
    },

    // Custom error filtering
    ignoreErrors: [
      // Browser extensions
      'Non-Error promise rejection captured',
      'ResizeObserver loop limit exceeded',
      // Network errors
      'NetworkError',
      'Failed to fetch',
    ],
  });
}

export { Sentry };
