/**
 * 💎 Pricing Section Design Tokens - Vantage Lane 2.0
 *
 * Centralized styling tokens for pricing section.
 * Consistent with design system and theme.
 */

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
      primary: 'text-4xl md:text-5xl lg:text-6xl font-light tracking-wide text-white',
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
    container: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4',
  },

  /**
   * Card - Traditional Vertical Layout
   */
  card: {
    icon: 'text-[var(--brand-primary)] mb-4',
    name: 'text-2xl font-light text-white mb-1.5',
    tagline: 'text-sm text-neutral-400 mb-4',
    price: {
      container: 'mb-4',
      amount: 'text-2xl font-light text-[var(--brand-primary)]',
      note: 'text-xs text-neutral-500 mt-1',
    },
    divider: 'h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4',
    features: {
      container: 'space-y-2.5 flex-1 mb-4',
      item: 'flex items-start gap-2',
      icon: 'w-4 h-4 text-[var(--brand-primary)] flex-shrink-0 mt-0.5',
      text: 'text-sm text-neutral-300 leading-relaxed',
    },
    button:
      'w-full text-center py-2.5 px-5 text-sm rounded-lg bg-gradient-to-r from-[var(--brand-primary)]/20 to-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/30 text-[var(--brand-primary)] font-light hover:from-[var(--brand-primary)]/30 hover:to-[var(--brand-primary)]/20 hover:border-[var(--brand-primary)]/50 transition-all duration-300',
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
