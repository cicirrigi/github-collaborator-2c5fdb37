'use client';

import { cn } from '@/lib/utils/cn';
import { motion, useMotionValue } from 'framer-motion';
import type { BookingDockItem } from './dock.types';
import { IconContainer } from './IconContainer';

export const FloatingDockInline = ({
  items,
  className,
}: {
  items: BookingDockItem[];
  className?: string;
}) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={e => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      /**
       * INLINE VERSION - for embedding in forms/sections
       * - relative positioning (not fixed)
       * - center using mx-auto (not transform)
       */
      className={cn(
        `
        relative mx-auto
        hidden md:flex
        h-20 items-center
        space-x-4
        rounded-3xl
        bg-white/80 dark:bg-neutral-900/80
        backdrop-blur-2xl
        border border-white/20 dark:border-neutral-700/40
        shadow-xl shadow-black/10
        px-8
        w-fit
        will-change-transform
      `,
        className
      )}
      style={{ transform: 'translateZ(0)' }}
    >
      {items.map(item => (
        <IconContainer key={item.title} mouseX={mouseX} {...item} />
      ))}
    </motion.div>
  );
};
