/**
 * 🎨 Background Orchestrator
 * Main background component with theme-aware effects
 * Modular, performance-optimized, responsive
 */

'use client';

import type React from 'react';

import { useResolvedTheme } from '@/providers/theme-provider';

import { GradientBase, NoiseTexture, RadialGlow } from './effects';
import { getPresetConfig } from './presets';
import type { BackgroundOrchestratorProps } from './types';

/**
 * Background Orchestrator Component
 * Combines gradient, glows, and noise for premium dark backgrounds
 * Theme-aware, zero external assets
 */
export function BackgroundOrchestrator({
  preset = 'luxury',
  customConfig,
  className = '',
}: BackgroundOrchestratorProps): React.JSX.Element {
  const themeMode = useResolvedTheme() || 'dark';

  // Get preset or use custom config
  const config = customConfig
    ? { ...getPresetConfig(preset, themeMode), ...customConfig }
    : getPresetConfig(preset, themeMode);

  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      {/* Base Gradient Layer */}
      <GradientBase config={config.gradient} />

      {/* Radial Glow Layers */}
      {config.glows.map((glow, index) => (
        <RadialGlow key={`glow-${index}`} config={glow} />
      ))}

      {/* Noise Texture Layer */}
      <NoiseTexture config={config.noise} />
    </div>
  );
}
