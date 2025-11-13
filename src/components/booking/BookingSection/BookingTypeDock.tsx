'use client';

import { ArrowRight, RefreshCw, Clock, Car } from 'lucide-react';
import { BookingFloatingDock } from '@/components/ui/booking-floating-dock/BookingFloatingDock.modular';
import { designTokens } from '@/config/theme.config';
import type { BookingTabType } from '@/components/ui/booking-tabs-pro/types';

interface BookingTypeDockProps {
  activeTab: BookingTabType;
  onTabChange: (tab: BookingTabType) => void;
}

/**
 * 🎛️ Booking Type Dock - Selecția tipului de călătorie
 *
 * Dock cu animații pentru selecția tipului de booking (oneway, return, hourly, fleet)
 */
export function BookingTypeDock({ activeTab, onTabChange }: BookingTypeDockProps) {
  const baseItems = [
    {
      title: 'One Way',
      icon: ArrowRight,
      tab: 'oneway' as BookingTabType,
    },
    {
      title: 'Return',
      icon: RefreshCw,
      tab: 'return' as BookingTabType,
    },
    {
      title: 'Hourly',
      icon: Clock,
      tab: 'hourly' as BookingTabType,
    },
    {
      title: 'Fleet',
      icon: Car,
      tab: 'fleet' as BookingTabType,
    },
  ].map(({ title, icon: Icon, tab }) => ({
    title,
    icon: (
      <Icon
        className='h-full w-full transition-[color,filter] duration-150 ease-out'
        style={{
          color:
            activeTab === tab ? designTokens.colors.brand.primary : designTokens.colors.text.muted,
          filter:
            activeTab === tab
              ? `drop-shadow(0 2px 8px rgba(255,215,0,0.3)) drop-shadow(0 0 20px rgba(255,215,0,0.2))`
              : `drop-shadow(0 1px 3px rgba(0,0,0,0.1))`,
          textShadow: activeTab === tab ? '0 0 15px rgba(255,215,0,0.4)' : 'none',
        }}
      />
    ),
    onClick: () => onTabChange(tab),
    isActive: activeTab === tab,
  }));

  // Add separator in the middle (after first 2 items)
  const items = [
    ...baseItems.slice(0, 2), // First 2 items: One Way, Return
    {
      title: 'separator',
      icon: <div className='w-px h-8 bg-neutral-300 dark:bg-neutral-600 opacity-50' />,
      onClick: () => {}, // No action for separator
      isSeparator: true,
    },
    ...baseItems.slice(2), // Last 2 items: Hourly, Fleet
  ];

  return <BookingFloatingDock items={items} />;
}
