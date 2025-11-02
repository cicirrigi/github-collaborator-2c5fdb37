/**
 * Export all UI components from their respective folders
 *
 * Enterprise design system components.
 * All connected to theme.config.ts for consistency.
 */

// Background system
export { Background } from './Background';
export type { BackgroundProps } from './Background';

// Core UI Primitives
export type { BadgeProps } from './Badge';
export { Badge } from './Badge';
export type { ButtonProps } from './Button';
export { Button } from './Button';
export type { CardProps } from './Card';
export { Card } from './Card';
export type { TextProps } from './Text';
export { Text } from './Text';
export type { FooterIconProps } from './FooterIcon';
export { FooterIcon } from './FooterIcon';

// Luxury Components
export type {
  LuxuryCardHover,
  LuxuryCardProps,
  LuxuryCardSize,
  LuxuryCardVariant,
} from './LuxuryCard';
export { LuxuryCard } from './LuxuryCard';

// Special Effects Components
export { BookingTabs } from './booking-tabs';
export { BookingTabsDemo } from './booking-tabs/demo';
export type { BookingTabsProps, BookingTabType } from './booking-tabs/types';

// Booking tabs pro
export { BookingTabsPro } from './booking-tabs-pro';
export { BookingTabsProDemo } from './booking-tabs-pro/demo';
export type {
  BookingTab as BookingTabPro,
  BookingTabsProProps,
  BookingTabType as BookingTabTypePro,
} from './booking-tabs-pro/types';

export type { FloatingDockItem, FloatingDockProps } from './floating-dock';
export { FloatingDock } from './floating-dock';
export { FloatingDockDemo } from './floating-dock-demo';
export type { InfiniteMovingCardsProps } from './infinite-moving-cards';
export { InfiniteMovingCards } from './infinite-moving-cards';
export { InfiniteMovingCardsDemo } from './infinite-moving-cards-demo';
export { LocationPicker } from './location-picker';
export { LocationPickerDemo } from './location-picker/demo';
export type { GooglePlace, LocationPickerProps, LocationVariant } from './location-picker/types';
export type { PinContainerProps } from './pin-container';
export { PinContainer, PinPerspective } from './pin-container';
export { PinContainerDemo } from './pin-container-demo';
export { TravelPlanner } from './travel-planner';
export { TravelPlannerDemo } from './travel-planner/demo';
export type { Stop, TimeSlot, TravelPlan, TravelPlannerProps } from './travel-planner/types';
export * from './travel-planner';
export * from './travel-planner-pro';

// Theme Controls
export * from './PremiumButton';
export * from './TestButton';
export { ThemeToggle } from './theme-toggle';
