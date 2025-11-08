/**
 * 🚀 Sentry Backend Instrumentation
 * IMPORTANT: This must be imported FIRST in server-side code
 */

const Sentry = require('@sentry/node');
const { nodeProfilingIntegration } = require('@sentry/profiling-node');

Sentry.init({
  // 🎯 Backend Sentry Project DSN
  dsn: 'https://ea5d5059516c0c06fa7c89c51a428af9@o4510108108652544.ingest.de.sentry.io/4510314918838352',

  integrations: [
    // Node.js profiling for performance monitoring
    nodeProfilingIntegration(),
    // Console logging integration
    Sentry.consoleLoggingIntegration({
      levels: ['log', 'warn', 'error', 'info', 'debug'],
    }),
  ],

  // 📝 Send structured logs to Sentry
  enableLogs: true,

  // 🎯 Performance & Tracing
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // 📊 Profiling settings
  profileSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  profileLifecycle: 'trace', // Profile during active traces

  // 🏷️ Backend identification
  environment: process.env.NODE_ENV || 'development',
  initialScope: {
    tags: {
      component: 'backend',
      platform: 'nodejs',
      runtime: 'server',
    },
  },

  // 🔒 Security settings
  sendDefaultPii: false, // Don't send PII by default

  // 🔧 Additional settings
  debug: process.env.NODE_ENV === 'development',
  serverName: process.env.VERCEL_REGION || 'local-backend',
});

// Confirmă că backend Sentry e loaded
console.log('🟢 SENTRY BACKEND INSTRUMENTATION LOADED');

module.exports = Sentry;
