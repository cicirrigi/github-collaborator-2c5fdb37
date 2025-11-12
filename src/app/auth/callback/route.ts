/**
 * 🔄 Auth Callback Route - Vantage Lane 2.0
 *
 * Handles OAuth callback and email verification
 * Supabase redirect endpoint
 */

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const error_description = searchParams.get('error_description');

  // Handle OAuth/Email verification errors
  if (error) {
    console.error('[auth/callback] Error:', error, error_description);

    const errorUrl = new URL('/auth', origin);
    errorUrl.searchParams.set('error', error_description || error);

    return NextResponse.redirect(errorUrl);
  }

  if (code) {
    try {
      const supabase = await createSupabaseServerClient();

      // Exchange code for session
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        console.error('[auth/callback] Code exchange error:', exchangeError);

        const errorUrl = new URL('/auth', origin);
        errorUrl.searchParams.set('error', 'Authentication failed. Please try again.');

        return NextResponse.redirect(errorUrl);
      }

      if (data?.user) {
        console.log('[auth/callback] Authentication successful for user:', data.user.id);

        // Successful authentication - redirect to dashboard
        const dashboardUrl = new URL('/dashboard', origin);
        dashboardUrl.searchParams.set('success', 'Authentication successful!');

        return NextResponse.redirect(dashboardUrl);
      }
    } catch (err) {
      console.error('[auth/callback] Unexpected error:', err);

      const errorUrl = new URL('/auth', origin);
      errorUrl.searchParams.set('error', 'An unexpected error occurred. Please try again.');

      return NextResponse.redirect(errorUrl);
    }
  }

  // No code provided - redirect to auth page
  console.warn('[auth/callback] No code provided');

  const authUrl = new URL('/auth', origin);
  authUrl.searchParams.set('error', 'Authentication incomplete. Please try again.');

  return NextResponse.redirect(authUrl);
}
