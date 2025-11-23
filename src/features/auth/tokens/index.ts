/**
 * 🎨 Auth Tokens Index - Vantage Lane 2.0
 *
 * Barrel export pentru toate auth tokens-urile
 * Menține compatibilitatea cu importurile existente
 */

import { authLayoutTokens } from './layout';
import { authComponentTokens } from './components';
import { authMessageTokens } from './messages';
import { authAnimationTokens } from './animations';
import { authConstantsTokens } from './constants';

/**
 * Export unificat - păstrează exact aceeași structură ca înainte
 * Toate componentele existente vor funcționa fără modificări
 */
export const authTokens = {
  // Layout & Typography
  ...authLayoutTokens,

  // UI Components
  ...authComponentTokens,

  // Messages (structured)
  messages: authMessageTokens,

  // Animations (merge cu button pentru compatibilitate)
  ...authAnimationTokens,

  // Merge button animations cu button components pentru compatibilitate completă
  button: {
    ...authComponentTokens.button,
    ...authAnimationTokens.button,
  },

  // Constants
  constants: authConstantsTokens,
} as const;

/**
 * Type export pentru TypeScript
 */
export type AuthTokens = typeof authTokens;

/**
 * Named exports pentru import specific (tree-shaking)
 */
export { authLayoutTokens } from './layout';
export { authComponentTokens } from './components';
export { authMessageTokens } from './messages';
export { authAnimationTokens } from './animations';
export { authConstantsTokens } from './constants';

/**
 * Type exports pentru named imports
 */
export type { authLayoutTokens as AuthLayoutTokens } from './layout';
export type { authComponentTokens as AuthComponentTokens } from './components';
export type { authMessageTokens as AuthMessageTokens } from './messages';
export type { authAnimationTokens as AuthAnimationTokens } from './animations';
export type { authConstantsTokens as AuthConstantsTokens } from './constants';
