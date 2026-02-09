/**
 * 👤 Supabase Session Management - Vantage Lane 2.0
 *
 * Obținere sesiune, utilizator curent și sign out
 * Cu error handling complet și logging
 */

import { getSupabaseClient } from './utils';

/**
 * 🚪 Sign out utilizator curent
 */
export async function signOut(): Promise<{ error: Error | null }> {
  try {
    const supabase = getSupabaseClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('[signOut] Error:', error);
      return { error };
    }

    return { error: null };
  } catch (error) {
    console.error('[signOut] Unexpected error:', error);
    return {
      error: error instanceof Error ? error : new Error('Failed to sign out'),
    };
  }
}

/**
 * 📦 Obține sesiunea curentă
 */
export async function getCurrentSession() {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('[getCurrentSession] Error:', error);
    }

    return { session: data.session, error };
  } catch (error) {
    console.error('[getCurrentSession] Unexpected error:', error);
    return {
      session: null,
      error: error instanceof Error ? error : new Error('Failed to get session'),
    };
  }
}

/**
 * 🧍‍♂️ Obține utilizatorul curent
 */
export async function getCurrentUser() {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.auth.getUser();

    // Only log actual errors, not "no session" which is normal when not logged in
    if (error && error.message !== 'Auth session missing!') {
      console.error('[getCurrentUser] Error:', error);
    }

    return { user: data.user, error };
  } catch (error) {
    // Only log unexpected errors, not auth session missing
    const errorMessage = error instanceof Error ? error.message : 'Failed to get user';
    if (errorMessage !== 'Auth session missing!') {
      console.error('[getCurrentUser] Unexpected error:', error);
    }
    return {
      user: null,
      error: error instanceof Error ? error : new Error('Failed to get user'),
    };
  }
}
