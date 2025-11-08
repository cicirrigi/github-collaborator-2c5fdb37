/**
 * 🎴 LuxuryCard Types - Vantage Lane 2.0
 * Strict TypeScript types fără any, bazate pe design tokens
 */

import type { ComponentPropsWithRef, ElementType, ReactNode } from 'react';

// Reserved for future design token integration
// import type { designTokens } from '@/config/theme.config';
// import type { luxuryCardTokens } from '@/design-system/tokens/luxury-card';

// Extract exact types from design tokens (commented until needed)
// type LuxuryCardColors = keyof typeof luxuryCardTokens.colors;
// type EffectDuration = keyof typeof designTokens.animations.duration;
// type ShadowVariant = keyof typeof luxuryCardTokens.shadows;

// Luxury card variants
export type LuxuryCardVariant = 'shimmer' | 'glow' | 'minimal' | 'premium' | 'vantage';

// Luxury card sizes
export type LuxuryCardSize = 'sm' | 'md' | 'lg' | 'xl';

// Icon sizes (pentru compatibilitate cu Vantage Lane design)
export type LuxuryCardIconSize = 'sm' | 'md' | 'lg' | 'xl' | 'vantage'; // vantage = 80x80px

// Icon enhancement effects (pentru efecte premium pe iconițe)
export type LuxuryCardIconEnhancement = 'none' | 'glow' | 'shimmer' | 'premium';

// Hover effects
export type LuxuryCardHover = 'shimmer' | 'glow' | 'lift' | 'none';

// Polymorphic component props
type PolymorphicComponentProps<T extends ElementType> = {
  as?: T;
} & ComponentPropsWithRef<T>;

// Base luxury card props
export interface LuxuryCardBaseProps {
  /** Visual variant of the card */
  variant?: LuxuryCardVariant;

  /** Size of the card */
  size?: LuxuryCardSize;

  /** Hover effect type */
  hover?: LuxuryCardHover;

  /** Custom glow color (overrides theme) */
  glowColor?: string;

  /** Custom shimmer color (overrides theme) */
  shimmerColor?: string;

  /** Icon size (pentru customizare dimensiuni iconițe) */
  iconSize?: LuxuryCardIconSize;

  /** Icon enhancement effects (glow, shimmer pe iconițe) */
  iconEnhancement?: LuxuryCardIconEnhancement;

  /** Card enhancement effects (pentru efecte pe întreg cardul ca în Vantage Lane) */
  cardEnhancement?: 'none' | 'golden-glow' | 'full-shimmer' | 'vantage-premium';

  /** Enable title color transition on hover (text-white → text-golden) */
  titleGolden?: boolean;

  /** Disable all hover effects */
  disabled?: boolean;

  /** Additional CSS classes */
  className?: string;

  /** Card content */
  children?: ReactNode;

  // Props-based content (simple API)
  /** Icon element or component */
  icon?: ReactNode;

  /** Card title */
  title?: string;

  /** Card description/content */
  description?: string;

  /** Footer content */
  footer?: ReactNode;

  /** Bottom center badge content */
  bottomBadge?: ReactNode;
}

// Polymorphic luxury card props
export type LuxuryCardProps<T extends ElementType = 'div'> = LuxuryCardBaseProps &
  PolymorphicComponentProps<T>;

// Style configuration types
export interface LuxuryCardStyleConfig {
  base: string;
  variants: Record<LuxuryCardVariant, string>;
  sizes: Record<LuxuryCardSize, string>;
  hover: Record<
    LuxuryCardHover,
    {
      container: string;
      overlay?: string;
      shimmer?: string;
    }
  >;
}

// Component display name type
export interface LuxuryCardComponent {
  <T extends ElementType = 'div'>(props: LuxuryCardProps<T>): ReactNode;
  displayName: string;
}
