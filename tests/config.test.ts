/**
 * 🧩 Test Configuration & Utilities - Vantage Lane 2.0
 *
 * Utilities pentru testele suplimentare (nu afectează testele existente)
 * Folosit doar pentru testele noi de tip E2E sau Live API
 */

import { createClient } from '@supabase/supabase-js';

// Flag pentru rularea testelor live opționale
export const RUN_LIVE_TESTS = process.env.RUN_LIVE_TESTS === 'true';
export const RUN_E2E_TESTS = process.env.RUN_E2E_TESTS === 'true';

// Client Supabase pentru testele suplimentare
export const supabaseTest = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Helper pentru generarea emailurilor de test unice
export function generateTestEmail(prefix = 'test'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}@vantage-lane.com`;
}

// Test user template
export const createTestUserData = () => ({
  email: generateTestEmail('e2e'),
  password: 'TestPassword123!',
  firstName: 'Test',
  lastName: 'User',
});

const testConfig = {
  RUN_LIVE_TESTS,
  RUN_E2E_TESTS,
  supabaseTest,
  generateTestEmail,
  createTestUserData,
};

export default testConfig;
