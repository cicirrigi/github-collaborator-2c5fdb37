'use client';

import { cn } from '@/lib/utils/cn';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';

import { dockTokens as t } from './dock.tokens';
import type { DockButtonProps } from './dock.types';

/**
 * 🔘 Apple-Style DockButton (snappy, scale-based, solid circle)
 * - scale not width → GPU accelerated
 * - solid circular background (not hollow)
 * - short proximity → sharp Apple feel
 * - rapid bounce spring
 */

export function DockButton({ item, mouseX, isMobile = false }: DockButtonProps) {
  const { title, icon, onClick, isActive } = item;

  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Always create fallback motion value (hook safety)
  const fallbackMouseX = useMotionValue(Infinity);
  const mouse = mouseX ?? fallbackMouseX;

  /* -------------------------------------------------------------------------- */
  /*                         🍏 Apple-style proximity                          */
  /* -------------------------------------------------------------------------- */
  const distance = useTransform(mouse, x => {
    if (isMobile) return 0;
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return 999;

    return x - (bounds.x + bounds.width / 2);
  });

  /* 🧲 GAUSSIAN MAGNIFICATION (from dock-v2 - SUPERIOR!) */
  const scaleKernel = useTransform(distance, d => {
    const gaussianDistance = 120;
    const sigma = 80;
    const maxScale = 1.4;

    if (Math.abs(d) > gaussianDistance) return 1.0;

    // Gaussian function - REAL magnify algorithm!
    const gaussian = Math.exp(-(d * d) / (2 * sigma * sigma));
    return 1.0 + (maxScale - 1.0) * gaussian;
  });

  const iconKernel = useTransform(distance, d => {
    const gaussianDistance = 120;
    const sigma = 80;
    const maxScale = 1.3;

    if (Math.abs(d) > gaussianDistance) return 1.0;

    const gaussian = Math.exp(-(d * d) / (2 * sigma * sigma));
    return 1.0 + (maxScale - 1.0) * gaussian;
  });

  /* 🧲 LENS EFFECT - iconurile se "împing" lateral (from dock-v2) */
  const lensX = useTransform(distance, d => {
    if (isMobile) return 0;

    const currentScale = 1.0 + (1.4 - 1.0) * Math.exp(-(d * d) / (2 * 80 * 80));
    const direction = d < 0 ? 1 : -1; // Se împinge DEPARTE de mouse
    const lensStrength = (currentScale - 1) * direction * 0.3; // Lens effect strength

    return lensStrength * 20; // Convert to pixels
  });

  /* Ultra snappy Apple spring */
  const scale = useSpring(scaleKernel, {
    mass: 0.25,
    stiffness: 480,
    damping: 32,
  });

  const iconScale = useSpring(iconKernel, {
    mass: 0.25,
    stiffness: 460,
    damping: 36,
  });

  /* 🧲 Enhanced horizontal spring pentru lens effect (from dock-v2) */
  const x = useSpring(lensX, {
    stiffness: 280,
    damping: 22,
  });

  /* -------------------------------------------------------------------------- */
  /*                                    Click                                   */
  /* -------------------------------------------------------------------------- */
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  /* -------------------------------------------------------------------------- */
  /*                                Render UI                                   */
  /* -------------------------------------------------------------------------- */
  return (
    <button
      onClick={handleClick}
      aria-label={title}
      type='button'
      role='tab'
      className='relative select-none'
    >
      <motion.div
        ref={ref}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          'flex items-center justify-center rounded-full transition-all duration-200',
          'h-[44px] w-[44px]', // Fixed size always

          // Use proper CSS variables (not invalid bg-[])
          'border backdrop-blur-sm',

          // Active state classes
          isActive ? 'shadow-lg ring-2 ring-opacity-50' : 'shadow-md hover:shadow-lg'
        )}
        style={
          isMobile
            ? {
                // 🎨 CSS-only styles for mobile
                backgroundColor: isActive
                  ? `color-mix(in srgb, ${t.colors.active.bg} ${t.colors.active.bgAlpha * 100}%, transparent)`
                  : t.colors.item.bg,
                borderColor: isActive
                  ? `color-mix(in srgb, ${t.colors.active.border} ${t.colors.active.borderAlpha * 100}%, transparent)`
                  : t.colors.item.border,
                backdropFilter: `blur(${t.effects.backdropBlur / 2}px)`,
                boxShadow: isActive
                  ? `${t.effects.chromeHighlight}, ${t.effects.ambientGlow}, ${t.effects.elevatedShadow}`
                  : `${t.effects.chromeHighlight}, ${t.effects.floatingShadow}`,
              }
            : {
                // 🍏 MotionStyle for desktop (includes scale, x)
                scale,
                x,
                backgroundColor: isActive
                  ? `color-mix(in srgb, ${t.colors.active.bg} ${t.colors.active.bgAlpha * 100}%, transparent)`
                  : t.colors.item.bg,
                borderColor: isActive
                  ? `color-mix(in srgb, ${t.colors.active.border} ${t.colors.active.borderAlpha * 100}%, transparent)`
                  : t.colors.item.border,
                backdropFilter: `blur(${t.effects.backdropBlur / 2}px)`,
                boxShadow: isActive
                  ? `${t.effects.chromeHighlight}, ${t.effects.ambientGlow}, ${t.effects.elevatedShadow}`
                  : `${t.effects.chromeHighlight}, ${t.effects.floatingShadow}`,
              }
        }
      >
        {/* Tooltip */}
        <AnimatePresence>
          {!isMobile && hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 4, x: '-50%' }}
              transition={{ duration: 0.18 }}
              className='absolute left-1/2 -translate-x-1/2 z-20 pointer-events-none'
              style={{
                top: '-36px',
                background: t.colors.tooltip.bg,
                color: t.colors.tooltip.text,
                border: `1px solid ${t.colors.tooltip.border}`,
                padding: '4px 8px',
                fontSize: '0.75rem',
                borderRadius: '6px',
                backdropFilter: 'blur(10px)',
              }}
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ICON */}
        <motion.div
          style={
            isMobile
              ? {}
              : {
                  scale: iconScale,
                }
          }
          className={cn(
            'text-[var(--text-primary)] flex items-center justify-center',
            isMobile && 'scale-[1.0]'
          )}
        >
          {icon}
        </motion.div>
      </motion.div>
    </button>
  );
}
