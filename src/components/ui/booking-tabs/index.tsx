'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

import { DEFAULT_BOOKING_TABS, LAYOUT_CONFIG, SIZE_CLASSES, THEME_CLASSES } from './constants';
import type { BookingTabsProps, BookingTabType } from './types';

// Re-export types pentru convenience
export type { BookingTab, BookingTabsProps, BookingTabType } from './types';

export const BookingTabs = ({
  activeTab = 'oneway',
  onTabChange,
  variant = 'default',
  size = 'md',
  className,
}: BookingTabsProps) => {
  const [selectedTab, setSelectedTab] = useState<BookingTabType>(activeTab);
  const _uniqueId = `booking-tabs-${Math.random().toString(36).slice(2)}`; // Unique ID for each component instance

  // Synch activeTab prop with internal state (controlled usage)
  useEffect(() => {
    setSelectedTab(activeTab);
  }, [activeTab]);

  const handleTabChange = (tab: BookingTabType) => {
    setSelectedTab(tab);
    onTabChange?.(tab);
  };

  // Extract findIndex for better readability
  const activeIndex = DEFAULT_BOOKING_TABS.findIndex(tab => tab.id === selectedTab);

  // Folosesc constants în loc de duplicare

  return (
    <div className={cn('mx-auto w-full max-w-2xl', className)}>
      <div
        className={cn(
          'relative grid rounded-full transition-all',
          THEME_CLASSES.container.background,
          THEME_CLASSES.container.backdrop,
          SIZE_CLASSES.container[size],
          'duration-300'
        )}
        style={{ gridTemplateColumns: LAYOUT_CONFIG.gridTemplate }}
      >
        {/* Animated background pill */}
        <motion.div
          className={cn('absolute z-0 rounded-full shadow-sm', THEME_CLASSES.pill.gradient)}
          initial={false}
          animate={{
            transform: `translateX(${activeIndex * 100}%)`,
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 30,
            mass: 1,
          }}
          style={{
            width: '25%',
            height: variant === 'compact' ? '80%' : '90%',
            top: variant === 'compact' ? '10%' : '5%',
          }}
        />

        {/* Tab buttons */}
        {DEFAULT_BOOKING_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              'relative z-10 rounded-full font-medium transition-all duration-300',
              'flex items-center justify-center gap-2',
              'hover:scale-105 active:scale-95',
              SIZE_CLASSES.tab[size],
              selectedTab === tab.id ? THEME_CLASSES.tab.active : THEME_CLASSES.tab.inactive
            )}
          >
            <tab.icon className={cn('transition-all duration-300', SIZE_CLASSES.icon[size])} />

            <span className={cn(variant === 'compact' && size === 'sm' && 'hidden sm:inline')}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Tab descriptions (optional) */}
      {variant !== 'compact' && (
        <div className='mt-3 text-center'>
          <motion.p
            key={selectedTab}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className='text-sm text-gray-600'
          >
            {DEFAULT_BOOKING_TABS.find(tab => tab.id === selectedTab)?.description}
          </motion.p>
        </div>
      )}
    </div>
  );
};
