/**
 * 🔐 Supabase Server Client – Vantage Lane 2.1 (FIXED)
 *
 * Unificare cookies + compatibilitate Next 15
 */

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('Missing Supabase env vars (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)');
  }

  return createServerClient(
    url,
    key,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: cookiesToSet => {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set({ name, value, ...options });
          });
        },
      },
    }
  );
}
