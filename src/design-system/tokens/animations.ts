/**
 * 🎬 Animation Tokens - Vantage Lane Design System
 * Motion timing, easing curves, and animation presets
 */

export const animations = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    // Backwards compatibility - flat structure
    linear: 'linear',
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    // CSS strings for regular CSS animations
    css: {
      linear: 'linear',
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    // Framer Motion compatible (arrays of 4 numbers)
    framer: {
      linear: 'linear',
      ease: [0.4, 0, 0.2, 1],
      bounce: [0.68, -0.55, 0.265, 1.55],
      easeOut: 'easeOut',
      easeIn: 'easeIn',
    },
  },
} as const;

// Enhanced motion tokens for new components
export const motion = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    ultra: '800ms',
  },
  easing: {
    ease: [0.4, 0, 0.2, 1] as const,
    bounce: [0.68, -0.55, 0.265, 1.55] as const,
  },
} as const;

export type AnimationTokens = typeof animations;
export type MotionTokens = typeof motion;
