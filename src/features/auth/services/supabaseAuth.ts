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
      return { user: null, error };
    }

    // Optional: Set remember me cookie
    if (data.rememberMe) {
      // TODO: Implement persistent session logic
    }

    return { user: authData.user, error: null };
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error : new Error('Sign in failed'),
    };
  }
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(data: SignUpFormData): Promise<AuthResponse> {
  try {
    const supabase = getSupabaseClient();

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
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      return { user: null, error };
    }

    return { user: authData.user, error: null };
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error : new Error('Sign up failed'),
    };
  }
}

/**
 * Sign in with social provider (Google, Apple, LinkedIn)
 */
export async function signInWithProvider(provider: SocialProvider): Promise<AuthResponse> {
  try {
    const supabase = getSupabaseClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider === 'linkedin' ? 'linkedin_oidc' : provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
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

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
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
