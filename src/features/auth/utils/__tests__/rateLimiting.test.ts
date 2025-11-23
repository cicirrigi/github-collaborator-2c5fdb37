/**
 * 🧪 Rate Limiting Tests - Vantage Lane 2.0
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  isRateLimited,
  recordAttempt,
  clearRateLimit,
  getRateLimitInfo,
  getRateLimitKey,
  formatTimeRemaining,
  RATE_LIMIT_CONFIG,
} from '../rateLimiting';

describe('Rate Limiting Utils', () => {
  beforeEach(() => {
    // Clear all rate limits before each test
    vi.clearAllMocks();
  });

  describe('isRateLimited', () => {
    const testKey = 'test-user@example.com';
    const config = RATE_LIMIT_CONFIG.PASSWORD_RESET;

    beforeEach(() => {
      clearRateLimit(testKey);
    });

    it('allows first attempt', () => {
      const result = isRateLimited(testKey, config);

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(config.maxAttempts - 1);
      expect(result.retryAfter).toBeUndefined();
    });

    it('allows attempts within limit', () => {
      // Make first attempt
      recordAttempt(testKey, config);
      let result = isRateLimited(testKey, config);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(1);

      // Make second attempt
      recordAttempt(testKey, config);
      result = isRateLimited(testKey, config);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(0);
    });

    it('blocks attempts after limit exceeded', () => {
      // Exhaust all attempts
      for (let i = 0; i < config.maxAttempts; i++) {
        recordAttempt(testKey, config);
      }

      const result = isRateLimited(testKey, config);

      expect(result.allowed).toBe(false);
      expect(result.retryAfter).toBeGreaterThan(0);
      expect(result.remaining).toBeUndefined();
    });

    it('resets after time window expires', async () => {
      const shortConfig = {
        maxAttempts: 2,
        windowMs: 100, // 100ms
        blockDurationMs: 50, // 50ms
      };

      // Exhaust attempts
      recordAttempt(testKey, shortConfig);
      recordAttempt(testKey, shortConfig);

      let result = isRateLimited(testKey, shortConfig);
      expect(result.allowed).toBe(false);

      // Wait for block to expire
      await new Promise(resolve => setTimeout(resolve, 60));

      result = isRateLimited(testKey, shortConfig);
      expect(result.allowed).toBe(true);
    });
  });

  describe('recordAttempt', () => {
    const testKey = 'test-record@example.com';
    const config = RATE_LIMIT_CONFIG.LOGIN_ATTEMPTS;

    beforeEach(() => {
      clearRateLimit(testKey);
    });

    it('creates new entry for first attempt', () => {
      recordAttempt(testKey, config);

      const info = getRateLimitInfo(testKey, config);
      expect(info.count).toBe(1);
      expect(info.remaining).toBe(config.maxAttempts - 1);
      expect(info.blocked).toBe(false);
    });

    it('increments count for subsequent attempts', () => {
      recordAttempt(testKey, config);
      recordAttempt(testKey, config);

      const info = getRateLimitInfo(testKey, config);
      expect(info.count).toBe(2);
      expect(info.remaining).toBe(config.maxAttempts - 2);
    });

    it('marks as blocked when limit exceeded', () => {
      // Exceed the limit
      for (let i = 0; i < config.maxAttempts + 1; i++) {
        recordAttempt(testKey, config);
      }

      const info = getRateLimitInfo(testKey, config);
      expect(info.count).toBe(config.maxAttempts + 1);
      expect(info.remaining).toBe(0);
      expect(info.blocked).toBe(true);
    });
  });

  describe('getRateLimitInfo', () => {
    const testKey = 'test-info@example.com';
    const config = RATE_LIMIT_CONFIG.SIGNUP_ATTEMPTS;

    beforeEach(() => {
      clearRateLimit(testKey);
    });

    it('returns default info for new key', () => {
      const info = getRateLimitInfo(testKey, config);

      expect(info.count).toBe(0);
      expect(info.remaining).toBe(config.maxAttempts);
      expect(info.blocked).toBe(false);
      expect(info.resetTime).toBeGreaterThan(Date.now());
    });

    it('returns current state after attempts', () => {
      recordAttempt(testKey, config);
      recordAttempt(testKey, config);

      const info = getRateLimitInfo(testKey, config);

      expect(info.count).toBe(2);
      expect(info.remaining).toBe(1);
      expect(info.blocked).toBe(false);
    });
  });

  describe('getRateLimitKey', () => {
    it('generates consistent keys', () => {
      const key1 = getRateLimitKey('password_reset', 'user@example.com');
      const key2 = getRateLimitKey('password_reset', 'user@example.com');

      expect(key1).toBe(key2);
      expect(key1).toBe('rate_limit:password_reset:user@example.com');
    });

    it('generates different keys for different actions', () => {
      const email = 'user@example.com';
      const resetKey = getRateLimitKey('password_reset', email);
      const loginKey = getRateLimitKey('login', email);

      expect(resetKey).not.toBe(loginKey);
      expect(resetKey).toBe('rate_limit:password_reset:user@example.com');
      expect(loginKey).toBe('rate_limit:login:user@example.com');
    });

    it('generates different keys for different identifiers', () => {
      const user1Key = getRateLimitKey('login', 'user1@example.com');
      const user2Key = getRateLimitKey('login', 'user2@example.com');

      expect(user1Key).not.toBe(user2Key);
    });
  });

  describe('formatTimeRemaining', () => {
    it('formats seconds correctly', () => {
      expect(formatTimeRemaining(1)).toBe('1 second');
      expect(formatTimeRemaining(30)).toBe('30 seconds');
      expect(formatTimeRemaining(59)).toBe('59 seconds');
    });

    it('formats minutes correctly', () => {
      expect(formatTimeRemaining(60)).toBe('1 minute');
      expect(formatTimeRemaining(90)).toBe('2 minutes');
      expect(formatTimeRemaining(300)).toBe('5 minutes');
    });

    it('formats hours correctly', () => {
      expect(formatTimeRemaining(3600)).toBe('1 hour');
      expect(formatTimeRemaining(7200)).toBe('2 hours');
      expect(formatTimeRemaining(5400)).toBe('2 hours'); // 1.5 hours rounds up
    });
  });

  describe('clearRateLimit', () => {
    it('clears existing rate limit', () => {
      const testKey = 'test-clear@example.com';
      const config = RATE_LIMIT_CONFIG.PASSWORD_RESET;

      // Create some rate limit data
      recordAttempt(testKey, config);
      recordAttempt(testKey, config);

      let info = getRateLimitInfo(testKey, config);
      expect(info.count).toBe(2);

      // Clear the rate limit
      clearRateLimit(testKey);

      info = getRateLimitInfo(testKey, config);
      expect(info.count).toBe(0);
      expect(info.remaining).toBe(config.maxAttempts);
    });
  });

  describe('Rate Limit Configs', () => {
    it('has reasonable password reset limits', () => {
      const config = RATE_LIMIT_CONFIG.PASSWORD_RESET;

      expect(config.maxAttempts).toBe(3);
      expect(config.windowMs).toBe(15 * 60 * 1000); // 15 minutes
      expect(config.blockDurationMs).toBe(60 * 60 * 1000); // 1 hour
    });

    it('has reasonable login attempt limits', () => {
      const config = RATE_LIMIT_CONFIG.LOGIN_ATTEMPTS;

      expect(config.maxAttempts).toBe(5);
      expect(config.windowMs).toBe(15 * 60 * 1000); // 15 minutes
      expect(config.blockDurationMs).toBe(30 * 60 * 1000); // 30 minutes
    });

    it('has reasonable signup attempt limits', () => {
      const config = RATE_LIMIT_CONFIG.SIGNUP_ATTEMPTS;

      expect(config.maxAttempts).toBe(3);
      expect(config.windowMs).toBe(60 * 60 * 1000); // 1 hour
      expect(config.blockDurationMs).toBe(24 * 60 * 60 * 1000); // 24 hours
    });
  });

  describe('Edge Cases', () => {
    it('handles concurrent attempts gracefully', () => {
      const testKey = 'concurrent-test@example.com';
      const config = RATE_LIMIT_CONFIG.PASSWORD_RESET;

      // Simulate concurrent attempts
      const promises = Array.from({ length: 5 }, () => {
        return new Promise<void>(resolve => {
          recordAttempt(testKey, config);
          resolve();
        });
      });

      return Promise.all(promises).then(() => {
        const info = getRateLimitInfo(testKey, config);
        expect(info.count).toBe(5);
      });
    });

    it('handles very small time windows', () => {
      const testKey = 'small-window@example.com';
      const config = {
        maxAttempts: 1,
        windowMs: 1, // 1ms
        blockDurationMs: 10, // 10ms
      };

      recordAttempt(testKey, config);
      let result = isRateLimited(testKey, config);
      expect(result.allowed).toBe(false);

      // Should reset very quickly
      setTimeout(() => {
        result = isRateLimited(testKey, config);
        expect(result.allowed).toBe(true);
      }, 15);
    });
  });
});
