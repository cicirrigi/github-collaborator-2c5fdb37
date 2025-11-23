/**
 * 🔐 Supabase Auth Index - Vantage Lane 2.0
 *
 * Barrel export pentru toate serviciile Auth modulare
 * Organizare curată și acces centralizat
 */

// ─────────────── Email Auth ───────────────
export { signInWithEmail, signUpWithEmail } from './auth.email';

// ─────────────── Social Auth ───────────────
export { signInWithProvider } from './auth.social';

// ─────────────── Session Management ───────────────
export { signOut, getCurrentSession, getCurrentUser } from './auth.session';

// ─────────────── Password Reset ───────────────
export { sendPasswordResetEmail, updatePassword } from './auth.password';

// ─────────────── Utils ───────────────
export { getSupabaseClient, getRedirectOrigin } from './utils';
