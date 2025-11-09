/**
 * 📖 NarrativeSection Design Tokens
 * Spacing, typography, colors, and layout tokens
 */

export const narrativeTokens = {
  /**
   * Section container
   */
  container: {
    base: 'relative w-full py-24 md:py-32',
    maxWidth: 'mx-auto max-w-7xl px-6 lg:px-8',
  },

  /**
   * Layout grid (text + image)
   */
  layout: {
    grid: 'grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start',
    textColumn: 'order-1',
    imageColumn: 'order-2',
  },

  /**
   * Typography - CONSISTENT with VantageAssurance
   */
  typography: {
    title: {
      base: 'text-4xl md:text-5xl font-light tracking-wide text-center lg:text-left',
      primary: 'text-[var(--text-primary)]',
      accent: 'text-[var(--brand-primary)]',
    },
    subheadline: {
      base: 'text-lg md:text-xl leading-relaxed text-center lg:text-left mb-12',
      color: 'text-neutral-300',
    },
    paragraph: {
      base: 'text-base md:text-lg leading-relaxed md:leading-loose',
      color: 'text-neutral-400',
    },
    emphasis: {
      color: 'text-[var(--brand-primary)]',
    },
    cta: {
      base: 'inline-flex items-center gap-2 text-[var(--brand-primary)]/70 hover:text-[var(--brand-primary)] transition-colors duration-300',
      fontSize: 'text-sm md:text-base',
      weight: 'font-light',
    },
  },

  /**
   * Spacing - refined luxury breathing room
   */
  spacing: {
    titleBottom: 'mb-6',
    separatorBottom: 'mb-4',
    blockGap: 'space-y-6',
    innerGap: 'space-y-2',
  },

  /**
   * Separator lines (gold) - refined & elegant
   */
  separator: {
    main: 'h-1 bg-gradient-to-r from-[var(--brand-primary)] to-[#E5D485] mx-auto lg:mx-0',
    divider: 'w-20 h-[1px] bg-[#CBB26A]/50 mx-auto lg:mx-0',
  },

  /**
   * Image/Visual - cinematic luxury styling
   */
  visual: {
    container: 'relative w-full',
    wrapper:
      'relative w-full h-[280px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-2xl lg:rounded-3xl shadow-xl lg:shadow-2xl ring-1 ring-white/10',
    image:
      'object-contain md:object-cover object-center hover:scale-105 transition-transform duration-700',
    overlay: 'absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10',
  },

  /**
   * Animation timings
   */
  animations: {
    stagger: 0.15,
    duration: 0.6,
    ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  },
} as const;

export type NarrativeTokens = typeof narrativeTokens;
