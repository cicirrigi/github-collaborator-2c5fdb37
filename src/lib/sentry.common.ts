/**
 * 🔧 Sentry Common Configuration
 * Shared settings between client, server, and edge runtime
 */

export const sentryCommonConfig = {
  // 🎯 Environment & Release
  environment: process.env.NODE_ENV || 'development',
  release: process.env.VERCEL_GIT_COMMIT_SHA || process.env.npm_package_version || '1.0.0',

  // 📊 Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0, // 10% in prod, 100% in dev

  // 🔧 Configuration
  debug: process.env.NODE_ENV === 'development',
  enabled: true, // Enable in both dev and prod for testing

  // 🎨 Common Tags
  initialScope: {
    tags: {
      brand: 'vantage-lane',
      version: process.env.npm_package_version || '1.0.0',
    },
  },

  // 🛡️ Privacy & Security Filters
  beforeSend(event: any, _hint?: any) {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    // Filter out potentially sensitive errors in development
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('Sentry Event:', event);
    }

    // Don't send events for demo/test pages
    if (
      event.request?.url?.includes('/demo-') ||
      event.request?.url?.includes('-test') ||
      event.request?.url?.includes('/api/health')
    ) {
      return null;
    }

    // Filter out development-only errors
    if (
      event.exception?.values?.[0]?.value?.includes('ChunkLoadError') &&
      process.env.NODE_ENV === 'development'
    ) {
      return null;
    }

    return event;
  },

  // 🔒 Sensitive data filtering for breadcrumbs
  beforeBreadcrumb(breadcrumb: any) {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    // Filter out sensitive data from breadcrumbs
    if (breadcrumb.category === 'http' && breadcrumb.data?.url) {
      // Remove query parameters that might contain sensitive data
      if (
        breadcrumb.data.url.includes('password') ||
        breadcrumb.data.url.includes('token') ||
        breadcrumb.data.url.includes('key')
      ) {
        return null;
      }
    }

    return breadcrumb;
  },
} as const;

// 🎯 Environment-specific DSN getters
export const getSentryDSN = (type: 'frontend' | 'backend'): string | undefined => {
  switch (type) {
    case 'frontend':
      return process.env.NEXT_PUBLIC_SENTRY_DSN_FRONTEND;
    case 'backend':
      return process.env.SENTRY_DSN_BACKEND;
    default:
      return undefined;
  }
};

// 🔧 Sentry project configuration
export const sentryProjects = {
  frontend: {
    dsn: getSentryDSN('frontend'),
    project: process.env.SENTRY_PROJECT_FRONTEND || 'vantage-lane-frontend',
  },
  backend: {
    dsn: getSentryDSN('backend'),
    project: process.env.SENTRY_PROJECT_BACKEND || 'vantage-lane-backend',
  },
} as const;
