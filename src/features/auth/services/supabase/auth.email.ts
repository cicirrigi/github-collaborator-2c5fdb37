/**
 * ✉️ Supabase Email Auth - Vantage Lane 2.0
 *
 * Sign In / Sign Up prin email și parolă
 * Respectă pattern-urile proiectului cu error handling complet
 */

import type { SignInFormData, SignUpFormData, AuthResponse } from '../../types/auth.types';
import { getSupabaseClient, getRedirectOrigin } from './utils';

/**
 * 🔑 Sign In cu email și password
 */
export async function signInWithEmail(data: SignInFormData): Promise<AuthResponse> {
  try {
    const supabase = getSupabaseClient();

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      console.error('[signInWithEmail] Auth error:', error);
      return { user: null, error };
    }

    // Additional validation - ensure user data exists
    if (!authData?.user) {
      const noUserError = new Error('No user data returned from authentication');
      console.error('[signInWithEmail] No user data:', authData);
      return { user: null, error: noUserError };
    }

    // Optional: Set remember me cookie
    if (data.rememberMe) {
      // TODO: Implement remember me logic if needed
    }

    return { user: authData.user, error: null };
  } catch (error) {
    console.error('[signInWithEmail] Unexpected error:', error);
    return {
      user: null,
      error: error instanceof Error ? error : new Error('Failed to sign in'),
    };
  }
}

/**
 * 🆕 Sign Up cu email și password + metadata
 */
export async function signUpWithEmail(data: SignUpFormData): Promise<AuthResponse> {
  try {
    const supabase = getSupabaseClient();
    const redirectTo = `${getRedirectOrigin()}/auth/callback`;

    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone ?? null,
          marketing_consent: !!data.marketingConsent,
        },
      },
    });

    if (error) {
      console.error('[signUpWithEmail] Error:', error);
      return { user: null, error };
    }

    return { user: authData.user, error: null };
  } catch (error) {
    console.error('[signUpWithEmail] Unexpected error:', error);
    return {
      user: null,
      error: error instanceof Error ? error : new Error('Failed to sign up'),
    };
  }
}
