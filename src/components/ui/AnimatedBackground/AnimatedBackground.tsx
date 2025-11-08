/**
 * 🎨 AnimatedBackground - Luxury Floating Orbs
 *
 * Premium animated background with floating glassmorphism orbs
 * Zero hardcoding - all values from design tokens
 */

'use client';

import { motion } from 'framer-motion';
import type React from 'react';
import { useMemo } from 'react';

import { cn } from '@/lib/utils/cn';

import { containerVariants } from './animations';
import type { AnimatedBackgroundProps } from './AnimatedBackground.types';
import {
  colorSchemes,
  intensityConfigs,
  orbPresets,
  speedMultipliers,
} from './AnimatedBackground.tokens';
import { FloatingOrb } from './components';

/**
 * Main orchestrator component for animated background
 */
export function AnimatedBackground({
  variant = 'luxury',
  speed = 'normal',
  intensity = 'medium',
  colorScheme = 'gold',
  enableParallax = false,
  className,
  zIndex = 0,
}: AnimatedBackgroundProps): React.JSX.Element {
  // Get configuration for variant and intensity
  const orbConfigs = orbPresets[variant];
  const intensityConfig = intensityConfigs[intensity];
  const colors = colorSchemes[colorScheme];
  const speedMultiplier = speedMultipliers[speed];

  // Filter orbs based on intensity
  const activeOrbs = useMemo(
    () => orbConfigs.slice(0, intensityConfig.orbCount),
    [orbConfigs, intensityConfig.orbCount]
  );

  // Apply intensity modifiers to orb configs
  const modifiedOrbs = useMemo(
    () =>
      activeOrbs.map(orb => ({
        ...orb,
        blur: orb.blur * intensityConfig.blurMultiplier,
        opacity: orb.opacity * intensityConfig.opacityMultiplier,
        duration: orb.duration * speedMultiplier,
      })),
    [activeOrbs, intensityConfig, speedMultiplier]
  );

  // Map color keys to actual color values
  const getColorValue = (colorKey: 'primary' | 'secondary' | 'accent'): string => {
    return colors[colorKey];
  };

  return (
    <motion.div
      variants={containerVariants}
      initial='initial'
      animate='animate'
      className={cn('absolute inset-0 overflow-hidden', className)}
      style={{
        zIndex,
        pointerEvents: 'none',
      }}
      aria-hidden='true'
    >
      {/* Render all active orbs */}
      {modifiedOrbs.map(orbConfig => (
        <FloatingOrb
          key={orbConfig.id}
          config={orbConfig}
          enableParallax={enableParallax}
          colorValue={getColorValue(orbConfig.color)}
        />
      ))}

      {/* Optional: Very subtle gradient overlay */}
      <div
        className='absolute inset-0'
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.05) 100%)',
          zIndex: 1000,
        }}
      />
    </motion.div>
  );
}
