'use client';

import { BookingFloatingDock } from '@/components/ui/booking-floating-dock/BookingFloatingDock.modular';
import { designTokens } from '@/config/theme.config';
import type { BookingType } from '@/hooks/useBookingState';
import { useBookingState } from '@/hooks/useBookingState';
import { ArrowRight, CalendarRange, Car, Clock, Gem, RefreshCw } from 'lucide-react';

/**
 * 🎛️ Zustand Booking Type Dock - Selecția tipului de călătorie cu Zustand
 *
 * Dock adaptat pentru a funcționa cu useBookingStore în loc de props
 * Include toate opțiunile: oneway, return, hourly, daily, fleet, bespoke
 */
export function ZustandBookingTypeDock() {
  const { bookingType, setBookingType } = useBookingState();

  const baseItems = [
    {
      title: 'One Way',
      icon: ArrowRight,
      tab: 'oneway' as BookingType,
    },
    {
      title: 'Return',
      icon: RefreshCw,
      tab: 'return' as BookingType,
    },
    {
      title: 'Hourly',
      icon: Clock,
      tab: 'hourly' as BookingType,
    },
    {
      title: 'Daily',
      icon: CalendarRange,
      tab: 'daily' as BookingType,
    },
    {
      title: 'Fleet',
      icon: Car,
      tab: 'fleet' as BookingType,
    },
    {
      title: 'Bespoke',
      icon: Gem,
      tab: 'bespoke' as BookingType,
    },
  ].map(({ title, icon: Icon, tab }) => ({
    title,
    icon: (
      <Icon
        className='h-full w-full transition-[color,filter] duration-150 ease-out'
        style={{
          color:
            bookingType === tab
              ? designTokens.colors.brand.primary
              : designTokens.colors.text.muted,
          filter:
            bookingType === tab
              ? `drop-shadow(0 2px 8px rgba(255,215,0,0.3)) drop-shadow(0 0 20px rgba(255,215,0,0.2))`
              : `drop-shadow(0 1px 3px rgba(0,0,0,0.1))`,
          textShadow: bookingType === tab ? '0 0 15px rgba(255,215,0,0.4)' : 'none',
        }}
      />
    ),
    onClick: () => setBookingType(tab),
    isActive: bookingType === tab,
  }));

  return <BookingFloatingDock items={baseItems} />;
}
