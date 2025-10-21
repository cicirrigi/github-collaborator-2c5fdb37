'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { BOOKING_TABS, TAB_GRADIENTS, SIZE_CLASSES } from './constants';
import type { BookingTabsProProps, BookingTabType } from './types';

export const BookingTabsPro = ({
  activeTab = 'oneway',
  onTabChange,
  size = 'md',
  className,
}: BookingTabsProProps) => {
  const [selectedTab, setSelectedTab] = useState<BookingTabType>(activeTab);

  useEffect(() => setSelectedTab(activeTab), [activeTab]);

  const handleTabChange = (tab: BookingTabType) => {
    setSelectedTab(tab);
    onTabChange?.(tab);
  };

  const activeIndex = BOOKING_TABS.findIndex(tab => tab.id === selectedTab);

  return (
    <div className={cn('mx-auto w-full max-w-3xl', className)}>
      <div
        className={cn(
          'relative grid rounded-full border border-white/10 backdrop-blur-md',
          'bg-white/[0.04] dark:bg-black/[0.25] shadow-[0_0_20px_-5px_rgba(203,178,106,0.25)]',
          SIZE_CLASSES[size].container
        )}
        style={{ gridTemplateColumns: `repeat(${BOOKING_TABS.length}, 1fr)` }}
      >
        {/* Animated Gradient Pill */}
        <motion.div
          className='absolute z-0 h-[90%] top-[5%] rounded-full shadow-md'
          initial={false}
          animate={{
            transform: `translateX(${activeIndex * 100}%)`,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{
            width: `${100 / BOOKING_TABS.length}%`,
            background: `linear-gradient(to right, ${TAB_GRADIENTS[selectedTab].from}, ${TAB_GRADIENTS[selectedTab].to})`,
          }}
        />

        {/* Tabs */}
        {BOOKING_TABS.map(tab => (
          <motion.button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={cn(
              'relative z-10 flex items-center justify-center gap-2 font-medium transition-all duration-300',
              SIZE_CLASSES[size].tab,
              selectedTab === tab.id
                ? 'text-black dark:text-neutral-900'
                : 'text-neutral-400 hover:text-neutral-200'
            )}
          >
            <motion.div
              animate={
                selectedTab === tab.id
                  ? { scale: [1, 1.15, 1], color: '#CBB26A' }
                  : { scale: 1, color: '#A3A3A3' }
              }
              transition={{ duration: 1.2, repeat: Infinity, repeatType: 'reverse' }}
            >
              <tab.icon className={cn(SIZE_CLASSES[size].icon)} />
            </motion.div>

            <span>{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Description */}
      <motion.p
        key={selectedTab}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='mt-4 text-center text-sm text-neutral-400'
      >
        {BOOKING_TABS.find(tab => tab.id === selectedTab)?.description}
      </motion.p>
    </div>
  );
};
