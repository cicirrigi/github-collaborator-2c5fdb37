/**
 * 🌐 Supabase Social Auth - Vantage Lane 2.0
 *
 * OAuth pentru Google, Apple, LinkedIn
 * Cu error handling complet și logging pentru debugging
 */

import type { SocialProvider, AuthResponse } from '../../types/auth.types';
import { getSupabaseClient, getRedirectOrigin } from './utils';

/**
 * 🔗 Sign in cu provider social (Google / Apple / LinkedIn)
 */
export async function signInWithProvider(provider: SocialProvider): Promise<AuthResponse> {
  try {
    const supabase = getSupabaseClient();
    const redirectTo = `${getRedirectOrigin()}/auth/callback`;

    // Map provider names pentru Supabase
    const providerMap = {
      google: 'google',
      apple: 'apple',
      linkedin: 'linkedin_oidc',
    } as const;

    const supabaseProvider = providerMap[provider];
    if (!supabaseProvider) {
      const providerError = new Error(`Unsupported provider: ${provider}`);
      console.error('[signInWithProvider] Unsupported provider:', provider);
      return { user: null, error: providerError };
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: supabaseProvider,
      options: {
        redirectTo,
        ...(provider === 'google' ? { scopes: 'email profile' } : {}),
      },
    });

    if (error) {
      console.error(`[signInWithProvider] ${provider} OAuth error:`, error);
      return { user: null, error };
    }

    // OAuth redirect happens automatically
    // User will be null here, actual auth happens in callback
    return { user: null, error: null };
  } catch (error) {
    console.error(`[signInWithProvider] Unexpected error with ${provider}:`, error);
    return {
      user: null,
      error: error instanceof Error ? error : new Error(`Failed to sign in with ${provider}`),
    };
  }
}
