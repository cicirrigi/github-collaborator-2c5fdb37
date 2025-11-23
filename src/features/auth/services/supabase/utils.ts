/**
 * 🌍 Supabase Auth Utils - Vantage Lane 2.0
 *
 * Utilitare comune pentru serviciile Auth
 * Client factory și redirect origin management
 */

import { createClient } from '@/lib/supabase/client';

/**
 * Singleton client factory - evită crearea multiplă
 */
export const getSupabaseClient = () => {
  return createClient();
};

/**
 * Returnează URL-ul de redirect corect pentru OAuth și email verification
 */
export function getRedirectOrigin(): string {
  // Prioritize environment variable (important for tests and server-side)
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // Fallback to browser location if available
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // Default fallback
  return 'https://vantage-lane.com';
}
