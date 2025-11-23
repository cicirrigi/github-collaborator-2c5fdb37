/**
 * 💎 Pricing Section Design Tokens - Vantage Lane 2.0
 *
 * Centralized styling tokens for pricing section.
 * Consistent with design system and theme.
 */

import { typography } from '@/design-system/tokens/typography';

export const pricingTokens = {
  /**
   * Container & Layout
   */
  container: {
    base: 'relative w-full overflow-hidden py-20 md:py-32',
    maxWidth: 'mx-auto max-w-7xl px-6 lg:px-8',
    background: 'bg-black',
  },

  /**
   * Typography
   */
  typography: {
    title: {
      primary: `${typography.classes.sectionTitle} text-white`,
      accent: 'text-[var(--brand-primary)] font-light',
      container: 'mb-4',
    },
    subtitle: {
      base: 'text-lg md:text-xl text-neutral-400 font-light max-w-3xl mx-auto',
      container: 'mb-8',
    },
    commitment: {
      container: 'flex flex-wrap items-center justify-center gap-4 mb-16',
      item: 'text-sm text-neutral-500 flex items-center gap-2',
      icon: 'text-[var(--brand-primary)]',
    },
  },

  /**
   * Grid Layout
   */
  grid: {
    container: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch',
  },

  /**
   * Card - Traditional Vertical Layout
   */
  card: {
    icon: 'inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--brand-primary)]/10 to-[var(--brand-primary)]/5 border border-[var(--brand-primary)]/20 text-[var(--brand-primary)] mb-4',
    name: 'text-2xl font-light text-white mb-1.5',
    tagline: 'text-sm text-neutral-400 mb-4 min-h-[40px]',
    price: {
      container: 'mb-4',
      amount: 'text-lg font-light text-[var(--brand-primary)]',
      note: 'text-xs text-neutral-500 mt-1',
    },
    divider: 'h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4',
    features: {
      container: 'space-y-3 flex-1',
      item: 'flex items-start gap-3',
      icon: 'w-4 h-4 text-[var(--brand-primary)] flex-shrink-0',
      text: 'text-sm text-neutral-300 leading-snug flex-1',
    },
    button:
      'w-full text-center py-2.5 px-5 text-sm rounded-lg bg-gradient-to-br from-white/95 via-neutral-50/90 to-white/95 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 border-2 border-t-neutral-700/40 border-l-neutral-700/40 border-b-neutral-800 border-r-neutral-800 dark:border-t-white/5 dark:border-l-white/5 dark:border-b-black dark:border-r-black shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)] text-[var(--brand-primary)] font-light hover:scale-[1.02] transition-all duration-200',
  },

  /**
   * Popular Badge
   */
  badge: {
    container: 'absolute top-4 right-4 z-10',
    base: 'px-3 py-1 text-xs font-medium bg-[var(--brand-primary)]/20 text-[var(--brand-primary)] rounded-full border border-[var(--brand-primary)]/30',
  },

  /**
   * Bottom CTA
   */
  bottomCta: {
    container: 'mt-16 text-center',
    description: 'text-neutral-400 mb-6',
    button:
      'inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[var(--brand-primary)] to-[#9B8347] text-black font-medium rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg shadow-[var(--brand-primary)]/20',
  },
} as const;
