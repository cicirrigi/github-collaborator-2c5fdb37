'use client';

import { cn } from '@/lib/utils/cn';
import { motion, useMotionValue } from 'framer-motion';
import { useEffect, useState } from 'react';
import { DockButton } from './DockButton';
import { dockTokens as t } from './dock.tokens';
import type { BookingDockItem, FloatingDockProps } from './dock.types';

/**
 * 🎛️ VisionOS Chrome Floating Dock
 * Fully token-driven, no hardcodări, perfect dark/light, Safari-safe.
 */
export function BookingFloatingDock({
  items,
  className,
  desktopClassName,
  mobileClassName,
}: FloatingDockProps) {
  const mouseX = useMotionValue(Infinity);
  const [isMobile, setIsMobile] = useState(false);

  // Safe client-side mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  /* -------------------------------------------------------------------------- */
  /*   🎨 SAFE VisionOS Chrome container using color-mix (Safari + Chrome OK)  */
  /* -------------------------------------------------------------------------- */
  const buildChromeBackground = () =>
    `color-mix(in srgb, ${t.colors.container.bg} ${t.colors.container.bgAlpha * 100}%, transparent)`;

  const buildChromeBorder = () =>
    `1px solid color-mix(in srgb, ${t.colors.container.border} ${t.colors.container.borderAlpha * 100}%, transparent)`;

  const getContainerStyles = (isMobile = false): React.CSSProperties => ({
    height: isMobile ? t.mobile.height : t.desktop.height,
    borderRadius: isMobile ? t.mobile.borderRadius : t.desktop.borderRadius,
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? t.mobile.gap : t.desktop.gap,
    paddingLeft: isMobile ? t.mobile.gap : t.desktop.paddingX,
    paddingRight: isMobile ? t.mobile.gap : t.desktop.paddingX,
    paddingBottom: isMobile ? undefined : t.desktop.paddingBottom,

    // VisionOS background (fixat corect)
    backgroundColor: buildChromeBackground(),
    border: buildChromeBorder(),

    // Blur & Chrome effects
    backdropFilter: `blur(${t.effects.backdropBlur}px)`,
    WebkitBackdropFilter: `blur(${t.effects.backdropBlur}px)`,

    boxShadow: isMobile
      ? `${t.effects.chromeHighlight}, ${t.effects.floatingShadow}`
      : `${t.effects.chromeHighlight}, ${t.effects.ambientGlow}, ${t.effects.elevatedShadow}`,
  });

  return (
    <motion.div
      onMouseMove={e => {
        // AI-sensing doar pe desktop
        if (!isMobile) {
          mouseX.set(e.pageX);
        }
      }}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        'flex mx-auto items-center justify-center',
        // Desktop styling
        'md:items-end',
        className,
        desktopClassName,
        mobileClassName
      )}
      style={
        {
          ...getContainerStyles(isMobile),
          // Adaptive alignment
          alignItems: isMobile ? 'center' : 'end',
        } as any
      }
      role='tablist'
      aria-label='Booking type selection'
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.3, // Fixed: parseInt('300ms') was incorrect
          ease: t.motion.easing,
        },
      }}
    >
      {items.map((item: BookingDockItem, index: number) => (
        <DockButton key={`dock-${index}`} item={item} mouseX={mouseX} isMobile={isMobile} />
      ))}
    </motion.div>
  );
}
