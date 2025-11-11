/**
 * 🔐 Supabase Server Client – Vantage Lane 2.0
 *
 * Client Supabase pentru server-side operations:
 * - Route Handlers
 * - Server Actions
 * - Middleware
 * - Uses @supabase/ssr for cookie management
 */

import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

// TODO: Replace with generated types when available
// import type { Database } from '@/types/supabase';
type Database = any;

/**
 * Creates a Supabase client for server-side usage
 * Handles cookies automatically for session persistence
 */
export async function createSupabaseServerClient(): Promise<SupabaseClient<Database>> {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Handle cookie setting errors (e.g., during static generation)
            console.warn('Failed to set cookie:', name, error);
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', expires: new Date(0), ...options });
          } catch (error) {
            // Handle cookie removal errors
            console.warn('Failed to remove cookie:', name, error);
          }
        },
      },
    }
  );
}

/**
 * Alternative helper for when you need just the client
 * without additional setup
 */
export async function getSupabaseServer() {
  return await createSupabaseServerClient();
}
