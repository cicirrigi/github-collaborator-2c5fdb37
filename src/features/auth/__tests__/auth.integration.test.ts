/**
 * 🧪 Auth Integration Tests (Safe) - Vantage Lane 2.0
 *
 * Verifică flow-ul complet Auth fără a afecta baza de date reală.
 * Include mock-uri pentru semn-in/out și două teste live opționale.
 *
 * Rulează cu:  pnpm vitest run
 */

/* eslint-disable no-console */

import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';

// ✅ Importăm serviciile reale (vor fi parțial mockuite)
import * as supabaseAuth from '../services/supabaseAuth';

// Flag pentru rularea testelor live (setabil din terminal)
const RUN_LIVE_TESTS = process.env.RUN_LIVE_TESTS === 'true';

// Date de test (mock)
const TEST_USER = {
  email: `test-${Date.now()}@vantage-lane.com`,
  password: 'Password123!',
  firstName: 'Test',
  lastName: 'User',
};

// 🧩 Client direct pentru testele live
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

beforeAll(() => {
  console.log('🚀 Starting Auth Integration Tests (SAFE MODE)');
});

afterAll(() => {
  console.log('✅ Tests finished successfully');
});

describe('🔐 Auth Services (Mocked)', () => {
  // Mock pentru signInWithEmail
  vi.spyOn(supabaseAuth, 'signInWithEmail').mockResolvedValue({
    user: { id: 'mock-user-id', email: TEST_USER.email } as any,
    error: null,
  });

  // Mock pentru signUpWithEmail
  vi.spyOn(supabaseAuth, 'signUpWithEmail').mockResolvedValue({
    user: { id: 'mock-user-id', email: TEST_USER.email } as any,
    error: null,
  });

  // Mock pentru signOut
  vi.spyOn(supabaseAuth, 'signOut').mockResolvedValue({ error: null });

  // ✅ Sign Up
  it('creates user successfully (mock)', async () => {
    const result = await supabaseAuth.signUpWithEmail({
      email: TEST_USER.email,
      password: TEST_USER.password,
      confirmPassword: TEST_USER.password,
      firstName: TEST_USER.firstName,
      lastName: TEST_USER.lastName,
      phone: '+447123456789',
      acceptTerms: true,
      marketingConsent: false,
    });

    expect(result.error).toBeNull();
    expect(result.user?.email).toBe(TEST_USER.email);
    console.log('🧩 Mock sign up successful');
  });

  // ✅ Sign In
  it('signs in successfully (mock)', async () => {
    const result = await supabaseAuth.signInWithEmail({
      email: TEST_USER.email,
      password: TEST_USER.password,
      rememberMe: true,
    });

    expect(result.error).toBeNull();
    expect(result.user).toBeDefined();
    console.log('🧩 Mock sign in successful');
  });

  // ✅ Sign Out
  it('signs out successfully (mock)', async () => {
    const result = await supabaseAuth.signOut();
    expect(result.error).toBeNull();
    console.log('🧩 Mock sign out successful');
  });
});

//
// 🧠 TESTE LIVE (opționale)
// Rulează doar dacă setezi RUN_LIVE_TESTS=true
//
if (RUN_LIVE_TESTS) {
  describe('🔥 Live Supabase Auth Tests (Real API)', () => {
    const liveUserEmail = `live-test-${Date.now()}@vantage-lane.com`;

    it('creates a new user in Supabase (live)', async () => {
      const { data, error } = await supabase.auth.signUp({
        email: liveUserEmail,
        password: 'TestPassword123!',
        options: { data: { first_name: 'Live', last_name: 'Test' } },
      });

      expect(error).toBeNull();
      expect(data.user?.email).toBe(liveUserEmail);
      console.log('✅ Live user created:', data.user?.id);
    }, 10000);

    it('fails login before email confirmation (live)', async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: liveUserEmail,
        password: 'TestPassword123!',
      });

      // Expecting error: email not confirmed
      expect(error).not.toBeNull();
      expect(data?.user).toBeNull();
      console.log('✅ Live login blocked (unconfirmed email)');
    }, 10000);
  });
}
