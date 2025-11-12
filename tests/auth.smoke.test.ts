/**
 * 🔥 Auth Smoke Tests (Optional Live) - Vantage Lane 2.0
 *
 * Teste suplimentare opționale care NU afectează testele existente din /src
 * Rulează doar dacă setezi: RUN_LIVE_TESTS=true pnpm vitest run tests/auth.smoke.test.ts
 *
 * Scopul: verificare rapidă că Supabase API funcționează live
 */

/* eslint-disable no-console */

import { describe, it, expect, beforeAll } from 'vitest';
import { RUN_LIVE_TESTS, supabaseTest, generateTestEmail } from './config.test';

// Rulează doar dacă flag-ul e setat
const skipIfNotLive = RUN_LIVE_TESTS ? describe : describe.skip;

skipIfNotLive('🔥 Live Supabase Smoke Tests', () => {
  const testEmail = generateTestEmail('smoke');

  beforeAll(() => {
    console.log('🔥 Running optional live smoke tests...');
    console.log('📧 Test email:', testEmail);
  });

  it('can connect to Supabase and get config', async () => {
    // Test basic connectivity
    const { error } = await supabaseTest.auth.getSession();

    // Should not error (session can be null, that's ok)
    expect(error).toBeNull();
    console.log('✅ Supabase connection: OK');
  }, 10000);

  it("can attempt signup (may fail due to rate limit - that's ok)", async () => {
    const { data, error } = await supabaseTest.auth.signUp({
      email: testEmail,
      password: 'SmokeTest123!',
      options: {
        data: {
          test: true,
          source: 'smoke-test',
        },
      },
    });

    // Either success OR rate limit error - both are valid responses
    if (error) {
      console.log('⚠️ Expected error (rate limit or duplicate):', error.message);
      expect(
        ['rate_limit', 'signup_disabled', 'email_rate_limit_exceeded'].some(
          code =>
            error.message.toLowerCase().includes(code) ||
            error.message.toLowerCase().includes('rate')
        )
      ).toBe(true);
    } else {
      console.log('✅ User created:', data.user?.id);
      expect(data.user?.email).toBe(testEmail);
    }
  }, 15000);

  it('validates environment variables are properly set', () => {
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
    expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined();
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toMatch(/^https:\/\/.*\.supabase\.co$/);

    console.log('✅ Environment configuration: OK');
  });
});

// Fallback test când live tests sunt disabled
if (!RUN_LIVE_TESTS) {
  describe('📋 Smoke Tests Info', () => {
    it('shows how to enable live tests', () => {
      console.log('💡 To run live smoke tests:');
      console.log('   RUN_LIVE_TESTS=true pnpm vitest run tests/auth.smoke.test.ts');
      expect(true).toBe(true);
    });
  });
}
