/**
 * 🎞️ MOTION TOKENS BASE - Vantage Lane Design System
 * Default transitions, global variants și motion presets
 * Foundation layer pentru toate animațiile din sistem
 */

// 🎯 Default transition pentru uniformitate completă
export const defaultTransition = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 30,
};

export const motionBase = {
  // ⚡ Transition presets pentru diferite use cases
  transitions: {
    // Smooth pentru hover effects
    smooth: {
      type: 'tween' as const,
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1] as const,
    },
    // Spring pentru interactive elements
    spring: defaultTransition,
    // Bounce pentru accent elements
    bounce: {
      type: 'spring' as const,
      stiffness: 600,
      damping: 20,
    },
    // Slow pentru entrance animations
    slow: {
      type: 'spring' as const,
      stiffness: 200,
      damping: 30,
      duration: 0.8,
    },
  },

  // 🎪 Scroll-triggered animations
  scroll: {
    // Pentru animații când elementul intră în viewport
    viewport: {
      once: true,
      margin: '0px 0px -100px 0px',
    },
    // Animație de reveal pentru secțiuni
    reveal: {
      initial: {
        opacity: 0,
        y: 50,
      },
      whileInView: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.8,
          ease: [0.4, 0, 0.2, 1] as const,
        },
      },
    },
  },

  // 🎯 Global variants pentru different states
  variants: {
    // Loading state
    loading: {
      opacity: 0.6,
      scale: 0.98,
      transition: {
        repeat: Infinity,
        repeatType: 'reverse' as const,
        duration: 1,
      },
    },
    // Error state
    error: {
      x: [-2, 2, -2, 2, 0],
      transition: {
        duration: 0.4,
      },
    },
    // Success state
    success: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 0.6,
      },
    },
  },
} as const;
