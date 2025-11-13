'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '@/lib/utils/cn';
import type { BookingDockItem } from './dock.types';

interface FloatingDockMobileProps {
  items: BookingDockItem[];
  className?: string;
}

export const FloatingDockMobile = ({ items, className }: FloatingDockMobileProps) => {
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
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  y: 10,
                  transition: { delay: idx * 0.05 },
                }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
              >
                <button
                  onClick={item.onClick}
                  className='
                    flex h-10 w-10 items-center justify-center rounded-full
                    bg-white/90 border border-gray-200
                    backdrop-blur-sm shadow-lg
                    dark:bg-neutral-900/90 dark:border-neutral-700
                  '
                >
                  <div className='h-5 w-5 text-neutral-600 dark:text-neutral-300'>{item.icon}</div>
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(prev => !prev)}
        className='
          flex h-10 w-10 items-center justify-center rounded-full
          bg-white/90 border border-gray-200
          backdrop-blur-sm shadow-lg
          dark:bg-neutral-900/90 dark:border-neutral-700
        '
      >
        <Menu className='h-5 w-5 text-neutral-500 dark:text-neutral-400' />
      </button>
    </div>
  );
};
