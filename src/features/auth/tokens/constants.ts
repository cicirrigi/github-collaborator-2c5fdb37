/**
 * 📐 Auth Constants Tokens - Vantage Lane 2.0
 *
 * Magic numbers, breakpoints și constante pentru Auth
 * Centralizat pentru consistency
 */

export const authConstantsTokens = {
  /**
   * Form Validation Constants
   */
  validation: {
    minPasswordLength: 8,
    maxEmailLength: 100,
    maxNameLength: 50,
    maxPhoneLength: 15,
  },

  /**
   * Timing Constants (in milliseconds)
   */
  timing: {
    redirectDelay: 2000,
    messageAutoHide: 5000,
    loadingMinDisplay: 500,
    debounceDelay: 300,
  },

  /**
   * UI Constants
   */
  ui: {
    maxFormWidth: 'max-w-md',
    minCardHeight: 'min-h-[580px]',
    iconSize: 'w-5 h-5',
    logoSize: 'w-12 h-12',
  },

  /**
   * OAuth Scopes & Config
   */
  oauth: {
    google: {
      scopes: 'email profile',
    },
    apple: {
      scopes: 'name email',
    },
    linkedin: {
      scopes: 'r_liteprofile r_emailaddress',
    },
  },

  /**
   * Z-Index Layers
   */
  zIndex: {
    themeToggle: 10,
    modal: 50,
    overlay: 40,
    dropdown: 30,
  },
} as const;
