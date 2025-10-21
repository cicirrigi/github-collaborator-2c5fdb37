import { NextResponse } from 'next/server';

import { livenessCheck, performHealthCheck } from '@/lib/health';
import { log } from '@/lib/logger';

/**
 * GET /api/health - Comprehensive health check
 * Used by monitoring systems for detailed status
 */
export async function GET() {
  try {
    const report = await performHealthCheck();

    const statusCode = report.status === 'healthy' ? 200 : report.status === 'degraded' ? 200 : 503;

    return NextResponse.json(report, { status: statusCode });
  } catch (error) {
    log.error('Health check endpoint failed', error);

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
        checks: [],
      },
      { status: 503 }
    );
  }
}

/**
 * HEAD /api/health - Quick liveness check
 * Used by load balancers for fast health verification
 */
export async function HEAD() {
  try {
    const result = await livenessCheck();

    return new Response(null, {
      status: result.status === 'ok' ? 200 : 503,
      headers: {
        'X-Health-Status': result.status,
        'X-Health-Timestamp': result.timestamp,
      },
    });
  } catch (error) {
    log.error('Liveness check failed', error);
    return new Response(null, { status: 503 });
  }
}
