/**
 * 🎨 Background System Types
 * Type definitions for modular background orchestration
 */

export type BackgroundPreset = 'luxury' | 'minimal' | 'dramatic' | 'subtle';

export type GlowPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

export interface RadialGlowConfig {
  readonly position: GlowPosition;
  readonly color: string;
  readonly size: string;
  readonly opacity: number;
}

export interface GradientConfig {
  readonly from: string;
  readonly via?: string;
  readonly to: string;
  readonly angle?: number;
}

export interface NoiseConfig {
  readonly opacity: number;
  readonly scale?: number;
}

export interface BackgroundConfig {
  readonly gradient: GradientConfig;
  readonly glows: readonly RadialGlowConfig[];
  readonly noise: NoiseConfig;
}

export interface BackgroundOrchestratorProps {
  readonly preset?: BackgroundPreset;
  readonly customConfig?: Partial<BackgroundConfig>;
  readonly className?: string;
}
