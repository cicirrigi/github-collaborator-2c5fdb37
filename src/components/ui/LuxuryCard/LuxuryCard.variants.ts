/**
 * 🎨 LuxuryCard Variants - Vantage Lane 2.0
 * Style configurations bazate pe design tokens (fără hardcodări)
 */

// import { designTokens } from '@/config/theme.config' // Reserved for future use
import { luxuryCardTokens } from '@/design-system/tokens/luxury-card';

import type { LuxuryCardStyleConfig } from './LuxuryCard.types';

// Base classes (extracted from original, dar fără hardcodări)
const baseClasses = [
  'group',
  'relative',
  'text-center',
  'rounded-xl',
  'backdrop-blur-sm',
  'transition-all',
  'overflow-hidden',
  'cursor-pointer',
  'block',
].join(' ');

// Variant-specific classes
const variantClasses = {
  shimmer: [
    // Background gradient (flexible pentru toate use case-urile)
    'bg-gradient-to-br',
    'from-white/95',
    'via-neutral-50/90',
    'to-white/95',
    'dark:from-neutral-900',
    'dark:via-neutral-950',
    'dark:to-neutral-900',
    // Border with subtle 3D effect - top/left lighter, bottom/right present
    'border-2',
    'border-t-neutral-700/40',
    'border-l-neutral-700/40',
    'border-b-neutral-800',
    'border-r-neutral-800',
    'dark:border-t-white/5',
    'dark:border-l-white/5',
    'dark:border-b-black',
    'dark:border-r-black',
    'hover:border-t-[var(--luxury-glow-color)]/30',
    'hover:border-l-[var(--luxury-glow-color)]/30',
    // Shadow with hover glow
    'shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)]',
    'hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.4),0_10px_10px_-5px_rgba(0,0,0,0.2),0_0_30px_rgba(203,178,106,0.15)]',
    // Hover scale
    'hover:scale-105',
    'duration-[var(--luxury-duration-normal)]',
  ].join(' '),

  // 🎯 Variant IDENTIC cu originalul Vantage Lane (dark cards pe light mode)
  vantage: [
    // Background gradient - IDENTIC cu originalul Vantage Lane
    'bg-gradient-to-br',
    'from-[/* gray-900 */ #1a1a1a]',
    'via-[/* gray-950 */ #0f0f0f]',
    'to-[/* gray-900 */ #1a1a1a]',
    'dark:from-white/8',
    'dark:via-white/4',
    'dark:to-white/2',
    // Border - IDENTIC cu originalul Vantage Lane
    'border',
    'border-neutral-800',
    'dark:border-white/10',
    'hover:border-[var(--luxury-glow-color)]/60',
    'dark:hover:border-[var(--luxury-glow-color)]/20',
    // Shadow identic
    'shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)]',
    'hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.4),0_10px_10px_-5px_rgba(0,0,0,0.2),0_0_30px_rgba(203,178,106,0.15)]',
    // Hover scale
    'hover:scale-105',
    'duration-[var(--luxury-duration-normal)]',
  ].join(' '),

  glow: [
    'bg-neutral-50/80',
    'dark:bg-white/5',
    'border',
    'border-neutral-200',
    'dark:border-white/10',
    'hover:border-[var(--luxury-glow-color)]/50',
    'hover:shadow-[0_0_30px_rgba(203,178,106,0.3)]',
    'duration-[var(--luxury-duration-normal)]',
  ].join(' '),

  minimal: [
    'bg-transparent',
    'border',
    'border-neutral-200',
    'dark:border-neutral-800',
    'hover:border-[var(--luxury-glow-color)]/30',
    'duration-[var(--luxury-duration-fast)]',
  ].join(' '),

  premium: [
    'bg-gradient-to-br',
    'from-[var(--luxury-glow-color)]/5',
    'to-transparent',
    'border-2',
    'border-[var(--luxury-glow-color)]/20',
    'hover:border-[var(--luxury-glow-color)]/60',
    'hover:shadow-[0_0_40px_rgba(203,178,106,0.4)]',
    'duration-[var(--luxury-duration-slow)]',
  ].join(' '),
};

// Size classes
const sizeClasses = {
  sm: 'p-4 text-sm',
  md: 'p-6 text-base',
  lg: 'p-8 text-lg',
  xl: 'p-10 text-xl',
};

// Hover effect classes
const hoverClasses = {
  shimmer: {
    container: 'group-hover:scale-105',
    overlay: [
      'absolute',
      'inset-0',
      'rounded-xl',
      'bg-gradient-to-br',
      'from-[var(--luxury-glow-color)]/5',
      'to-transparent',
      'opacity-0',
      'group-hover:opacity-100',
      'transition-opacity',
      'duration-[var(--luxury-glow-duration)]',
    ].join(' '),
    shimmer: [
      'absolute',
      'inset-0',
      'bg-gradient-to-r',
      'from-transparent',
      'via-[var(--luxury-shimmer-color)]/20',
      'to-transparent',
      'transform',
      '-skew-x-12',
      '-translate-x-full',
      'group-hover:translate-x-full',
      'transition-transform',
      'duration-[var(--luxury-shimmer-duration)]',
      'ease-out',
      'w-[200%]',
      'h-full',
    ].join(' '),
  },

  glow: {
    container: 'group-hover:scale-102',
    overlay: [
      'absolute',
      'inset-0',
      'rounded-xl',
      'bg-[/* brand-primary */ #CBB26A]/10',
      'opacity-0',
      'group-hover:opacity-100',
      'transition-opacity',
      'duration-[var(--luxury-glow-duration)]',
    ].join(' '),
  },

  lift: {
    container: 'group-hover:-translate-y-2 group-hover:scale-105',
    overlay: [
      'absolute',
      'inset-0',
      'rounded-xl',
      'shadow-[0_10px_40px_rgba(0,0,0,0.2)]',
      'opacity-0',
      'group-hover:opacity-100',
      'transition-opacity',
      'duration-[var(--luxury-duration-normal)]',
    ].join(' '),
  },

  none: {
    container: '',
    overlay: '',
  },
};

// Export complete style configuration
export const luxuryCardStyles: LuxuryCardStyleConfig = {
  base: baseClasses,
  variants: variantClasses,
  sizes: sizeClasses,
  hover: hoverClasses,
};

// CSS Custom Properties generator (pentru culori dinamice)
export const generateCustomProperties = (glowColor?: string, shimmerColor?: string) => ({
  '--luxury-glow-color': glowColor || luxuryCardTokens.colors.goldGlow,
  '--luxury-shimmer-color': shimmerColor || luxuryCardTokens.colors.shimmerPrimary,
});
