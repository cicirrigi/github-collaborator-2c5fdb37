import * as Sentry from '@sentry/nextjs';

Sentry.init({
  // 🎯 Frontend Sentry Project DSN
  dsn:
    process.env.NEXT_PUBLIC_SENTRY_DSN_FRONTEND ||
    'https://055ba40281f76279b89d6c91404d4139@o4510108108652544.ingest.de.sentry.io/4510314634149968',

  // 📊 Release Health Configuration
  release: process.env.VERCEL_GIT_COMMIT_SHA || process.env.npm_package_version || '1.0.0',
  environment: process.env.NODE_ENV || 'development',

  // 🔍 Frontend-specific: Session Replay pentru debugging
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

  // 📝 Enable structured logging (v10+ syntax)
  enableLogs: true,

  // 📊 Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // 🎨 Frontend-specific tags
  initialScope: {
    tags: {
      component: 'frontend',
      platform: 'web',
      brand: 'vantage-lane',
    },
  },

  // 🔍 Integrations - focus on logs only for now
  integrations: [
    // Send console.log, console.warn, and console.error calls as logs to Sentry
    Sentry.consoleLoggingIntegration({ levels: ['log', 'warn', 'error', 'info'] }),
    // Performance monitoring will be added later
    // Session Replay will be configured separately if needed
    // new Sentry.Replay() // Requires @sentry/replay package
  ],

  // 🌐 Distributed Tracing Configuration
  tracePropagationTargets: [
    'localhost',
    /^https:\/\/.*\.vantagelane\.com\/api/,
    /^https:\/\/.*\.supabase\.co/,
  ],
});
