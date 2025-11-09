/**
 * 🎨 Background Presets
 * Pre-configured background combinations
 * Theme-aware, responsive, performance-optimized
 */

import { createGlow, getGradient } from './tokens';
import type { BackgroundConfig } from './types';

/**
 * Get preset configuration based on theme
 */
export function getPresetConfig(
  preset: 'luxury' | 'minimal' | 'dramatic' | 'subtle',
  theme: 'dark' | 'light'
): BackgroundConfig {
  const configs: Record<string, BackgroundConfig> = {
    luxury: {
      gradient: getGradient(theme, 'dramatic'),
      glows: [], // No glows - clean satin look
      noise: { opacity: 0.06, scale: 1.1 }, // Increased for glossy satin texture
    },
    minimal: {
      gradient: getGradient(theme, 'subtle'),
      glows: [createGlow('center', theme, 'goldSubtle', '1200px')],
      noise: { opacity: 0.02, scale: 1 },
    },
    dramatic: {
      gradient: getGradient(theme, 'dramatic'),
      glows: [
        createGlow('top-left', theme, 'goldDramatic', '1200px'),
        createGlow('bottom-right', theme, 'gold', '1000px'),
        createGlow('center', theme, 'goldSubtle', '800px'),
      ],
      noise: { opacity: 0.05, scale: 1.2 },
    },
    subtle: {
      gradient: getGradient(theme, 'subtle'),
      glows: [createGlow('top-right', theme, 'goldSubtle', '900px')],
      noise: { opacity: 0.02, scale: 1 },
    },
  };

  return configs[preset] as BackgroundConfig;
}
