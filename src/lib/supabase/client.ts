/**
 * 🔐 Supabase Browser Client – Vantage Lane 2.1 (FIXED)
 *
 * Singleton pattern + session persistence
 * Sincronizare completă între browser și SSR
 */

import { createBrowserClient } from '@supabase/ssr';

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (typeof window === 'undefined') {
    throw new Error('createClient can only be used in the browser');
  }

  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        isSingleton: true,
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      }
    );
  }

  return browserClient;
}
