/**
 * 📏 Layout Tokens - Section spacing & alignment
 *
 * Consistent spacing across all page sections:
 * - Vertical padding standards
 * - Container max widths
 * - Section height guidelines
 * - Grid alignment
 */

export const layoutTokens = {
  // Section spacing (vertical padding)
  sectionSpacing: {
    xs: '2rem',
    sm: '3rem',
    md: '4rem',
    lg: '6rem',
    xl: '8rem',
    '2xl': '10rem',
  },

  // Container widths
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    full: '100%',
  },

  // Section heights
  sectionHeight: {
    hero: '90vh',
    heroMin: '600px',
    section: 'auto',
    feature: '80vh',
  },

  // Grid settings
  grid: {
    gap: '1.5rem',
    gapLg: '2rem',
    cols: {
      mobile: 1,
      tablet: 2,
      desktop: 3,
      wide: 4,
    },
  },
} as const;

// CSS Custom Properties untuk runtime usage
export const layoutCSSVars = {
  '--section-spacing-xs': layoutTokens.sectionSpacing.xs,
  '--section-spacing-sm': layoutTokens.sectionSpacing.sm,
  '--section-spacing-md': layoutTokens.sectionSpacing.md,
  '--section-spacing-lg': layoutTokens.sectionSpacing.lg,
  '--section-spacing-xl': layoutTokens.sectionSpacing.xl,
  '--section-spacing-2xl': layoutTokens.sectionSpacing['2xl'],
  '--hero-height': layoutTokens.sectionHeight.hero,
  '--hero-min-height': layoutTokens.sectionHeight.heroMin,
} as const;

export type LayoutTokens = typeof layoutTokens;
