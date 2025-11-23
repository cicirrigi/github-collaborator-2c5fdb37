/**
 * 🎴 Luxury Card Design Tokens - Vantage Lane 2.0
 * Extracted from original component, no hardcoded values
 */

export const luxuryCardTokens = {
  colors: {
    goldGlow: 'var(--brand-primary)',
    shimmerPrimary: 'var(--brand-accent)',
    hoverGlow: 'var(--brand-primary)',
  },
  sizes: {
    icon: {
      sm: { width: '2rem', height: '2rem' }, // 32x32px
      md: { width: '3rem', height: '3rem' }, // 48x48px
      lg: { width: '4rem', height: '4rem' }, // 64x64px
      xl: { width: '4.5rem', height: '4.5rem' }, // 72x72px
      vantage: { width: '5rem', height: '5rem' }, // 80x80px
    },
  },
  durations: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    shimmer: '1000ms',
    cardShimmer: '1200ms',
  },
  scales: {
    hover: {
      container: '1.1', // scale-110
      icon: '1.05', // scale-105
    },
  },
  effects: {
    shimmer: {
      gradient: 'linear-gradient(90deg, transparent, var(--brand-accent)/20, transparent)',
      gradientIntense: 'linear-gradient(90deg, transparent, var(--brand-accent)/40, transparent)',
      skew: '-12deg',
      width: '200%',
      duration: '1200ms',
      easing: 'ease-out',
    },
    glow: {
      gradient: 'linear-gradient(135deg, var(--brand-primary)/5, transparent)',
      background: 'var(--brand-primary)/10',
      dropShadow: '0_0_12px_var(--brand-primary)/60',
      duration: '300ms',
      easing: 'ease-in-out',
    },
    hover: {
      scale: '1.05',
      duration: '300ms',
      easing: 'ease-in-out',
    },
  },
  shadows: {
    base: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
    hover:
      '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2), 0 0 30px var(--brand-primary)/15',
  },
} as const;

export default luxuryCardTokens;
