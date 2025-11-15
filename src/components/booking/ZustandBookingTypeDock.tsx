'use client';

import { BookingFloatingDock } from '@/components/ui/booking-floating-dock/BookingFloatingDock.modular';
import { designTokens } from '@/config/theme.config';
import { useBookingStore, type TripType } from '@/features/booking/store/booking.store';
import { ArrowRight, CalendarRange, Car, Clock, Gem, RefreshCw } from 'lucide-react';

/**
 * 🎛️ Zustand Booking Type Dock - Selecția tipului de călătorie cu Zustand
 *
 * Dock adaptat pentru a funcționa cu useBookingStore în loc de props
 * Include toate opțiunile: oneway, return, hourly, daily, fleet, bespoke
 */
export function ZustandBookingTypeDock() {
  const { tripType, setTripType } = useBookingStore();

  const baseItems = [
    {
      title: 'One Way',
      icon: ArrowRight,
      tab: 'oneway' as TripType,
    },
    {
      title: 'Return',
      icon: RefreshCw,
      tab: 'return' as TripType,
    },
    {
      title: 'Hourly',
      icon: Clock,
      tab: 'hourly' as TripType,
    },
    {
      title: 'Daily',
      icon: CalendarRange,
      tab: 'daily' as TripType,
    },
    {
      title: 'Fleet',
      icon: Car,
      tab: 'fleet' as TripType,
    },
    {
      title: 'Bespoke',
      icon: Gem,
      tab: 'bespoke' as TripType,
    },
  ].map(({ title, icon: Icon, tab }) => ({
    title,
    icon: (
      <Icon
        className='h-full w-full transition-[color,filter] duration-150 ease-out'
        style={{
          color:
            tripType === tab ? designTokens.colors.brand.primary : designTokens.colors.text.muted,
          filter:
            tripType === tab
              ? `drop-shadow(0 2px 8px rgba(255,215,0,0.3)) drop-shadow(0 0 20px rgba(255,215,0,0.2))`
              : `drop-shadow(0 1px 3px rgba(0,0,0,0.1))`,
          textShadow: tripType === tab ? '0 0 15px rgba(255,215,0,0.4)' : 'none',
        }}
      />
    ),
    onClick: () => setTripType(tab),
    isActive: tripType === tab,
  }));

  return <BookingFloatingDock items={baseItems} />;
}
