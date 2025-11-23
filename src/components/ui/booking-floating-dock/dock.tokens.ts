/**
 * 🎨 VisionOS Chrome Dock Tokens — Ultra Premium
 * Total alignment with design system (colors, spacing, motion, radii)
 */

import { designTokens } from '@/config/theme.config';

const { spacing, borderRadius, motion, colors } = designTokens;

export const dockTokens = {
  /** 📏 Sizes */
  size: {
    base: '44px', // VisionOS touch target
    hover: '88px', // 2x scale (luxury)
    iconBase: '22px', // 50% of container
    iconHover: '44px', // 50% of container
  },

  /** 🖥️ Desktop Chrome Panel */
  desktop: {
    height: '68px',
    gap: spacing.lg,
    paddingX: spacing.xl,
    paddingBottom: spacing.md,
    borderRadius: borderRadius['2xl'],
  },

  /** 📱 Mobile Chrome Capsule */
  mobile: {
    height: '68px',
    gap: spacing.lg,
    iconSize: '44px',
    iconInner: '22px',
    borderRadius: borderRadius['2xl'],
  },

  /** 🎨 Chrome Colors */
  colors: {
    container: {
      bg: colors.background.elevated,
      bgAlpha: 0.88,
      border: colors.border.subtle,
      borderAlpha: 0.3,
    },

    item: {
      bg: colors.background.surface, // Now exists in base.css
      bgHover: colors.background.elevated,
      border: colors.border.subtle,
    },

    active: {
      bg: colors.brand.primary,
      bgAlpha: 0.22,
      border: colors.brand.primary,
      borderAlpha: 0.45,
    },

    focus: {
      ring: colors.brand.primary,
      ringAlpha: 0.55,
    },

    tooltip: {
      bg: colors.background.elevated,
      border: colors.brand.primary,
      text: colors.text.primary,
    },
  },

  /** 🌊 Spring Physics */
  spring: {
    mass: 0.08,
    stiffness: 160,
    damping: 14,
  },

  /** 🎬 Motion */
  motion: {
    duration: motion.duration.normal,
    fastDuration: motion.duration.fast,
    easing: motion.easing.ease,
  },

  /** 🧲 AI Proximity */
  hover: {
    distance: 160,
    threshold: 40,
  },

  /** 💬 Tooltip visuals */
  tooltip: {
    offsetY: '-36px',
    paddingX: '10px',
    paddingY: '6px',
    fontSize: '0.8rem',
    borderRadius: borderRadius.md,
    backdropBlur: 16,
  },

  /** ✨ Chrome FX */
  effects: {
    backdropBlur: 24,
    chromeHighlight: 'inset 0 1px 0 rgba(255,255,255,0.25)',
    ambientGlow: '0 0 24px rgba(203,178,106,0.15)',
    elevatedShadow: '0 8px 32px rgba(0,0,0,0.18)',
    floatingShadow: '0 6px 20px rgba(0,0,0,0.15)',
  },
} as const;

export type DockTokens = typeof dockTokens;
