/**
 * 🛠️ LuxuryCard Helpers - Enterprise Utilities
 * Utility functions for LuxuryCard component system
 */

import { luxuryCardTokens } from '@/design-system/tokens/luxury-card';

/**
 * Generates CSS custom properties for dynamic theming
 *
 * @param glowColor - Custom glow color override
 * @param shimmerColor - Custom shimmer color override
 * @returns Object with CSS custom properties for dynamic styling
 *
 * @example
 * const props = generateCustomProperties('var(--brand-primary)', 'var(--brand-accent)')
 * // Returns: { '--luxury-glow-color': '#CBB26A', '--luxury-shimmer-color': '#E5D485' }
 */
export const generateCustomProperties = (
  glowColor?: string,
  shimmerColor?: string,
): Record<string, string> => {
  return {
    '--luxury-glow-color': glowColor || luxuryCardTokens.colors.goldGlow,
    '--luxury-shimmer-color': shimmerColor || luxuryCardTokens.colors.shimmerPrimary,
    '--luxury-hover-glow': glowColor || luxuryCardTokens.colors.hoverGlow,
  } as Record<string, string>;
};


/**
 * 🎯 Icon Size Classes Generator (folosind luxury tokens)
 */
export const getIconSizeClasses = (size: 'sm' | 'md' | 'lg' | 'xl' | 'vantage' = 'md'): string => {
  // Note: Tailwind classes are kept for compatibility, but sizes are defined in tokens
  const sizeMap = {
    sm: 'h-8 w-8',      // luxuryCardTokens.sizes.icon.sm (2rem x 2rem)
    md: 'h-12 w-12',    // luxuryCardTokens.sizes.icon.md (3rem x 3rem)
    lg: 'h-16 w-16',    // luxuryCardTokens.sizes.icon.lg (4rem x 4rem)
    xl: 'h-18 w-18',    // luxuryCardTokens.sizes.icon.xl (4.5rem x 4.5rem)
    vantage: 'h-20 w-20' // luxuryCardTokens.sizes.icon.vantage (5rem x 5rem)
  };
  
  return `${sizeMap[size]} transition-all duration-[var(--luxury-duration-normal)]`;
};

/**
 * ✨ Icon Enhancement Effects Generator (pentru efecte premium pe iconițe)
 */
export const getIconEnhancementClasses = (
  enhancement: 'none' | 'glow' | 'shimmer' | 'premium' = 'none',
  hover: boolean = true
): string => {
  const baseClasses = 'relative overflow-visible';
  
  switch (enhancement) {
    case 'glow':
      return `${baseClasses} ${hover ? `group-hover:scale-[${luxuryCardTokens.scales.hover.icon}] group-hover:drop-shadow-[${luxuryCardTokens.effects.glow.dropShadow}]` : ''}`;
    
    case 'shimmer':
      return `${baseClasses} ${hover ? `group-hover:scale-[${luxuryCardTokens.scales.hover.icon}]` : ''}`;
    
    case 'premium':
      return `${baseClasses} ${hover ? `group-hover:scale-[${luxuryCardTokens.scales.hover.icon}] group-hover:drop-shadow-[${luxuryCardTokens.effects.glow.dropShadow}]` : ''}`;
    
    default:
      return baseClasses;
  }
};

/**
 * 🌟 Icon Background Glow Classes (pentru blur effect pe fundal)
 */
export const getIconGlowBackgroundClasses = (
  enhancement: 'none' | 'glow' | 'shimmer' | 'premium' = 'none'
): string => {
  if (enhancement === 'glow' || enhancement === 'premium') {
    return `absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--luxury-glow-duration)] blur-xl`;
  }
  return '';
};

/**
 * ✨ Icon Shimmer Effect Classes (pentru shimmer separat pe iconițe)
 */
export const getIconShimmerClasses = (
  enhancement: 'none' | 'glow' | 'shimmer' | 'premium' = 'none'
): string => {
  if (enhancement === 'shimmer' || enhancement === 'premium') {
    return 'absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--luxury-glow-duration)]';
  }
  return '';
};

/**
 * 💫 Icon Shimmer Inner Effect (pentru gradient shimmer pe iconițe)
 */
export const getIconShimmerInnerClasses = (): string => {
  return `absolute inset-0 bg-gradient-to-r from-transparent via-[${luxuryCardTokens.colors.shimmerPrimary}]/40 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-[var(--luxury-shimmer-duration)] ease-out w-[200%] h-full`;
};


/**
 * Checks if component is running in browser environment (SSR compatible)
 *
 * @returns True if running in browser, false in SSR
 */
export const isBrowser = (): boolean => {
  return typeof window !== 'undefined';
};

/**
 * Safely gets computed style property (SSR compatible)
 *
 * @param element - DOM element to get style from
 * @param property - CSS property name
 * @returns Style property value or empty string if not available
 */
export const safeGetComputedStyle = (element: Element | null, property: string): string => {
  if (!isBrowser() || !element) return '';

  try {
    return window.getComputedStyle(element).getPropertyValue(property);
  } catch {
    return '';
  }
};
