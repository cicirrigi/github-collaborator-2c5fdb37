/**
 * 🎨 AnimatedBackground Types
 *
 * Type definitions for luxury floating orbs background
 */

export type AnimationSpeed = 'slow' | 'normal' | 'fast';
export type IntensityLevel = 'low' | 'medium' | 'high';
export type ColorScheme = 'gold' | 'silver' | 'multi';
export type BackgroundVariant = 'luxury' | 'minimal' | 'ambient';

/**
 * Individual Orb configuration
 */
export interface OrbConfig {
  /** Unique identifier */
  readonly id: string;
  /** Size in pixels (diameter) */
  readonly size: number;
  /** Starting X position (percentage) */
  readonly startX: number;
  /** Starting Y position (percentage) */
  readonly startY: number;
  /** Blur intensity in pixels */
  readonly blur: number;
  /** Opacity (0-1) */
  readonly opacity: number;
  /** Animation duration in seconds */
  readonly duration: number;
  /** Color scheme key */
  readonly color: 'primary' | 'secondary' | 'accent';
  /** Z-index for layering */
  readonly zIndex: number;
}

/**
 * Main component props
 */
export interface AnimatedBackgroundProps {
  /** Visual variant */
  readonly variant?: BackgroundVariant;
  /** Animation speed */
  readonly speed?: AnimationSpeed;
  /** Visual intensity */
  readonly intensity?: IntensityLevel;
  /** Color scheme */
  readonly colorScheme?: ColorScheme;
  /** Enable mouse parallax effect */
  readonly enableParallax?: boolean;
  /** Custom className */
  readonly className?: string;
  /** Z-index override */
  readonly zIndex?: number;
}

/**
 * Floating Orb component props
 */
export interface FloatingOrbProps {
  /** Orb configuration */
  readonly config: OrbConfig;
  /** Enable parallax */
  readonly enableParallax: boolean;
  /** Color value from tokens */
  readonly colorValue: string;
}
