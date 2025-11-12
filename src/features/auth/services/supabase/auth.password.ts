/**
 * 🔐 Supabase Password Reset - Vantage Lane 2.0
 *
 * Resetare și schimbare parolă
 * Cu error handling complet și validation
 */

import { getSupabaseClient, getRedirectOrigin } from './utils';

/**
 * 📩 Trimite email de resetare parolă
 */
export async function sendPasswordResetEmail(email: string): Promise<{ error: Error | null }> {
  try {
    const supabase = getSupabaseClient();
    const redirectTo = `${getRedirectOrigin()}/auth/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      console.error('[sendPasswordResetEmail] Error:', error);
      return { error };
    }

    return { error: null };
  } catch (error) {
    console.error('[sendPasswordResetEmail] Unexpected error:', error);
    return {
      error: error instanceof Error ? error : new Error('Failed to send reset email'),
    };
  }
}

/**
 * 🔁 Actualizează parola după reset cu token
 */
export async function updatePassword(newPassword: string): Promise<{ error: Error | null }> {
  try {
    const supabase = getSupabaseClient();

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error('[updatePassword] Error:', error);
      return { error };
    }

    return { error: null };
  } catch (error) {
    console.error('[updatePassword] Unexpected error:', error);
    return {
      error: error instanceof Error ? error : new Error('Failed to update password'),
    };
  }
}
