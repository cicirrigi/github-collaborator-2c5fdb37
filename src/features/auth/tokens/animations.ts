/**
 * ⚡ Auth Animations Tokens - Vantage Lane 2.0
 *
 * Accordions, transitions și animații pentru Auth
 * Optimizat pentru smooth UX
 */

export const authAnimationTokens = {
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
      confirm: 'max-h-[90px]', // Reduced pentru smooth transition
      terms: 'max-h-[140px]', // Reduced pentru smooth transition
    },
  },

  /**
   * Tab Animations - Premium separated tabs
   */
  tabs: {
    container: `
      relative flex items-center justify-between
      bg-neutral-900/30 dark:bg-neutral-900/50
      backdrop-blur-sm rounded-full p-1 mb-8 gap-2
      border border-white/10 shadow-inner overflow-hidden
    `,
    tab: {
      base: `
        relative flex-1 text-center py-3 text-sm font-semibold rounded-full
        transition-all duration-300 ease-out cursor-pointer z-10
      `,
      active: `
        text-black font-bold z-10
      `,
      inactive: `
        text-neutral-400 dark:text-neutral-500
        hover:text-[var(--brand-primary)]
        hover:bg-white/10
      `,
      indicator: `
        absolute top-1 bottom-1 left-1 right-1 w-[calc(50%-4px)]
        bg-[var(--brand-primary)] rounded-full 
        transition-transform duration-500 ease-out
        shadow-[0_4px_12px_rgba(203,178,106,0.35)]
        z-0
      `,
    },
  },

  /**
   * Form Transitions (pentru loading states)
   */
  form: {
    fadeIn: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4 },
    },
    slideUp: {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.2 },
    },
  },

  /**
   * Button Animations
   */
  button: {
    hover: 'hover:scale-105 active:scale-95',
    loading: 'animate-pulse',
    transition: 'transition-all duration-300',
  },
} as const;
