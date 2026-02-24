'use client';

import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { useEffect, useRef } from 'react';

export const IconContainer = ({
  mouseX,
  icon,
  title,
  onClick,
  isSeparator = false,
}: {
  mouseX: MotionValue<number>;
  icon: React.ReactNode;
  title?: string;
  onClick: () => void;
  isSeparator?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const centerX = useMotionValue(0);

  // calculate center ONCE + on resize
  useEffect(() => {
    const update = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      centerX.set(rect.left + rect.width / 2);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [centerX]);

  /**
   * DISTANCE — transform-only, NO LAYOUT
   */
  const distance = useTransform(mouseX, val => val - centerX.get());

  /**
   * ICON GROW — controlled and smooth
   * From 63px → 98px - bigger icons without affecting dock size
   */
  const sizeRaw = useTransform(distance, [-150, 0, 150], [63, 98, 63]);
  const iconSizeRaw = useTransform(distance, [-150, 0, 150], [30, 46, 30]);

  /**
   * PERFECT SMOOTH SPRINGS
   */
  const size = useSpring(sizeRaw, {
    mass: 0.2,
    stiffness: 220,
    damping: 18,
  });
  const iconSize = useSpring(iconSizeRaw, {
    mass: 0.2,
    stiffness: 220,
    damping: 18,
  });

  // For separators, use fixed size without magnification
  if (isSeparator) {
    return <div className='flex items-center justify-center h-20 px-3'>{icon}</div>;
  }

  return (
    <div className='flex flex-col items-center space-y-2'>
      <button onClick={onClick} className='focus:outline-none'>
        <motion.div
          ref={ref}
          style={{
            width: size,
            height: size,
            transform: 'translateZ(0)',
          }}
          className='
            relative
            flex items-center justify-center
            rounded-2xl
            bg-gradient-to-br from-neutral-700/90 via-neutral-800/85 to-neutral-900/80
            dark:from-neutral-800/90 dark:via-neutral-900/85 dark:to-black/80
            border border-neutral-600/50 dark:border-neutral-700/60
            shadow-lg shadow-black/15
            backdrop-blur-xl
            will-change-[width,height,transform]
            aspect-square
            overflow-hidden
            hover:shadow-2xl hover:shadow-yellow-400/20
            hover:border-yellow-300/40 dark:hover:border-yellow-500/40
            transition-[box-shadow,border-color] duration-150 ease-out
          '
        >
          <motion.div
            style={{
              width: iconSize,
              height: iconSize,
              transform: 'translateZ(0)',
            }}
            className='flex items-center justify-center text-neutral-100 dark:text-neutral-200'
          >
            {icon}
          </motion.div>
        </motion.div>
      </button>

      {/* Label discret sub iconiță */}
      {title && (
        <span className='text-xs text-amber-200/70 font-medium tracking-wide'>{title}</span>
      )}
    </div>
  );
};
