'use client';

import { cn } from '@/lib/utils/cn';
import { Menu } from 'lucide-react';
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useRef, useState } from 'react';
import type { BookingDockItem, FloatingDockProps } from './dock.types';

/**
 * 🎛️ Elegant Floating Dock - Clean & Simple
 * Based on modern design principles - less is more
 */
export const BookingFloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
}: FloatingDockProps) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
}: {
  items: BookingDockItem[];
  className?: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn('relative block md:hidden', className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId='nav'
            className='absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2'
          >
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  transition: {
                    delay: idx * 0.05,
                  },
                }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
              >
                <button
                  onClick={item.onClick}
                  className='flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 dark:bg-neutral-900/90 dark:border-neutral-700 shadow-lg'
                >
                  <div className='h-5 w-5 text-neutral-600 dark:text-neutral-300'>{item.icon}</div>
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className='flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 dark:bg-neutral-900/90 dark:border-neutral-700 shadow-lg'
      >
        <Menu className='h-5 w-5 text-neutral-500 dark:text-neutral-400' />
      </button>
    </div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
}: {
  items: BookingDockItem[];
  className?: string;
}) => {
  let mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={e => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        'mx-auto hidden h-16 items-end gap-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-gray-200/50 px-4 pb-3 md:flex dark:bg-neutral-900/80 dark:border-neutral-700/50 shadow-xl',
        className
      )}
    >
      {items.map(item => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  onClick,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  let ref = useRef<HTMLDivElement>(null);

  let distance = useTransform(mouseX, val => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  let widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);

  let widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);
  let heightTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);

  let width = useSpring(widthTransform, {
    mass: 0.2,
    stiffness: 100,
    damping: 20,
  });
  let height = useSpring(heightTransform, {
    mass: 0.2,
    stiffness: 100,
    damping: 20,
  });

  let widthIcon = useSpring(widthTransformIcon, {
    mass: 0.2,
    stiffness: 100,
    damping: 20,
  });
  let heightIcon = useSpring(heightTransformIcon, {
    mass: 0.2,
    stiffness: 100,
    damping: 20,
  });

  const [hovered, setHovered] = useState(false);

  return (
    <button onClick={onClick}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className='relative flex aspect-square items-center justify-center rounded-full bg-white/60 backdrop-blur-sm border border-gray-200/60 dark:bg-neutral-800/60 dark:border-neutral-600/60 shadow-lg hover:shadow-xl transition-shadow'
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 2, x: '-50%' }}
              className='absolute -top-8 left-1/2 w-fit rounded-md border border-gray-200 bg-white/90 backdrop-blur-sm px-2 py-0.5 text-xs whitespace-pre text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800/90 dark:text-white shadow-lg'
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className='flex items-center justify-center text-neutral-600 dark:text-neutral-300'
        >
          {icon}
        </motion.div>
      </motion.div>
    </button>
  );
}
