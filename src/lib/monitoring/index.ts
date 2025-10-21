// Unified monitoring exports
export { Sentry } from './sentry.client';
export * from '@sentry/nextjs';

/**
 * Capture user context for monitoring
 */
export async function captureUserContext(user: { id: string; email: string; tier?: string }) {
  if (typeof window !== 'undefined') {
    // Client-side only
    const { Sentry } = await import('./sentry.client');
    Sentry.setUser({
      id: user.id,
      email: user.email,
      tier: user.tier,
    });
  }
}

/**
 * Capture business event
 */
export async function captureBusinessEvent(event: string, data?: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    const { Sentry } = await import('./sentry.client');
    Sentry.addBreadcrumb({
      message: event,
      data: data || {},
      category: 'business',
      level: 'info',
    });
  }
}

/**
 * Capture API performance
 */
export async function captureAPIPerformance(endpoint: string, duration: number, status: number) {
  if (typeof window !== 'undefined') {
    const { Sentry } = await import('./sentry.client');
    Sentry.addBreadcrumb({
      message: `API ${endpoint}`,
      data: { duration, status },
      category: 'api',
      level: status >= 400 ? 'error' : 'info',
    });
  }
}
