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

// Special Effects Components
export { InfiniteMovingCards } from './infinite-moving-cards';
export type { InfiniteMovingCardsProps } from './infinite-moving-cards';
export { InfiniteMovingCardsDemo } from './infinite-moving-cards-demo';
export { PinContainer, PinPerspective } from './pin-container';
export type { PinContainerProps } from './pin-container';
export { PinContainerDemo } from './pin-container-demo';
export { BookingTabs } from './booking-tabs';
export type { BookingTabsProps, BookingTabType } from './booking-tabs/types';
export { BookingTabsDemo } from './booking-tabs/demo';
export { LocationPicker } from './location-picker';
export type { LocationPickerProps, GooglePlace, LocationVariant } from './location-picker/types';
export { LocationPickerDemo } from './location-picker/demo';
export { FloatingDock } from './floating-dock';
export type { FloatingDockProps, FloatingDockItem } from './floating-dock';
export { FloatingDockDemo } from './floating-dock-demo';

// Theme Controls
export { ThemeToggle } from './theme-toggle';
export * from './TestButton';
export * from './PremiumButton';
