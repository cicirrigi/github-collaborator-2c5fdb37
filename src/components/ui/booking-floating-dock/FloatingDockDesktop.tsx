'use client';

import { motion, useMotionValue } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import type { BookingDockItem } from './dock.types';
import { IconContainer } from './IconContainer';

export const FloatingDockDesktop = ({
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
       * VERY IMPORTANT:
       * - fixed so layout cannot shift
       * - center using transform (NOT mx-auto)
       */
      className={cn(
        `
        fixed bottom-6 left-1/2
        z-50 
        hidden md:flex
        h-20 items-end
        space-x-6
        rounded-3xl 
        bg-white/80 dark:bg-neutral-900/80
        backdrop-blur-2xl
        border border-white/20 dark:border-neutral-700/40
        shadow-xl shadow-black/10
        px-6 pb-4
        will-change-transform
      `,
        className
      )}
      style={{ transform: 'translateX(-50%) translateZ(0)' }}
    >
      {items.map(item => (
        <IconContainer key={item.title} mouseX={mouseX} {...item} />
      ))}
    </motion.div>
  );
};
