/**
 * 🎞️ MOTION TOKENS SYSTEM - Vantage Lane Design System
 * Unified orchestration for all Framer Motion interactions
 * ---------------------------------------------------------
 * ⚠️  DEPRECATED: Use modular system from ./motion/ folder
 * This file is kept for backward compatibility only
 *
 * New imports:
 * import { motionTokens } from './motion'
 * ---------------------------------------------------------
 * Structure:
 * - base: default transitions and global variants
 * - elements: cards, avatars, badges, stars
 * - sections: scroll reveal and headers
 */

// 🎯 Default transition pentru uniformitate completă
const defaultTransition = { type: 'spring', stiffness: 400, damping: 30 };

export const motionTokens = {
  // 🎭 Card animations - entrance, hover, focus
  card: {
    // Initial state pentru fade-in
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    // Animate state pentru entrance
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
    // Hover state
    hover: {
      y: -4,
      scale: 1.02,
      willChange: 'transform, opacity',
      transition: defaultTransition,
    },
    // Tap state pentru mobile
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1,
      },
    },
    // Exit state
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  },

  // 🌊 Grid stagger animations
  grid: {
    container: {
      initial: {},
      animate: {
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.2,
        },
      },
    },
    item: {
      initial: {
        opacity: 0,
        y: 30,
      },
      animate: {
        opacity: 1,
        y: 0,
        willChange: 'transform, opacity',
        transition: {
          ...defaultTransition,
          stiffness: 300,
          duration: 0.6,
        },
      },
    },
  },

  // ⭐ Rating stars animation
  stars: {
    container: {
      initial: {},
      animate: {
        transition: {
          staggerChildren: 0.05,
        },
      },
    },
    star: {
      initial: {
        opacity: 0,
        scale: 0.5,
        rotate: -10,
      },
      animate: {
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: {
          type: 'spring',
          stiffness: 500,
          damping: 25,
        },
      },
      hover: {
        scale: 1.2,
        rotate: 5,
        transition: {
          duration: 0.2,
        },
      },
    },
  },

  // 🏷️ Badge animation
  badge: {
    initial: {
      opacity: 0,
      x: -20,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.3,
        type: 'spring',
        stiffness: 400,
        damping: 30,
      },
    },
    hover: {
      scale: 1.05,
      x: 2,
      transition: {
        duration: 0.2,
      },
    },
  },

  // 👤 Avatar animation
  avatar: {
    initial: {
      opacity: 0,
      scale: 0.8,
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.4,
        type: 'spring',
        stiffness: 400,
        damping: 25,
      },
    },
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.3,
      },
    },
  },

  // 💬 Quote text animation
  quote: {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        delay: 0.5,
        duration: 0.8,
      },
    },
  },

  // 🌟 Section header animations
  header: {
    title: {
      initial: {
        opacity: 0,
        y: 30,
      },
      animate: {
        opacity: 1,
        y: 0,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 30,
        },
      },
    },
    subtitle: {
      initial: {
        opacity: 0,
        y: 20,
      },
      animate: {
        opacity: 1,
        y: 0,
        transition: {
          delay: 0.2,
          type: 'spring',
          stiffness: 300,
          damping: 30,
        },
      },
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
          ease: [0.4, 0, 0.2, 1],
        },
      },
    },
  },

  // ⚡ Transition presets pentru diferite use cases
  transitions: {
    // Smooth pentru hover effects
    smooth: {
      type: 'tween',
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
    // Spring pentru interactive elements
    spring: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
    // Bounce pentru accent elements
    bounce: {
      type: 'spring',
      stiffness: 600,
      damping: 20,
    },
    // Slow pentru entrance animations
    slow: {
      type: 'spring',
      stiffness: 200,
      damping: 30,
      duration: 0.8,
    },
  },

  // 🎯 Variants pentru different states
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
