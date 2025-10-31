/**
 * 🌈 Gradient Tokens - Vantage Lane Design System
 * Luxury gradients for backgrounds and accents
 */

export const gradients = {
  footerLuxury:
    'linear-gradient(135deg, var(--brand-primary) 0%, transparent 50%, var(--brand-primary) 100%)',
  heroGradient:
    'linear-gradient(180deg, var(--background-dark) 0%, var(--background-elevated) 100%)',
  cardGlow: 'radial-gradient(circle, var(--brand-primary) 0%, transparent 70%)',
} as const;

export type GradientTokens = typeof gradients;
