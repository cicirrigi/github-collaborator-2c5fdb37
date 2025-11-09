/**
 * 📸 Noise Texture Component
 * Inline SVG grain texture for premium background depth
 * Zero external assets - pure SVG
 */

'use client';

import type React from 'react';

import type { NoiseConfig } from '../types';

export interface NoiseTextureProps {
  readonly config: NoiseConfig;
  readonly className?: string;
}

/**
 * Noise Texture - Inline SVG grain pattern
 * ~3KB inline, zero HTTP requests
 */
export function NoiseTexture({ config, className = '' }: NoiseTextureProps): React.JSX.Element {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        opacity: config.opacity,
        mixBlendMode: 'overlay',
      }}
    >
      <svg
        className='w-full h-full'
        style={{
          transform: config.scale ? `scale(${config.scale})` : undefined,
        }}
      >
        <filter id='noiseFilter'>
          <feTurbulence
            type='fractalNoise'
            baseFrequency='0.8'
            numOctaves='4'
            stitchTiles='stitch'
          />
          <feColorMatrix type='saturate' values='0' />
        </filter>
        <rect width='100%' height='100%' filter='url(#noiseFilter)' />
      </svg>
    </div>
  );
}
