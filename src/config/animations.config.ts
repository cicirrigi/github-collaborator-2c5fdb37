/**
 * 🎬 Global Animation Configuration - Vantage Lane 2.0
 *
 * Centralized Framer Motion variants for consistent animations across the site.
 * All animations use the same easing and duration for visual harmony.
 */

import type { Variants } from 'framer-motion';

/**
 * Standard easing function - smooth and premium feel
 */
export const ease = [0.25, 0.46, 0.45, 0.94] as const;

/**
 * Standard duration for all animations
 */
export const duration = 0.6;

/**
 * Motion defaults
 */
export const motionDefaults = {
  duration,
  ease,
} as const;

/**
 * Viewport settings for scroll-triggered animations
 */
export const viewport = {
  once: true,
  margin: '0px', // Trigger când intră în viewport (smooth)
} as const;

/**
 * 📤 Fade In Up - Element appears from below with fade
 * Use for: Cards, content blocks, general reveals
 */
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...motionDefaults,
    },
  },
};

/**
 * 🌫️ Fade In - Simple opacity fade without movement
 * Use for: Text, subtle elements, backgrounds
 */
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      ...motionDefaults,
    },
  },
};

/**
 * 👈 Slide In Left - Element slides from left to right
 * Use for: Services cards (sequential left-to-right reveal)
 */
export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      ...motionDefaults,
    },
  },
};

/**
 * 👉 Slide In Right - Element slides from right to left
 * Use for: Alternative card animations
 */
export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      ...motionDefaults,
    },
  },
};

/**
 * 📦 Stagger Container - Parent wrapper for sequential animations
 * Use for: Card grids, lists, any group of animated children
 *
 * Children will animate in sequence with 0.1s delay between each
 */
export const staggerContainer: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/**
 * 📏 Line Expand - Horizontal line expanding from center
 * Use for: Separator lines, dividers
 */
export const lineExpand: Variants = {
  hidden: {
    opacity: 0,
    scaleX: 0,
  },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: {
      duration: 0.8,
      ease,
      willChange: 'transform, opacity',
    },
  },
};

/**
 * 🔝 Slide In Up (Pricing specific) - Larger movement from below
 * Use for: Pricing cards (bottom-to-top reveal)
 */
export const slideInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...motionDefaults,
    },
  },
};

/**
 * 🎯 Export all variants as a single object for easier imports
 */
export const animations = {
  fadeInUp,
  fadeIn,
  slideInLeft,
  slideInRight,
  staggerContainer,
  lineExpand,
  slideInUp,
  viewport,
  ease,
  duration,
  motionDefaults,
} as const;

export default animations;
