/**
 * 🔄 Auth Callback – Vantage Lane 2.1 (FIXED)
 */

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/signin?error=missing_code`);
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      // Log error for debugging (production should use proper logger)
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('[auth/callback] exchange error:', error);
      }
      return NextResponse.redirect(`${origin}/auth/signin?error=exchange_failed`);
    }

    if (data?.user) {
      // Log success for debugging (production should use proper logger)
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log('[auth/callback] success for user:', data.user.email);
      }
      return NextResponse.redirect(`${origin}/dashboard`);
    }

    return NextResponse.redirect(`${origin}/auth/signin?error=no_user`);
  } catch (err) {
    // Log error for debugging (production should use proper logger)
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('[auth/callback] unexpected error:', err);
    }
    return NextResponse.redirect(`${origin}/auth/signin?error=unexpected`);
  }
}
