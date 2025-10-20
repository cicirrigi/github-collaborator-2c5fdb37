/**
 * 📦 UI Components - Barrel Export
 *
 * Enterprise design system components.
 * All connected to theme.config.ts for consistency.
 */

// Core UI Primitives
export type { BadgeProps } from './Badge';
export { Badge } from './Badge';
export type { ButtonProps } from './Button';
export { Button } from './Button';
export type { CardProps } from './Card';
export { Card } from './Card';
export type { TextProps } from './Text';
export { Text } from './Text';

// Luxury Components
export type {
  LuxuryCardHover,
  LuxuryCardProps,
  LuxuryCardSize,
  LuxuryCardVariant,
} from './LuxuryCard';
export { LuxuryCard } from './LuxuryCard';

// Theme Controls
export { ThemeToggle } from './theme-toggle';
export * from './TestButton';
export * from './PremiumButton';
