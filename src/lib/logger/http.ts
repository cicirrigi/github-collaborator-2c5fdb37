import { type NextRequest } from 'next/server';

import { log } from './index';

interface RequestLogData {
  method: string;
  url: string;
  userAgent?: string | undefined;
  ip?: string | undefined;
  userId?: string | undefined;
  duration?: number;
  status?: number;
  error?: string;
  [key: string]: unknown;
}

/**
 * Log HTTP requests for API routes
 * Usage: const response = await logRequest(request, () => handleRequest())
 */
export async function logRequest<T extends Response>(
  request: NextRequest,
  handler: () => Promise<T>,
  userId?: string
): Promise<T> {
  const start = Date.now();
  const requestData: RequestLogData = {
    method: request.method,
    url: request.url,
    userAgent: request.headers.get('user-agent') ?? undefined,
    ip: request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? undefined,
    userId,
  };

  log.info('API Request started', requestData);

  try {
    const response = await handler();
    const duration = Date.now() - start;

    log.info('API Request completed', {
      ...requestData,
      duration,
      status: response.status,
    });

    return response;
  } catch (error) {
    const duration = Date.now() - start;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    log.error('API Request failed', error, {
      ...requestData,
      duration,
      error: errorMessage,
    });

    throw error;
  }
}

/**
 * Log authentication events
 */
export function logAuth(
  event: 'login' | 'logout' | 'register' | 'error',
  userId?: string,
  meta?: Record<string, unknown>
) {
  log.info(`Auth: ${event}`, { userId, event, ...meta });
}

/**
 * Log business events (bookings, payments, etc.)
 */
export function logBusiness(event: string, userId?: string, meta?: Record<string, unknown>) {
  log.info(`Business: ${event}`, { userId, event, ...meta });
}
