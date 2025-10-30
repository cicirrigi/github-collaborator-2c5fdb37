'use client';

import type React from 'react';

import { cn } from '@/lib/utils/cn';
import { backgroundPresets } from '@/config/backgrounds.config';

export interface BackgroundProps {
  /** Background preset */
  readonly preset?: keyof typeof backgroundPresets;
  /** Custom styling */
  readonly className?: string;
  /** Opacity override */
  readonly opacity?: number;
}

/**
 * 🌌 Background - Modular background overlay component
 *
 * Features:
 * - Reusable presets (luxury, glass, dark, etc.)
 * - Uses gradients and overlays from config
 * - Zero hardcoding, fully design-token driven
 * - Consistent across all sections
 * - Type-safe preset selection
 */
export function Background({
  preset = 'luxury',
  className,
  opacity,
}: BackgroundProps): React.JSX.Element {
  const config = backgroundPresets[preset];
  const finalOpacity = opacity ?? config.opacity;

  return (
    <div className={cn('absolute inset-0 pointer-events-none', className)}>
      {/* Gradient layer */}
      {config.gradient !== 'none' && (
        <div
          className='absolute inset-0'
          style={{
            background: config.gradient,
            opacity: finalOpacity,
          }}
        />
      )}

      {/* Overlay layer */}
      {config.overlay !== 'transparent' && (
        <div
          className='absolute inset-0'
          style={{
            background: config.overlay,
          }}
        />
      )}
    </div>
  );
}
