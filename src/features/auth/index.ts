/**
 * 🔐 Auth Feature Module Exports - Vantage Lane 2.0
 *
 * Single source of truth pentru Auth
 * Organizare pe module pentru claritate maximă
 */

// ─────────────── Components ───────────────
export * from './components';

// ─────────────── Hooks ───────────────
export { useAuthForm } from './hooks/useAuthForm';
export { usePasswordReset } from './hooks/usePasswordReset';
export { useResetPassword } from './hooks/useResetPassword';

// ─────────────── Services ───────────────
export * from './services/supabaseAuth';

// ─────────────── Types ───────────────
export type * from './types/auth.types';

// ─────────────── Tokens ───────────────
export { authTokens } from './tokens/authTokens';

// ─────────────── Validation ───────────────
export {
  signInSchema,
  signUpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './validation/authSchema';

export type {
  SignInSchemaType,
  SignUpSchemaType,
  ForgotPasswordSchemaType,
  ResetPasswordSchemaType,
} from './validation/authSchema';
