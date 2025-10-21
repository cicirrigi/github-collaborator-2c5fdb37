import { Landmark, MapPin, Navigation } from 'lucide-react';

import { designTokens } from '@/design-system/tokens/colors';

// Configurații pentru variante location (nu hardcode)
export const LOCATION_VARIANTS = {
  pickup: {
    icon: MapPin,
    placeholder: 'Enter pickup location',
    label: 'From',
  },
  destination: {
    icon: Navigation,
    placeholder: 'Enter destination',
    label: 'To',
  },
  stop: {
    icon: Landmark,
    placeholder: 'Add an extra stop',
    label: 'Stop',
  },
} as const;

// Style configurations cu design tokens (pill-shaped dinamic)
export const SIZE_CLASSES = {
  container: {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-base',
    lg: 'h-12 px-5 text-lg',
  },
  icon: {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  },
} as const;

// Calculat dinamic - padding sincronizat cu icon position
export const SPACING_CONFIG = {
  iconLeft: {
    sm: '0.75rem', // 12px = 3*4px
    md: '1rem', // 16px = 4*4px
    lg: '1.25rem', // 20px = 5*4px
  },
  inputPaddingLeft: {
    sm: 'pl-10', // 40px pentru icon + gap
    md: 'pl-12', // 48px pentru icon + gap
    lg: 'pl-14', // 56px pentru icon + gap
  },
} as const;

// Theme-aware classes (folosind design tokens)
export const THEME_CLASSES = {
  input: {
    base: 'w-full rounded-full transition-all focus:outline-none border-0',
    default: 'dark:text-white',
    error: 'border-0',
    disabled: 'cursor-not-allowed border-0',
  },
  suggestions: {
    container:
      'absolute z-50 top-full left-0 right-0 mt-2 rounded-xl backdrop-blur-md bg-white/70 dark:bg-neutral-900/70 border border-neutral-200/30 dark:border-neutral-700/30 shadow-lg overflow-hidden max-h-60 overflow-y-auto',
    item: 'px-4 py-3 cursor-pointer transition-colors hover:bg-white/50 dark:hover:bg-neutral-800/50',
  },
} as const;

// Background variants calculat dinamic
export const BACKGROUND_CONFIG = {
  input: {
    default: designTokens.background.light,
    error: 'rgba(239, 68, 68, 0.1)', // red-500/10
    disabled: 'rgba(156, 163, 175, 0.2)', // gray-400/20
  },
  suggestions: {
    container: 'rgba(255, 255, 255, 0.95)', // white/95
    itemHover: 'rgba(156, 163, 175, 0.1)', // gray-400/10
  },
} as const;

// Google Places configuration (reutilizabil)
export const GOOGLE_CONFIG = {
  defaultRestrictions: {
    country: 'uk',
  },
  defaultTypes: ['address', 'establishment'],
  airportTypes: ['airport'],
  hotelTypes: ['lodging'],
} as const;

// Validation constants (nu magic strings)
export const VALIDATION = {
  minLength: 3,
  maxLength: 80,
  messages: {
    required: 'This field is required.',
    tooShort: 'Please type at least 3 characters.',
    tooLong: 'Input too long.',
  },
} as const;
