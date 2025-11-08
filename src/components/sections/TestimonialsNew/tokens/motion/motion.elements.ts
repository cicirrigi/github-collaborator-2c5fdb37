/**
 * 🎭 MOTION TOKENS ELEMENTS - Vantage Lane Design System
 * Micro-animations pentru subcomponente individuale
 * Card, Badge, Avatar, Stars, Quote orchestration
 */

import { defaultTransition } from './motion.base';

export const motionElements = {
  // 🎴 Card animations - entrance, hover, focus
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
          type: 'spring' as const,
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
        ...defaultTransition,
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
        ...defaultTransition,
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
} as const;
