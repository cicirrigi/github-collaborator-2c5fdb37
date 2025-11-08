/**
 * 📐 Spacing Tokens - Vantage Lane Design System
 * Consistent spacing scale for margins, padding, gaps
 */

export const spacing = {
  xs: '0.5rem',
  sm: '0.75rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
  '4xl': '6rem',
  '5xl': '8rem',
} as const;

export type SpacingTokens = typeof spacing;
