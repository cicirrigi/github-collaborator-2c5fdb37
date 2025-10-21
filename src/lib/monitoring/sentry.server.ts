import * as Sentry from '@sentry/nextjs';

import { env } from '@/lib/env';

const SENTRY_DSN = env.SENTRY_DSN;

if (SENTRY_DSN && SENTRY_DSN.length > 0) {
  Sentry.init({
    dsn: SENTRY_DSN,

    // Performance monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Environment
    environment: process.env.NODE_ENV || 'development',

    // Server-specific configuration
    serverName: process.env.VERCEL_REGION || 'local',

    // Custom error filtering
    beforeSend(event) {
      // Add server context
      if (event.extra) {
        event.extra.server = true;
        event.extra.region = process.env.VERCEL_REGION;
      }

      return event;
    },

    integrations: [
      // Add performance monitoring
      Sentry.httpIntegration(),
    ],
  });
}

export { Sentry };
