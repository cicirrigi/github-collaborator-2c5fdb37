/**
 * 🎯 VisionOS Chrome Dock — Type Definitions
 * Strict TypeScript, zero any, fully modular
 */

import type { MotionValue } from 'framer-motion';

/** Single dock item configuration */
export interface BookingDockItem {
  /** Tooltip label */
  title: string;

  /** Icon component or element */
  icon: React.ReactNode;

  /** Triggered when clicking */
  onClick: () => void;

  /** Highlights the active item */
  isActive?: boolean;

  /** Optional unique key */
  id?: string;
}

/** Props for the main floating dock container */
export interface FloatingDockProps {
  /** List of dock items */
  items: BookingDockItem[];

  /** Extra classes applied to the main container */
  className?: string;

  /** Desktop-only container class */
  desktopClassName?: string;

  /** Mobile-only container class */
  mobileClassName?: string;
}

/** Props for a single dock button */
export interface DockButtonProps {
  /** Dock item definition */
  item: BookingDockItem;

  /** MouseX position for desktop magnification */
  mouseX?: MotionValue<number>;

  /** If true → uses mobile fixed size (disables magnification) */
  isMobile?: boolean;
}

/** VisionOS spring physics configuration */
export interface VisionOSSpringConfig {
  mass: number;
  stiffness: number;
  damping: number;
}

/** Proximity detection configuration */
export interface ProximityConfig {
  distance: number;
  threshold: number;
}

/** Chrome visual effects */
export interface ChromeEffects {
  backdropBlur: number;
  chromeHighlight: string;
  ambientGlow: string;
  elevatedShadow: string;
  floatingShadow: string;
}

/** Color configuration with alpha values */
export interface DockColorConfig {
  /** Background CSS variable */
  bg: string;

  /** Background opacity */
  bgAlpha?: number;

  /** Border CSS variable */
  border?: string;

  /** Border opacity */
  borderAlpha?: number;
}
