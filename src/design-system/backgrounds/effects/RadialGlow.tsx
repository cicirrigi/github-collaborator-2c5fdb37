/**
 * 💡 Radial Glow Component
 * CSS-only radial gradient spotlights
 * Zero GPU overhead, pure CSS
 */

'use client';

import type React from 'react';

import type { RadialGlowConfig } from '../types';
import { glowPositions } from '../tokens';

export interface RadialGlowProps {
  readonly config: RadialGlowConfig;
  readonly className?: string;
}

/**
 * Radial Glow - CSS radial-gradient spotlight
 * Adds dramatic lighting to dark backgrounds
 */
export function RadialGlow({ config, className = '' }: RadialGlowProps): React.JSX.Element {
  const position = glowPositions[config.position];

  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        background: `radial-gradient(circle ${config.size} at ${position}, ${config.color} 0%, transparent 70%)`,
        opacity: config.opacity,
      }}
    />
  );
}
