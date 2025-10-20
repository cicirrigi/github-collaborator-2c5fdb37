/**
 * 🧱 VANTAGE LANE DESIGN TOKENS
 * Unified export layer for all design tokens.
 * Enables clean imports like:
 *   import { colors, spacing, typography } from '@/design-system/tokens';
 */

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './shadows';

// Legacy exports for compatibility
export { breakpoints, containers, mediaQueries } from './breakpoints';
export { luxuryCardTokens } from './luxury-card';
