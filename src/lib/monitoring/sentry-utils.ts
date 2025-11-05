/**
 * 🎯 Sentry Utilities - Enhanced Tracking
 * Based on official Sentry Next.js documentation and examples
 */

import * as Sentry from '@sentry/nextjs';

// Create logger for structured logging
const logger = {
  // eslint-disable-next-line no-console
  trace: (message: string, data?: Record<string, unknown>) => console.trace(message, data),
  // eslint-disable-next-line no-console
  debug: (message: string, data?: Record<string, unknown>) => console.debug(message, data),
  // eslint-disable-next-line no-console
  info: (message: string, data?: Record<string, unknown>) => console.info(message, data),
  // eslint-disable-next-line no-console
  warn: (message: string, data?: Record<string, unknown>) => console.warn(message, data),
  // eslint-disable-next-line no-console
  error: (message: string, data?: Record<string, unknown>) => console.error(message, data),
  // eslint-disable-next-line no-console
  fatal: (message: string, data?: Record<string, unknown>) => {
    // eslint-disable-next-line no-console
    console.error('FATAL:', message, data);
  },
  fmt: (template: TemplateStringsArray, ...values: unknown[]) =>
    template.reduce((acc, part, i) => acc + part + (values[i] || ''), ''),
};

/**
 * 🔍 Custom Span instrumentation for UI interactions
 */
export const trackUserAction = (
  action: string,
  callback: () => void,
  attributes?: Record<string, unknown>
) => {
  return Sentry.startSpan(
    {
      op: 'ui.click',
      name: action,
    },
    span => {
      // Add attributes to the span
      if (attributes) {
        Object.entries(attributes).forEach(([key, value]) => {
          span.setAttribute(key, String(value));
        });
      }

      // Execute the callback
      return callback();
    }
  );
};

/**
 * 🌐 Custom span instrumentation for API calls
 */
export const trackAPICall = async <T>(
  method: string,
  endpoint: string,
  callback: () => Promise<T>,
  attributes?: Record<string, unknown>
): Promise<T> => {
  return Sentry.startSpan(
    {
      op: 'http.client',
      name: `${method.toUpperCase()} ${endpoint}`,
    },
    async span => {
      // Add attributes to the span
      if (attributes) {
        Object.entries(attributes).forEach(([key, value]) => {
          span.setAttribute(key, String(value));
        });
      }

      try {
        const result = await callback();
        span.setAttribute('http.status_code', '200');
        return result;
      } catch (error) {
        span.setAttribute('http.status_code', 'error');
        throw error;
      }
    }
  );
};

/**
 * 🚗 Business Event Tracking - Vantage Lane Specific
 */
export const trackBookingEvent = (
  event: 'booking_started' | 'vehicle_selected' | 'payment_initiated' | 'booking_completed',
  data?: Record<string, unknown>
) => {
  return Sentry.startSpan(
    {
      op: 'business.event',
      name: `Booking: ${event}`,
    },
    span => {
      // Add business context
      span.setAttribute('event.type', 'booking');
      span.setAttribute('event.name', event);

      // Add custom data
      if (data) {
        Object.entries(data).forEach(([key, value]) => {
          span.setAttribute(`business.${key}`, String(value));
        });
      }

      // Log the business event
      logger.info(logger.fmt`Booking event: ${event}`, {
        event,
        ...data,
      });
    }
  );
};

/**
 * 📱 Page Navigation Tracking
 */
export const trackPageView = (pageName: string, route: string, userTier?: string) => {
  return Sentry.startSpan(
    {
      op: 'navigation',
      name: `Page View: ${pageName}`,
    },
    span => {
      span.setAttribute('page.name', pageName);
      span.setAttribute('page.route', route);
      if (userTier) {
        span.setAttribute('user.tier', userTier);
      }

      logger.info(logger.fmt`Page viewed: ${pageName}`, {
        page: pageName,
        route,
        userTier,
      });
    }
  );
};

/**
 * ⚠️ Error Tracking with Context
 */
export const trackError = (error: Error, context?: Record<string, unknown>) => {
  Sentry.withScope(scope => {
    // Add context to the error
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        scope.setTag(key, String(value));
      });
    }

    // Capture the exception
    Sentry.captureException(error);
  });

  // Also log the error
  logger.error('Application error occurred', {
    error: error.message,
    stack: error.stack,
    ...context,
  });
};

/**
 * 📊 Performance Metrics
 */
export const trackPerformance = (
  metric: string,
  value: number,
  unit: 'ms' | 'bytes' | 'count' = 'ms'
) => {
  return Sentry.startSpan(
    {
      op: 'performance.metric',
      name: `Performance: ${metric}`,
    },
    span => {
      span.setAttribute('metric.name', metric);
      span.setAttribute('metric.value', value);
      span.setAttribute('metric.unit', unit);

      logger.debug(logger.fmt`Performance metric: ${metric} = ${value}${unit}`, {
        metric,
        value,
        unit,
      });
    }
  );
};

/**
 * 🎯 User Journey Tracking
 */
export const trackUserJourney = (
  step: 'landing' | 'browsing' | 'booking' | 'payment' | 'confirmation',
  metadata?: Record<string, unknown>
) => {
  return Sentry.startSpan(
    {
      op: 'user.journey',
      name: `Journey: ${step}`,
    },
    span => {
      span.setAttribute('journey.step', step);
      span.setAttribute('journey.timestamp', new Date().toISOString());

      if (metadata) {
        Object.entries(metadata).forEach(([key, value]) => {
          span.setAttribute(`journey.${key}`, String(value));
        });
      }

      logger.info(logger.fmt`User journey step: ${step}`, {
        step,
        ...metadata,
      });
    }
  );
};
