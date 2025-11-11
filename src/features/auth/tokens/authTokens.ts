/**
 * 🎨 Auth Design Tokens - Vantage Lane 2.0
 *
 * Centralizare styling fără hardcodări
 * Consistent cu design-system global
 */

import { typography } from '@/design-system/tokens/typography';

export const authTokens = {
  /**
   * Layout & Container
   */
  layout: {
    page: 'min-h-screen flex items-center justify-center px-4 py-12',
    container: 'w-full max-w-md',
    card: 'p-8 md:p-10',
    spacing: 'space-y-6',
  },

  /**
   * Typography
   */
  typography: {
    title: {
      base: typography.classes.sectionTitle,
      primary: 'text-white',
      accent: 'text-[var(--brand-primary)]',
      container: 'text-center mb-2',
    },
    subtitle: {
      base: 'text-center text-neutral-400 text-sm mb-8',
    },
    label: {
      base: 'block text-sm font-medium text-neutral-300 mb-2',
      required: "after:content-['*'] after:ml-1 after:text-[var(--brand-primary)]",
    },
    error: {
      base: 'text-xs text-red-400 mt-1',
    },
    link: {
      base: 'text-sm text-[var(--brand-primary)] hover:text-[var(--brand-secondary)] transition-colors duration-200',
    },
  },

  /**
   * Tabs (Sign in / Sign up)
   */
  tabs: {
    container: 'flex border-b border-neutral-800 mb-8',
    tab: {
      base: 'flex-1 py-3 text-center text-sm font-medium transition-all duration-300 cursor-pointer',
      active: 'border-b-2 border-[var(--brand-primary)] text-[var(--brand-primary)]',
      inactive: 'text-neutral-500 hover:text-neutral-300',
    },
  },

  /**
   * Form Fields
   */
  input: {
    base: 'w-full px-4 py-3 rounded-lg text-white text-sm',
    background: 'bg-neutral-900',
    border: 'border border-neutral-800',
    focus:
      'focus:outline-none focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]',
    error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
    disabled: 'opacity-50 cursor-not-allowed',
    placeholder: 'placeholder:text-neutral-600',
  },

  /**
   * Checkbox
   */
  checkbox: {
    container: 'flex items-start gap-3',
    input:
      'mt-0.5 w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]',
    label: 'text-xs text-neutral-400 leading-relaxed',
  },

  /**
   * Buttons
   */
  button: {
    primary: {
      base: 'w-full py-3 px-6 rounded-lg font-medium text-sm transition-all duration-300',
      background: 'bg-[var(--brand-primary)] hover:bg-[var(--brand-secondary)]',
      text: 'text-[var(--background-dark)]',
      disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
      loading: 'flex items-center justify-center gap-2',
    },
    social: {
      base: 'w-full py-3 px-6 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-3',
      background: 'bg-neutral-900 hover:bg-neutral-800',
      border: 'border border-neutral-800 hover:border-neutral-700',
      text: 'text-white',
    },
  },

  /**
   * Divider (or continue with email)
   */
  divider: {
    container: 'flex items-center gap-4 my-6',
    line: 'flex-1 h-px bg-neutral-800',
    text: 'text-xs text-neutral-500',
  },

  /**
   * Social Providers
   */
  social: {
    container: 'space-y-3',
  },

  /**
   * Links & Actions
   */
  actions: {
    container: 'flex items-center justify-between text-xs',
    forgotPassword: 'text-[var(--brand-primary)] hover:text-[var(--brand-secondary)]',
  },

  /**
   * Success/Error Messages
   */
  message: {
    success: 'p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm',
    error: 'p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm',
  },

  /**
   * Animations
   */
  animations: {
    fadeIn: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
    },
    slideUp: {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 },
    },
  },
} as const;

export type AuthTokens = typeof authTokens;
