/**
 * 🌟 FloatingOrb Component
 *
 * Individual animated orb with blur and glassmorphism
 */

'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type React from 'react';
import { useEffect, useState } from 'react';

import { floatingVariants } from '../animations';
import { responsiveMultipliers } from '../AnimatedBackground.tokens';
import type { FloatingOrbProps } from '../AnimatedBackground.types';

export function FloatingOrb({
  config,
  enableParallax,
  colorValue,
}: FloatingOrbProps): React.JSX.Element {
  const [sizeMultiplier, setSizeMultiplier] = useState(1);

  // Mouse position tracking for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for smooth parallax
  const springConfig = { stiffness: 50, damping: 20, mass: 1.2 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // Parallax movement (reduced based on z-index for depth)
  const parallaxX = useTransform(x, value => value / (config.zIndex * 20));
  const parallaxY = useTransform(y, value => value / (config.zIndex * 20));

  // Responsive size adjustment
  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setSizeMultiplier(responsiveMultipliers.mobile);
      } else if (width < 1024) {
        setSizeMultiplier(responsiveMultipliers.tablet);
      } else {
        setSizeMultiplier(responsiveMultipliers.desktop);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Mouse move handler for parallax
  useEffect(() => {
    if (!enableParallax) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX - innerWidth / 2) / 10);
      mouseY.set((clientY - innerHeight / 2) / 10);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enableParallax, mouseX, mouseY]);

  const size = config.size * sizeMultiplier;
  const blur = config.blur * sizeMultiplier;

  // Extract numeric seed from orb id for deterministic animation
  const orbSeed = parseInt(config.id.split('-')[1] || '0', 10);

  return (
    <motion.div
      custom={{ duration: config.duration, seed: orbSeed }}
      variants={floatingVariants}
      initial='initial'
      animate='animate'
      style={{
        position: 'absolute',
        left: `${config.startX}%`,
        top: `${config.startY}%`,
        width: size,
        height: size,
        x: enableParallax ? parallaxX : 0,
        y: enableParallax ? parallaxY : 0,
        zIndex: config.zIndex,
        pointerEvents: 'none',
        willChange: 'transform',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colorValue} 0%, transparent 70%)`,
          filter: `blur(${blur}px)`,
          opacity: config.opacity,
          transform: 'translate(-50%, -50%)',
        }}
      />
    </motion.div>
  );
}
