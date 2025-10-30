/**
 * 🧱 VANTAGE LANE DESIGN TOKENS
 * Unified export layer for all design tokens.
 * Enables clean imports like:
 *   import { colors, spacing, typography } from '@/design-system/tokens';
 */

export * from './colors';
export * from './shadows';
export * from './spacing';
export * from './typography';

// Legacy exports for compatibility
export { breakpoints, containers, mediaQueries } from './breakpoints';
export { luxuryCardTokens } from './luxury-card';

// UI Surfaces (new)
export { uiSurfaces, uiColors } from './ui-surfaces';
export type { UiSurfaces, UiColors } from './ui-surfaces';
