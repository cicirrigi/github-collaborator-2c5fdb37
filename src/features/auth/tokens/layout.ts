/**
 * 🏗️ Auth Layout Tokens - Vantage Lane 2.0
 *
 * Layout, spacing și typography tokens pentru Auth
 * Modular și tree-shakeable
 */

import { typography } from '@/design-system/tokens/typography';

export const authLayoutTokens = {
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
    themeTogglePosition: 'top-4 right-4',
  },

  /**
   * Typography Orchestration (din design-system)
   */
  typography: {
    // Titlu principal
    title: {
      base: `text-center text-xl font-semibold ${typography.fontFamily.sans}`,
      accent: 'text-[var(--brand-primary)]',
      container: 'mb-2',
    },
    // Subtitlu
    subtitle: 'text-center text-neutral-400 text-sm mb-8',
    // Label pentru formulare
    label: {
      base: 'block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2',
      required: "after:content-['*'] after:ml-1 after:text-[var(--brand-primary)]",
    },
    // Error text
    error: {
      base: 'text-xs text-red-600 dark:text-red-400 mt-1',
    },
    // Link-uri
    link: {
      base: 'text-[var(--brand-primary)] hover:text-[var(--brand-primary)]/80 transition-colors',
    },
  },
} as const;
