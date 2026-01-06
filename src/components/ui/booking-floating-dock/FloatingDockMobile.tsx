'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils/cn';
import type { BookingDockItem } from './dock.types';

interface FloatingDockMobileProps {
  items: BookingDockItem[];
  className?: string;
}

export const FloatingDockMobile = ({ items, className }: FloatingDockMobileProps) => {
  const [open, setOpen] = useState(false);

  // Find current active booking type
  const activeItem = items.find(item => item.isActive);

  return (
    <div className={cn('relative block md:hidden flex justify-center', className)}>
      <AnimatePresence>
        {open && (
          <>
            {/* Frosty backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className='fixed inset-0 bg-black/20 backdrop-blur-md z-[9998]'
              onClick={() => setOpen(false)}
            />

            {/* Dropdown content */}
            <motion.div
              layoutId='nav'
              className='absolute inset-x-0 top-full mt-2 flex flex-col gap-2 z-[9999]'
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
                    onClick={() => {
                      item.onClick();
                      setOpen(false); // Close menu after selection
                    }}
                    className={`flex items-center space-x-3 backdrop-blur-sm border rounded-full shadow-lg px-4 py-2 transition-colors w-full touch-manipulation ${
                      item.isActive
                        ? 'bg-[#CBB26A]/90 border-[#CBB26A]/50 shadow-[#CBB26A]/25'
                        : 'bg-white/90 dark:bg-neutral-900/90 border-gray-200 dark:border-neutral-700 hover:bg-white/95 dark:hover:bg-neutral-900/95'
                    }`}
                  >
                    <div className='flex h-8 w-8 items-center justify-center rounded-full'>
                      <div
                        className={`h-5 w-5 ${
                          item.isActive ? 'text-white' : 'text-neutral-600 dark:text-neutral-300'
                        }`}
                      >
                        {item.icon}
                      </div>
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        item.isActive ? 'text-white' : 'text-neutral-700 dark:text-neutral-200'
                      }`}
                    >
                      {item.title}
                    </span>
                  </button>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(prev => !prev)}
        className={`
          flex items-center gap-3 rounded-full px-4 py-2 h-10
          backdrop-blur-sm shadow-lg touch-manipulation transition-colors
          ${
            activeItem
              ? 'bg-[#CBB26A]/90 border border-[#CBB26A]/50 shadow-[#CBB26A]/25'
              : 'bg-white/90 border border-gray-200 dark:bg-neutral-900/90 dark:border-neutral-700'
          }
        `}
      >
        <Menu
          className={`h-5 w-5 flex-shrink-0 ${
            activeItem ? 'text-white' : 'text-neutral-500 dark:text-neutral-400'
          }`}
        />

        {/* Current booking type label */}
        <span
          className={`text-sm font-medium whitespace-nowrap ${
            activeItem ? 'text-white' : 'text-neutral-700 dark:text-neutral-200'
          }`}
        >
          {activeItem?.title || 'One Way'}
        </span>
      </button>
    </div>
  );
};
