/**
 * 🌌 Gradient Base Component
 * CSS linear gradient foundation
 * Theme-aware, responsive, zero assets
 */

'use client';

import type React from 'react';

import type { GradientConfig } from '../types';

export interface GradientBaseProps {
  readonly config: GradientConfig;
  readonly className?: string;
}

/**
 * Gradient Base - CSS linear-gradient foundation
 * Smooth transitions, theme-aware colors
 */
export function GradientBase({ config, className = '' }: GradientBaseProps): React.JSX.Element {
  const gradientStyle = config.via
    ? `linear-gradient(${config.angle || 135}deg, ${config.from} 0%, ${config.via} 50%, ${config.to} 100%)`
    : `linear-gradient(${config.angle || 135}deg, ${config.from} 0%, ${config.to} 100%)`;

  return (
    <div
      className={`absolute inset-0 ${className}`}
      style={{
        background: gradientStyle,
      }}
    />
  );
}
