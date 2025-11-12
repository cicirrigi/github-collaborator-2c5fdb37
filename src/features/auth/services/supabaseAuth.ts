/**
 * 🔐 Supabase Auth Service - Vantage Lane 2.0
 *
 * Centralizare apeluri Supabase Auth
 * Abstracție curată pentru sign in, sign up, social auth
 */

import { createClient } from '@/lib/supabase/client';
import type {
  SignInFormData,
  SignUpFormData,
  SocialProvider,
  AuthResponse,
} from '../types/auth.types';

/**
 * Get Supabase client instance
 */
const getSupabaseClient = () => {
  return createClient();
};

/**
 * Sign in with email and password
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
      // TODO: Implement persistent session logic
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
 * Sign up with email and password
 */
export async function signUpWithEmail(data: SignUpFormData): Promise<AuthResponse> {
  try {
    const supabase = getSupabaseClient();
    const redirectOrigin =
      process.env.NEXT_PUBLIC_APP_URL ||
      (typeof window !== 'undefined' ? window.location.origin : 'https://vantage-lane.com');

    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone || null,
          marketing_consent: data.marketingConsent || false,
        },
        emailRedirectTo: `${redirectOrigin}/auth/callback`,
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

/**
 * Sign in with social provider (Google, Apple, LinkedIn)
 */
export async function signInWithProvider(provider: SocialProvider): Promise<AuthResponse> {
  try {
    const supabase = getSupabaseClient();
    const redirectOrigin =
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_APP_URL || 'https://vantage-lane.com';

    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider === 'linkedin' ? 'linkedin_oidc' : provider,
      options: {
        redirectTo: `${redirectOrigin}/auth/callback`,
        ...(provider === 'google' ? { scopes: 'email profile' } : {}),
      },
    });

    if (error) {
      return { user: null, error };
    }

    // OAuth redirect happens automatically
    return { user: null, error: null };
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error : new Error('Social sign in failed'),
    };
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<{ error: Error | null }> {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { error };
    }

    return { error: null };
  } catch (error) {
    return {
      error: error instanceof Error ? error : new Error('Sign out failed'),
    };
  }
}

/**
 * Get current session
 */
export async function getCurrentSession() {
  try {
    const supabase = getSupabaseClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      return { session: null, error };
    }

    return { session, error: null };
  } catch (error) {
    return {
      session: null,
      error: error instanceof Error ? error : new Error('Failed to get session'),
    };
  }
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  try {
    const supabase = getSupabaseClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      return { user: null, error };
    }

    return { user, error: null };
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error : new Error('Failed to get user'),
    };
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string): Promise<{ error: Error | null }> {
  try {
    const supabase = getSupabaseClient();
    const redirectOrigin =
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_APP_URL || 'https://vantage-lane.com';

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${redirectOrigin}/auth/reset-password`,
    });

    if (error) {
      return { error };
    }

    return { error: null };
  } catch (error) {
    return {
      error: error instanceof Error ? error : new Error('Failed to send reset email'),
    };
  }
}
