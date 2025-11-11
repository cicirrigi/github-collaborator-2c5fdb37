/**
 * 🔐 Auth Types - Vantage Lane 2.0
 *
 * TypeScript type definitions pentru autentificare
 * Folosite în forms, hooks, și services
 */

import type { User as SupabaseUser } from '@supabase/supabase-js';

/**
 * Auth modes - determină ce formular se afișează
 */
export type AuthMode = 'signin' | 'signup';

/**
 * Social auth providers disponibili
 */
export type SocialProvider = 'google' | 'apple' | 'linkedin';

/**
 * Login form data (email + password)
 */
export interface SignInFormData {
  readonly email: string;
  readonly password: string;
  readonly rememberMe?: boolean | undefined;
}

/**
 * Signup form data (extended cu date personale)
 */
export interface SignUpFormData {
  readonly email: string;
  readonly password: string;
  readonly confirmPassword: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly phone?: string | undefined;
  readonly acceptTerms: boolean;
  readonly marketingConsent?: boolean | undefined;
}

/**
 * Props pentru AuthContainer
 */
export interface AuthContainerProps {
  readonly defaultMode?: AuthMode | undefined;
  readonly redirectTo?: string | undefined;
  readonly onSuccess?: ((user: SupabaseUser) => void) | undefined;
  readonly onError?: ((error: Error) => void) | undefined;
}

/**
 * Props pentru AuthForm
 */
export interface AuthFormProps {
  readonly mode: AuthMode;
  readonly redirectTo?: string | undefined;
  readonly onSuccess?: (() => void) | undefined;
}

/**
 * Props pentru AuthTabs
 */
export interface AuthTabsProps {
  readonly activeMode: AuthMode;
  readonly onChange: (mode: AuthMode) => void;
}

/**
 * Props pentru SocialAuthButtons
 */
export interface SocialAuthButtonsProps {
  readonly onProviderClick: (provider: SocialProvider) => Promise<void>;
  readonly isLoading?: boolean;
  readonly disabled?: boolean;
}

/**
 * Auth service response
 */
export interface AuthResponse {
  readonly user: SupabaseUser | null;
  readonly error: Error | null;
}

/**
 * Auth session state
 */
export interface AuthSession {
  readonly user: SupabaseUser;
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresAt: number;
}

/**
 * Form field configuration
 */
export interface AuthFieldConfig {
  readonly name: string;
  readonly label: string;
  readonly type: 'text' | 'email' | 'password' | 'tel' | 'checkbox';
  readonly placeholder?: string;
  readonly required?: boolean;
  readonly autoComplete?: string;
}
