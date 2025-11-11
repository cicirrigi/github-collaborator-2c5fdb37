/**
 * ✍️ Typography Tokens - Vantage Lane Design System
 * Font families, sizes, weights, and line heights
 */

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    display: ['Playfair Display', 'serif'],
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  /**
   * Standard classes pentru consistență across sections
   */
  classes: {
    sectionTitle: 'text-4xl md:text-5xl font-light tracking-wide',
    sectionSubtitle: 'text-2xl md:text-3xl font-light tracking-wide',
  },
  /**
   * Effects - glow subtil pentru text auriu
   */
  effects: {
    goldGlow: {
      textShadow: '0 0 15px rgba(203, 178, 106, 0.25), 0 0 30px rgba(203, 178, 106, 0.12)',
      filter: 'brightness(1.08)',
    },
  },
} as const;

export type TypographyTokens = typeof typography;
