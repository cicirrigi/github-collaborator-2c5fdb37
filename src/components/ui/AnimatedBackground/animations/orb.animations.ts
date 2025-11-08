/**
 * 🎬 Orb Animation Variants
 *
 * Framer Motion animation definitions for floating orbs
 */

import type { Variants } from 'framer-motion';

import { motionTokens } from '../AnimatedBackground.tokens';

/**
 * Seeded random for deterministic animations (prevents hydration errors)
 */
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

/**
 * Continuous floating animation - smooth infinite loop
 * Multiple directions for natural ambient movement
 * Uses custom parameter to create deterministic but varied paths
 */
export const floatingVariants: Variants = {
  initial: {
    x: 0,
    y: 0,
    scale: 1,
    opacity: 0,
  },
  animate: (custom: { duration: number; seed: number }) => {
    // Deterministic direction based on seed (from orb id)
    const xRange = seededRandom(custom.seed) * 200 - 100; // -100 to 100
    const yRange = seededRandom(custom.seed + 1) * 200 - 100;

    return {
      x: [0, xRange, -xRange * 0.5, xRange * 0.3, 0],
      y: [0, yRange, -yRange * 0.5, yRange * 0.3, 0],
      scale: [1, 1.1, 0.9, 1.05, 1],
      opacity: [0, 0.8, 0.8, 0.8, 0.8],
      transition: {
        duration: custom.duration,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'linear', // Smooth continuous motion
        repeatType: 'loop', // Seamless loop
      },
    };
  },
};

/**
 * Pulse animation for subtle breathing effect
 */
export const pulseVariants: Variants = {
  initial: {
    scale: 1,
    opacity: 0.8,
  },
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 4,
      repeat: Number.POSITIVE_INFINITY,
      ease: 'easeInOut',
    },
  },
};

/**
 * Container fade in animation
 */
export const containerVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 1.5,
      ease: motionTokens.easing,
    },
  },
};
