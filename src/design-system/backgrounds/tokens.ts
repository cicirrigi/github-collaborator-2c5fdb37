/**
 * 🎨 Background Design Tokens
 * Theme-aware colors and patterns for backgrounds
 */

import type { GradientConfig, NoiseConfig, RadialGlowConfig } from './types';

// Theme-aware gradient configurations
export const gradients = {
  dark: {
    subtle: {
      from: '#000000',
      via: '#050505',
      to: '#0a0a0a',
      angle: 135,
    },
    dramatic: {
      from: '#000000',
      via: '#080808',
      to: '#0f0f0f',
      angle: 180,
    },
  },
  light: {
    subtle: {
      from: '#f9fafb',
      via: '#f3f4f6',
      to: '#e5e7eb',
      angle: 135,
    },
    dramatic: {
      from: '#ffffff',
      via: '#f5f5f5',
      to: '#e0e0e0',
      angle: 180,
    },
  },
} as const;

// Radial glow configurations
export const glowColors = {
  dark: {
    gold: 'rgba(203, 178, 106, 0.08)',
    goldSubtle: 'rgba(203, 178, 106, 0.04)',
    goldDramatic: 'rgba(203, 178, 106, 0.12)',
  },
  light: {
    gold: 'rgba(203, 178, 106, 0.12)',
    goldSubtle: 'rgba(203, 178, 106, 0.06)',
    goldDramatic: 'rgba(203, 178, 106, 0.20)',
  },
} as const;

// Position mappings for radial glows
export const glowPositions = {
  'top-left': '10% 10%',
  'top-right': '90% 10%',
  'bottom-left': '10% 90%',
  'bottom-right': '90% 90%',
  center: '50% 50%',
} as const;

// Noise configurations
export const noiseConfigs: Record<string, NoiseConfig> = {
  subtle: {
    opacity: 0.02,
    scale: 1,
  },
  normal: {
    opacity: 0.03,
    scale: 1,
  },
  dramatic: {
    opacity: 0.05,
    scale: 1.2,
  },
} as const;

// Helper to get theme-aware gradient
export function getGradient(theme: 'dark' | 'light', style: 'subtle' | 'dramatic'): GradientConfig {
  return gradients[theme][style];
}

// Helper to get theme-aware glow color
export function getGlowColor(
  theme: 'dark' | 'light',
  intensity: 'gold' | 'goldSubtle' | 'goldDramatic'
): string {
  return glowColors[theme][intensity];
}

// Helper to create glow config
export function createGlow(
  position: keyof typeof glowPositions,
  theme: 'dark' | 'light',
  intensity: 'gold' | 'goldSubtle' | 'goldDramatic' = 'gold',
  size = '800px'
): RadialGlowConfig {
  return {
    position,
    color: getGlowColor(theme, intensity),
    size,
    opacity: 1,
  };
}
