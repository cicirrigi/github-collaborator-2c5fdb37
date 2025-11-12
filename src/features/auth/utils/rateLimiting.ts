/**
 * 🚦 Rate Limiting Utilities - Vantage Lane 2.0
 *
 * Simple in-memory rate limiting for auth operations
 * In production, use Redis or similar for distributed rate limiting
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
  lastAttempt: number;
}

// In-memory store (replace with Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Rate limit configuration
 */
interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
}

export const RATE_LIMIT_CONFIG = {
  PASSWORD_RESET: {
    maxAttempts: 3,
    windowMs: 15 * 60 * 1000, // 15 minutes
    blockDurationMs: 60 * 60 * 1000, // 1 hour
  },
  LOGIN_ATTEMPTS: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    blockDurationMs: 30 * 60 * 1000, // 30 minutes
  },
  SIGNUP_ATTEMPTS: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    blockDurationMs: 24 * 60 * 60 * 1000, // 24 hours
  },
} satisfies Record<string, RateLimitConfig>;

/**
 * Check if an action is rate limited
 */
export function isRateLimited(
  key: string,
  config: RateLimitConfig
): { allowed: boolean; retryAfter?: number; remaining?: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  // No previous attempts
  if (!entry) {
    return { allowed: true, remaining: config.maxAttempts - 1 };
  }

  // Check if the rate limit window has reset
  if (entry.resetTime <= now) {
    // Reset the counter
    rateLimitStore.set(key, {
      count: 0,
      resetTime: now + config.windowMs,
      lastAttempt: now,
    });
    return { allowed: true, remaining: config.maxAttempts - 1 };
  }

  // Check if we've exceeded the limit
  if (entry.count >= config.maxAttempts) {
    // Check if we're still in a block period
    if (entry.lastAttempt + config.blockDurationMs > now) {
      const retryAfter = Math.ceil((entry.lastAttempt + config.blockDurationMs - now) / 1000);
      return { allowed: false, retryAfter };
    } else {
      // Block period expired, reset counter
      rateLimitStore.set(key, {
        count: 0,
        resetTime: now + config.windowMs,
        lastAttempt: now,
      });
      return { allowed: true, remaining: config.maxAttempts - 1 };
    }
  }

  // Allow the request - remaining attempts
  const remaining = config.maxAttempts - entry.count - 1;
  return { allowed: true, remaining };
}

/**
 * Record a rate limited action attempt
 */
export function recordAttempt(key: string, config: RateLimitConfig): void {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetTime <= now) {
    // Create new entry or reset expired one
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
      lastAttempt: now,
    });
  } else {
    // Increment existing entry
    rateLimitStore.set(key, {
      ...entry,
      count: entry.count + 1,
      lastAttempt: now,
    });
  }
}

/**
 * Clear rate limit for a key (for testing or admin override)
 */
export function clearRateLimit(key: string): void {
  rateLimitStore.delete(key);
}

/**
 * Get rate limit info without checking/modifying state
 */
export function getRateLimitInfo(
  key: string,
  config: RateLimitConfig
): { count: number; remaining: number; resetTime: number; blocked: boolean } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetTime <= now) {
    return {
      count: 0,
      remaining: config.maxAttempts,
      resetTime: now + config.windowMs,
      blocked: false,
    };
  }

  const blocked =
    entry.count >= config.maxAttempts && entry.lastAttempt + config.blockDurationMs > now;

  return {
    count: entry.count,
    remaining: Math.max(0, config.maxAttempts - entry.count),
    resetTime: entry.resetTime,
    blocked,
  };
}

/**
 * Generate rate limit key for different actions
 */
export function getRateLimitKey(action: string, identifier: string): string {
  return `rate_limit:${action}:${identifier}`;
}

/**
 * Format time remaining for user display
 */
export function formatTimeRemaining(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  }

  const minutes = Math.ceil(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }

  const hours = Math.ceil(minutes / 60);
  return `${hours} hour${hours !== 1 ? 's' : ''}`;
}
