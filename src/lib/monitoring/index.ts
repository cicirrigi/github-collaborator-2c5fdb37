// Unified monitoring exports
import * as Sentry from '@sentry/nextjs';
export { Sentry };
export * from '@sentry/nextjs';

/**
 * Capture user context for monitoring
 */
export async function captureUserContext(user: { id: string; email: string; tier?: string }) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    tier: user.tier,
  });
}

/**
 * Capture business event
 */
export async function captureBusinessEvent(event: string, data?: Record<string, unknown>) {
  Sentry.addBreadcrumb({
    message: event,
    data: data || {},
    category: 'business',
    level: 'info',
  });
}

/**
 * Capture API performance
 */
export async function captureAPIPerformance(endpoint: string, duration: number, status: number) {
  Sentry.addBreadcrumb({
    message: `API ${endpoint}`,
    data: { duration, status },
    category: 'api',
    level: status >= 400 ? 'error' : 'info',
  });
}
