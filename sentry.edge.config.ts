import * as Sentry from '@sentry/nextjs';
import { sentryCommonConfig, getSentryDSN } from '@/lib/sentry.common';

const edgeDSN = getSentryDSN('backend'); // Edge uses backend DSN

// Only initialize Sentry if DSN is available
if (edgeDSN) {
  Sentry.init({
    // 🎯 Edge Runtime Sentry DSN (uses backend project)
    dsn: edgeDSN,

    // 📊 Basic configuration for edge runtime (minimal config)
    environment: sentryCommonConfig.environment,
    release: sentryCommonConfig.release,
    tracesSampleRate: 0.1, // Lower sampling for edge runtime
    debug: false, // Always false for edge runtime

    // 🎨 Edge-specific tags
    initialScope: {
      tags: {
        ...sentryCommonConfig.initialScope.tags,
        component: 'edge',
        platform: 'edge-runtime',
      },
    },
  });
}
