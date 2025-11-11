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
      primary: 'text-white dark:text-white',
      accent: 'text-[var(--brand-primary)]',
      container: 'text-center mb-2',
    },
    subtitle: {
      base: 'text-center text-neutral-400 dark:text-neutral-400 text-sm mb-8',
    },
    label: {
      base: 'block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2',
      required: "after:content-['*'] after:ml-1 after:text-[var(--brand-primary)]",
    },
    error: {
      base: 'text-xs text-red-600 dark:text-red-400 mt-1',
    },
    link: {
      base: 'text-sm text-[var(--brand-primary)] hover:text-[var(--brand-secondary)] transition-colors duration-200',
    },
  },

  /**
   * Tabs (Sign in / Sign up)
   */
  tabs: {
    container: 'flex border-b border-neutral-300 dark:border-neutral-800 mb-8',
    tab: {
      base: 'flex-1 py-3 text-center text-sm font-medium transition-all duration-500 ease-in-out cursor-pointer transform',
      active: 'border-b-2 border-[var(--brand-primary)] text-[var(--brand-primary)] scale-105',
      inactive:
        'text-neutral-600 dark:text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300 hover:scale-102',
    },
  },

  /**
   * Form Fields
   */
  input: {
    // Simplified - inline styles handle the critical parts
    default:
      'w-full px-4 py-3 rounded-lg text-neutral-900 dark:text-white text-sm transition-all duration-300 bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-800 dark:via-neutral-900 dark:to-neutral-950 placeholder:text-neutral-500 dark:placeholder:text-neutral-600',
    focus:
      'focus:shadow-[inset_0_1px_0_rgba(203,178,106,0.2),0_0_0_2px_rgba(203,178,106,0.4)] focus:bg-gradient-to-br focus:from-white focus:via-neutral-50 focus:to-neutral-100 dark:focus:from-neutral-700 dark:focus:via-neutral-800 dark:focus:to-neutral-900',
    error: 'shadow-[0_0_0_2px_rgba(239,68,68,0.4)]',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
  },

  /**
   * Checkbox
   */
  checkbox: {
    container: 'flex items-start gap-3',
    input:
      'mt-0.5 w-4 h-4 rounded appearance-none focus:ring-0 focus:outline-none bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-800 dark:via-neutral-900 dark:to-neutral-950 text-[#cbb26a] focus:shadow-[inset_0_1px_0_rgba(203,178,106,0.2),0_0_0_2px_rgba(203,178,106,0.3)]',
    label: 'text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed',
  },

  /**
   * Buttons
   */
  button: {
    primary: {
      base: 'w-full py-3 px-6 rounded-lg font-medium text-sm transition-all duration-300 hover:transform hover:-translate-y-1 hover:scale-105 hover:shadow-xl hover:shadow-[var(--brand-primary)]/30 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#cbb26a]/40 focus:ring-offset-2 focus:ring-offset-transparent',
      background: 'bg-[var(--brand-primary)]',
      text: 'text-[var(--background-dark)]',
      disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
      loading: 'flex items-center justify-center gap-2',
    },
    social: {
      base: 'w-full text-center py-2.5 px-5 text-sm rounded-lg bg-gradient-to-br from-white/95 via-neutral-50/90 to-white/95 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 border-2 border-t-neutral-700/40 border-l-neutral-700/40 border-b-neutral-800 border-r-neutral-800 dark:border-t-white/5 dark:border-l-white/5 dark:border-b-black dark:border-r-black shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)] text-neutral-900 dark:text-white font-medium transition-all duration-200 hover:scale-[1.02] auth-focus-ring flex items-center justify-center gap-3',
      background: '', // Inclus în base
      border: '', // Inclus în base
      text: '', // Inclus în base
    },
  },

  /**
   * Divider (or continue with email)
   */
  divider: {
    container: 'flex items-center gap-4 my-6',
    line: 'flex-1 h-px bg-neutral-300 dark:bg-neutral-800',
    text: 'text-xs text-neutral-600 dark:text-neutral-500',
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
    forgotPassword:
      'text-[var(--brand-primary)] transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:scale-105 hover:brightness-110 hover:drop-shadow-sm hover:shadow-[0_0_8px_rgba(203,178,106,0.6)]',
  },

  /**
   * Success/Error Messages
   */
  message: {
    success:
      'p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm',
    error:
      'p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm',
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
