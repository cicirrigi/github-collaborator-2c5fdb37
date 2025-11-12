/**
 * 🎨 Auth Design Tokens - Vantage Lane 2.0
 *
 * Centralizare styling fără hardcodări
 * Consistent cu design-system global
 */

import { typography } from '@/design-system/tokens/typography';

export const authTokens = {
  /**
   * Layout & Container - ORCHESTRATED
   */
  layout: {
    page: 'min-h-screen flex items-center justify-center px-4 py-12',
    container: 'w-full max-w-md',
    card: `min-h-[580px] p-8 rounded-2xl 
           bg-gradient-to-br from-white/5 via-transparent to-white/5 
           dark:from-black/10 dark:via-transparent dark:to-black/10 
           backdrop-blur-sm 
           border border-white/10 dark:border-white/5
           shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.2)]
           dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.4)]`,
    spacing: 'space-y-6',
  },

  /**
   * Sizes & Spacing - UNIFIED TOKENS
   */
  sizes: {
    logo: 'w-12 h-12 scale-[1.4]',
    icon: 'w-5 h-5',
    iconSmall: 'w-4 h-4',
    containerMax: 'max-w-md',
  },
  spacing: {
    containerPadding: 'px-6 py-16',
    cardPadding: 'p-8',
    fieldGap: 'space-y-6',
    fieldGapSmall: 'space-y-4',
    gridGap: 'gap-4',
    logoMargin: 'mb-8',
    themeTogglePosition: '-top-16 right-0',
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
   * Tabs (Sign in / Sign up) - Modern Design with Orchestrated Animations
   */
  tabs: {
    container:
      'relative flex bg-neutral-100/50 dark:bg-neutral-900/50 backdrop-blur-sm rounded-xl p-1 mb-8 shadow-inner',
    tab: {
      base: 'relative flex-1 py-3 px-6 text-center text-sm font-medium transition-all duration-300 ease-out cursor-pointer rounded-lg z-10',
      active:
        'text-[var(--background-dark)] dark:text-[var(--background-dark)] shadow-lg shadow-[var(--brand-primary)]/25',
      inactive:
        'text-neutral-600 dark:text-neutral-400 hover:text-[var(--brand-primary)] hover:bg-white/50 dark:hover:bg-white/5',
      // Background indicator (will be positioned with CSS)
      indicator:
        'absolute inset-0 bg-[var(--brand-primary)] rounded-lg transition-transform duration-300 ease-out shadow-md',
    },
  },

  /**
   * Form Fields
   */
  input: {
    // Simplified - inline styles handle the critical parts
    default:
      'w-full px-4 py-3 rounded-lg text-neutral-900 dark:text-white text-sm transition-all duration-300 bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-800 dark:via-neutral-900 dark:to-neutral-950 placeholder:text-neutral-500 dark:placeholder:text-neutral-600 border-2 border-transparent',
    focus: 'focus:border-[var(--brand-primary)] focus:border-2',
    error: 'shadow-[0_0_0_2px_rgba(239,68,68,0.4)]',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
  },

  /**
   * Checkbox
   */
  checkbox: {
    container: 'flex items-start gap-3',
    input: `mt-0.5 w-4 h-4 rounded appearance-none focus:ring-0 focus:outline-none 
       bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 
       dark:from-neutral-800 dark:via-neutral-900 dark:to-neutral-950 
       border border-neutral-300 dark:border-neutral-700 
       checked:bg-[var(--brand-primary)] checked:border-[var(--brand-primary)] 
       checked:bg-[url('data:image/svg+xml,%3csvg%20viewBox%3d%270%200%2016%2016%27%20fill%3d%27white%27%20xmlns%3d%27http%3a//www.w3.org/2000/svg%27%3e%3cpath%20d%3d%27m13.854%203.646-8%208-.5.5-.5-.5-4-4%201.414-1.414L5.5%209.793l7.146-7.147z%27/%3e%3c/svg%3e')] 
       focus:shadow-[inset_0_1px_0_var(--brand-primary)/20,0_0_0_2px_var(--brand-primary)/30] 
       cursor-pointer transition-all duration-200`,
    label: 'text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed cursor-pointer',
  },

  /**
   * Buttons
   */
  button: {
    primary: {
      base: 'w-full py-3 px-6 rounded-lg font-medium text-sm transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-[var(--brand-primary)]/30 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40 focus:ring-offset-2 focus:ring-offset-transparent',
      background: 'bg-[var(--brand-primary)]',
      text: 'text-[var(--background-dark)]',
      disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
      loading: 'flex items-center justify-center gap-2',
    },
    social: {
      base: 'w-full text-center py-2.5 px-5 text-sm rounded-lg bg-gradient-to-br from-white/95 via-neutral-50/90 to-white/95 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 border-2 border-t-neutral-700/40 border-l-neutral-700/40 border-b-neutral-800 border-r-neutral-800 dark:border-t-white/5 dark:border-l-white/5 dark:border-b-black dark:border-r-black shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)] text-neutral-900 dark:text-white font-medium transition-colors duration-200 hover:bg-opacity-90 auth-focus-ring flex items-center justify-center gap-3',
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
      'text-[var(--brand-primary)] transition-colors duration-200 hover:brightness-110 hover:underline',
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
   * Smooth Accordion Animations
   */
  accordion: {
    // Optimized durations pentru smooth acordeon - REDUCED pentru smooth
    durations: {
      signUp: 'duration-300', // Reduced pentru smooth
      confirm: 'duration-200', // Reduced pentru smooth
      terms: 'duration-250', // Reduced pentru smooth
      content: 'duration-150', // Reduced pentru smooth
    },
    // Coordinated easing pentru no-jump effects
    easing: {
      container: 'ease-in-out', // Changed pentru smooth
      content: 'ease-in-out', // Content interior
    },
    // FIXED max-heights - consistent cu min-height din card
    maxHeights: {
      signUp: 'max-h-[300px]', // Reduced pentru smooth transition
      confirm: 'max-h-[100px]', // Reduced pentru smooth transition
      terms: 'max-h-[180px]', // Reduced pentru smooth transition
    },
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
