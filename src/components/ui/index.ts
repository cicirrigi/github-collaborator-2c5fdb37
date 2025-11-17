/**
 * Export all UI components from their respective folders
 *
 * Enterprise design system components.
 * All connected to theme.config.ts for consistency.
 */

// Background system
export { Background } from './Background';
export type { BackgroundProps } from './Background';

// ExploreBadge system
export { ExploreBadge } from './ExploreBadge';
export type {
  ExploreBadgeHover,
  ExploreBadgeProps,
  ExploreBadgeSize,
  ExploreBadgeVariant,
} from './ExploreBadge';

// Core UI Primitives
export { Badge } from './Badge';
export type { BadgeProps } from './Badge';
export { Button } from './Button';
export type { ButtonProps } from './Button';
export { Card } from './Card';
export type { CardProps } from './Card';
export { FooterIcon } from './FooterIcon';
export type { FooterIconProps } from './FooterIcon';
export { Text } from './Text';
export type { TextProps } from './Text';

// Luxury Components
export { LuxuryCard } from './LuxuryCard';
export type {
  LuxuryCardHover,
  LuxuryCardProps,
  LuxuryCardSize,
  LuxuryCardVariant,
} from './LuxuryCard';

// Special Effects Components
export { BookingTabs } from './booking-tabs';
export { BookingTabsDemo } from './booking-tabs/demo';
export type { BookingTabType, BookingTabsProps } from './booking-tabs/types';

// Booking tabs pro
export { BookingTabsPro } from './booking-tabs-pro';
export { BookingTabsProDemo } from './booking-tabs-pro/demo';
export type {
  BookingTab as BookingTabPro,
  BookingTabType as BookingTabTypePro,
  BookingTabsProProps,
} from './booking-tabs-pro/types';

export { FloatingDock } from './floating-dock';
export type { FloatingDockItem, FloatingDockProps } from './floating-dock';
export { FloatingDockDemo } from './floating-dock-demo';
export { InfiniteMovingCards } from './infinite-moving-cards';
export type { InfiniteMovingCardsProps } from './infinite-moving-cards';
export { InfiniteMovingCardsDemo } from './infinite-moving-cards-demo';
export { LocationPicker } from './location-picker';
export { LocationPickerDemo } from './location-picker/demo';
export type { GooglePlace, LocationPickerProps, LocationVariant } from './location-picker/types';
export { PinContainer, PinPerspective } from './pin-container';
export type { PinContainerProps } from './pin-container';
export { PinContainerDemo } from './pin-container-demo';

// Complex UI Components
export * from './BiColorText';
export * from './ExploreBadge';
export * from './LuxuryCard';
export * from './NewsletterCard';
export { ThemeToggle } from './theme-toggle';
export * from './UnsubscribeModal';

// Theme Controls
export * from './PremiumButton';
export * from './TestButton';

// Interactive Grid
export { default as VantageImageGrid } from './VantageImageGrid';
