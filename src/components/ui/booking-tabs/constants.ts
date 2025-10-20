import { Navigation, RotateCcw, Timer, Crown } from "lucide-react";
import { colors } from "@/design-system/tokens";
import type { BookingTab } from "./types";

// Configurație pentru tab-urile de booking (nu hardcode în componentă)
export const DEFAULT_BOOKING_TABS: BookingTab[] = [
  {
    id: 'oneway',
    label: 'One Way',
    icon: Navigation,
    description: 'Single journey'
  },
  {
    id: 'return',
    label: 'Return',
    icon: RotateCcw,
    description: 'Round trip'
  },
  {
    id: 'hourly',
    label: 'Hourly',
    icon: Timer,
    description: 'By the hour'
  },
  {
    id: 'fleet',
    label: 'Fleet',
    icon: Crown,
    description: 'Multiple vehicles'
  }
];

// Style configurations cu design tokens (nu hardcode)
export const SIZE_CLASSES = {
  container: {
    sm: 'p-1 gap-1',
    md: 'p-1.5 gap-1',
    lg: 'p-2 gap-1.5'
  },
  tab: {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-base'
  },
  icon: {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }
} as const;

// Theme-aware color classes (folosind CSS custom properties)
export const THEME_CLASSES = {
  container: {
    background: 'bg-white/20 dark:bg-black/20',
    backdrop: ''
  },
  pill: {
    // Gradient auriu brand - păstrăm brand-ul
    active: 'text-white',
    gradient: 'bg-gradient-to-r from-[#CBB26A] to-[#D4AF37]' // Brand auriu
  },
  tab: {
    inactive: 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100',
    active: 'text-white'
  }
} as const;

// Layout constants (calculated based on tab count)
export const LAYOUT_CONFIG = {
  tabCount: DEFAULT_BOOKING_TABS.length,
  tabWidth: 100 / DEFAULT_BOOKING_TABS.length, // Each tab width in percentage
  gridTemplate: `repeat(${DEFAULT_BOOKING_TABS.length}, 1fr)`, // Dynamic grid columns
  pillWidth: `calc(100% / ${DEFAULT_BOOKING_TABS.length})` // Dynamic pill width
} as const;

// Animation constants (nu magic numbers)
export const ANIMATION_CONFIG = {
  spring: {
    type: "spring" as const,
    bounce: 0.2,
    duration: 0.6
  },
  transition: {
    duration: 300, // ms
    easing: 'ease-in-out'
  }
} as const;
