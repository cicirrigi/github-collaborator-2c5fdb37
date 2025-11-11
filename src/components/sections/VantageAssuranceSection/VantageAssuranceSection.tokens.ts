/**
 * 🛡️ VantageAssuranceSection Design Tokens
 * Styling constants for trust & prestige section
 */

import { typography } from '@/design-system/tokens/typography';

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
    headlineBottom: 'mb-6',
    subtextBottom: 'mb-16',
    factsBottom: 'mb-12',
    footerTop: 'mt-12',
  },

  /**
   * Typography
   */
  typography: {
    title: {
      base: `${typography.classes.sectionTitle} text-center`,
      primary: 'text-[var(--text-primary)]',
      accent: 'text-[var(--brand-primary)]',
    },
    headline: {
      base: `${typography.classes.sectionSubtitle} text-center`,
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

  /**
   * LogoBand styling - Luxury prestige band (Rolls-Royce inspired)
   */
  logoBand: {
    container: 'relative mt-16 py-12 overflow-hidden rounded-2xl',
    haloBlur:
      'absolute inset-0 bg-gradient-to-b from-[#CBB26A]/10 via-[#CBB26A]/5 to-transparent blur-3xl opacity-50',
    vignette: 'absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80',
    content: 'relative z-10',
    // Layout cu linii laterale + text + branduri
    layout: {
      wrapper: 'flex flex-col items-center gap-8',
      horizontalBar: 'flex items-center justify-center gap-6 md:gap-8 w-full max-w-5xl mx-auto',
    },
    text: {
      base: 'uppercase tracking-[0.35em] text-xs font-light whitespace-nowrap',
      color: 'text-neutral-400',
    },
    divider: {
      // Linii mai scurte, 20-25% din lățime
      line: 'h-[1px] bg-[#CBB26A]/30 w-32 md:w-40',
    },
    logos: {
      container: 'flex items-center justify-center flex-wrap gap-x-6 md:gap-x-8',
      item: 'text-[#CBB26A]/90 text-base md:text-lg tracking-wide font-light hover:text-[#CBB26A] transition-all duration-300',
      // Item central (Emirates) - doar mai luminous
      itemCentral: 'text-[#CBB26A] text-base md:text-lg tracking-wide font-light',
      separator: 'text-[#CBB26A]/30 text-sm',
      // Optical spacing - mai mult în centru
      spacingNormal: 'gap-6',
      spacingWide: 'gap-10 md:gap-12',
    },
    effects: {
      textShadow: '0 0 10px rgba(203,178,106,0.2)',
    },
  },
} as const;

export type AssuranceTokens = typeof assuranceTokens;
