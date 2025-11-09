/**
 * 🛡️ VantageAssuranceSection Design Tokens
 * Styling constants for trust & prestige section
 */

export const assuranceTokens = {
  /**
   * Spacing & Layout
   */
  spacing: {
    section: 'py-16 md:py-20',
    container: 'max-w-7xl mx-auto px-6 lg:px-8',
    grid: 'gap-8 md:gap-10 lg:gap-12',
    item: 'space-y-2',
    titleBottom: 'mb-4',
    separatorBottom: 'mb-6',
    headlineBottom: 'mb-3',
    subtextBottom: 'mb-6',
    factsBottom: 'mb-12',
    footerTop: 'mt-12',
  },

  /**
   * Typography
   */
  typography: {
    title: {
      base: 'text-4xl md:text-5xl font-light tracking-wide text-center',
      primary: 'text-[var(--text-primary)]',
      accent: 'text-[var(--brand-primary)]',
    },
    headline: {
      base: 'text-2xl md:text-3xl font-light tracking-wide text-center',
      primary: 'text-[var(--text-primary)]',
      accent: 'text-[var(--brand-primary)]',
    },
    subtext: {
      base: 'text-sm md:text-base text-center max-w-3xl mx-auto',
      color: 'text-neutral-400 dark:text-neutral-500',
    },
    facts: {
      base: 'text-sm md:text-base text-center flex flex-wrap items-center justify-center gap-3',
      color: 'text-neutral-500 dark:text-neutral-600',
    },
    item: {
      label: 'text-lg md:text-xl font-medium text-[var(--text-primary)]',
      subtext: 'text-sm md:text-base text-neutral-400 dark:text-neutral-500 italic',
    },
    footer: {
      base: 'text-sm md:text-base text-center italic',
      color: 'text-neutral-400 dark:text-neutral-500',
      link: 'text-[var(--brand-primary)] hover:underline',
    },
  },

  /**
   * Colors
   */
  colors: {
    icon: 'text-[var(--brand-primary)]',
    iconHover: 'group-hover:text-[var(--brand-primary)]',
    separator: 'text-[var(--brand-primary)]/30',
  },

  /**
   * Icon sizing
   */
  icon: {
    size: 'w-12 h-12 md:w-14 md:h-14',
    stroke: 'stroke-[1.5]',
    // Small icons for facts bar
    factSize: 'w-4 h-4',
    factStroke: 'stroke-[2]',
  },

  /**
   * Grid layout
   */
  grid: {
    container: 'grid grid-cols-2 lg:grid-cols-3',
    item: 'flex flex-col items-center text-center',
  },

  /**
   * Effects & Animations
   */
  effects: {
    itemHover: 'transition-all duration-300 hover:scale-105',
    iconGlow: 'drop-shadow-[0_0_8px_rgba(203,178,106,0.3)]',
    separator: 'mx-2',
  },

  /**
   * Animation timings
   */
  animations: {
    stagger: 0.1,
    duration: 0.6,
    ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  },
} as const;

export type AssuranceTokens = typeof assuranceTokens;
