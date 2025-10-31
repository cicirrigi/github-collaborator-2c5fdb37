import { designTokens } from '@/config/theme.config';

/**
 * 🎨 useThemeTokens - Unified theme token access
 *
 * Provides consistent access to design tokens across components
 * with fallbacks and type safety.
 */
export function useThemeTokens() {
  return {
    colors: {
      text: {
        primary: designTokens.colors.text?.primary || 'var(--text-primary)',
        secondary: designTokens.colors.text?.secondary || 'var(--text-secondary)',
        muted: designTokens.colors.text?.muted || 'var(--text-muted)',
      },
      background: {
        dark: designTokens.colors.background?.dark || 'var(--background-dark)',
        elevated: designTokens.colors.background?.elevated || 'var(--background-elevated)',
        surface: designTokens.colors.background?.surface || 'var(--background-surface)',
      },
      brand: {
        primary: designTokens.colors.brand?.primary || 'var(--brand-primary)',
        secondary: designTokens.colors.brand?.secondary || 'var(--brand-secondary)',
        accent: designTokens.colors.brand?.accent || 'var(--brand-accent)',
      },
      border: {
        subtle: designTokens.colors.border?.subtle || 'var(--border-subtle)',
        default: designTokens.colors.border?.default || 'var(--border-default)',
      },
    },
    motion: {
      duration: {
        fast: designTokens.animations?.duration?.fast || '150ms',
        normal: designTokens.animations?.duration?.normal || '300ms',
        slow: designTokens.animations?.duration?.slow || '500ms',
        ultra: designTokens.motion?.duration?.ultra || '800ms',
      },
      easing: {
        ease: designTokens.motion?.easing?.ease || ([0.4, 0, 0.2, 1] as const),
        bounce: designTokens.motion?.easing?.bounce || ([0.68, -0.55, 0.265, 1.55] as const),
      },
    },
    gradients: designTokens.gradients,
    spacing: designTokens.spacing,
    borderRadius: designTokens.borderRadius,
  };
}
