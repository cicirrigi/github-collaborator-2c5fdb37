/**
 * 🔐 Supabase Client - Vantage Lane 2.0
 *
 * Browser-side Supabase client
 * Singleton pattern pentru performance
 */

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // SSR check - only create client in browser
  if (typeof window === 'undefined') {
    throw new Error('createClient can only be called in the browser');
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
