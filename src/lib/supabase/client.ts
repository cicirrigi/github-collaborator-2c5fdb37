/**
 * 🔐 Supabase Browser Client – SSR with Forced JWT Attachment
 *
 * SSR client with explicit session management for JWT token attachment
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

// Export singleton instance directly for guaranteed session sharing
export const supabaseClient = typeof window !== 'undefined' ? createClient() : null;
