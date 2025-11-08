/**
 * 🚀 Sentry SERVER Config - Release Health Enabled
 */
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  // 🎯 Server-side Sentry DSN
  dsn:
    process.env.SENTRY_DSN_BACKEND ||
    'https://ea5d5059516c0c06fa7c89c51a428af9@o4510108108652544.ingest.de.sentry.io/4510314918838352',

  // 📊 Release Health Configuration
  release: process.env.VERCEL_GIT_COMMIT_SHA || process.env.npm_package_version || '1.0.0',
  environment: process.env.NODE_ENV || 'development',

  // 📝 Enable logs for server-side
  enableLogs: true,

  // Performance settings
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // 🔍 Server integrations
  integrations: [
    Sentry.consoleLoggingIntegration({
      levels: ['log', 'warn', 'error', 'info', 'debug'],
    }),
  ],

  // 🏷️ Backend-specific tags
  initialScope: {
    tags: {
      component: 'backend',
      platform: 'server',
      runtime: 'nodejs',
      brand: 'vantage-lane',
    },
  },

  // Server-specific config
  serverName: process.env.VERCEL_REGION || 'local-dev',
  maxBreadcrumbs: 50,
});
