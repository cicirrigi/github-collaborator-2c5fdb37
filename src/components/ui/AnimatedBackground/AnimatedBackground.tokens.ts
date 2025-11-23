/**
 * 🎨 AnimatedBackground Design Tokens
 *
 * All visual values from design system - zero hardcoding
 */

import { designTokens } from '@/config/theme.config';

import type {
  AnimationSpeed,
  BackgroundVariant,
  ColorScheme,
  IntensityLevel,
  OrbConfig,
} from './AnimatedBackground.types';

/**
 * Color configurations per scheme
 */
export const colorSchemes: Record<
  ColorScheme,
  { primary: string; secondary: string; accent: string }
> = {
  gold: {
    primary: designTokens.colors.brand.primary,
    secondary: designTokens.colors.brand.secondary,
    accent: designTokens.colors.brand.accent,
  },
  silver: {
    primary: 'rgba(220, 220, 255, 0.4)',
    secondary: 'rgba(180, 180, 200, 0.3)',
    accent: 'rgba(240, 240, 255, 0.2)',
  },
  multi: {
    primary: designTokens.colors.brand.primary,
    secondary: 'rgba(220, 220, 255, 0.3)',
    accent: 'rgba(180, 180, 200, 0.2)',
  },
} as const;

/**
 * Animation speed multipliers
 */
export const speedMultipliers: Record<AnimationSpeed, number> = {
  slow: 1.5,
  normal: 1.0,
  fast: 0.7,
} as const;

/**
 * Intensity configurations
 */
export const intensityConfigs: Record<
  IntensityLevel,
  { orbCount: number; blurMultiplier: number; opacityMultiplier: number }
> = {
  low: {
    orbCount: 10,
    blurMultiplier: 0.8,
    opacityMultiplier: 0.7,
  },
  medium: {
    orbCount: 20,
    blurMultiplier: 1.0,
    opacityMultiplier: 0.8,
  },
  high: {
    orbCount: 25,
    blurMultiplier: 1.2,
    opacityMultiplier: 0.9,
  },
} as const;

/**
 * Seeded random function for deterministic results (prevents hydration errors)
 */
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

/**
 * Generate deterministic orbs for continuous floating effect
 * Uses seeded random to prevent SSR/client hydration mismatch
 */
const generateDeterministicOrbs = (count: number): OrbConfig[] => {
  const orbs: OrbConfig[] = [];
  const colors: Array<'primary' | 'secondary' | 'accent'> = ['primary', 'secondary', 'accent'];

  for (let i = 0; i < count; i++) {
    const colorIndex = i % colors.length;
    const seedBase = i * 7; // Different seed per orb

    orbs.push({
      id: `orb-${i}`,
      size: seededRandom(seedBase + 1) * 150 + 100, // 100-250px
      startX: seededRandom(seedBase + 2) * 100,
      startY: seededRandom(seedBase + 3) * 100,
      blur: seededRandom(seedBase + 4) * 40 + 40, // 40-80px
      opacity: seededRandom(seedBase + 5) * 0.4 + 0.3, // 0.3-0.7
      duration: seededRandom(seedBase + 6) * 15 + 15, // 15-30s
      color: colors[colorIndex] as 'primary' | 'secondary' | 'accent',
      zIndex: i,
    });
  }
  return orbs;
};

/**
 * Orb presets per variant
 */
export const orbPresets: Record<BackgroundVariant, OrbConfig[]> = {
  luxury: generateDeterministicOrbs(20),
  minimal: generateDeterministicOrbs(12),
  ambient: generateDeterministicOrbs(25),
} as const;

/**
 * Motion tokens for animations
 */
export const motionTokens = {
  easing: designTokens.animations.easing.framer.ease,
  stiffness: 50,
  damping: 20,
  mass: 1.2,
} as const;

/**
 * Responsive breakpoints for size adjustments
 */
export const responsiveMultipliers = {
  mobile: 0.6,
  tablet: 0.8,
  desktop: 1.0,
} as const;
