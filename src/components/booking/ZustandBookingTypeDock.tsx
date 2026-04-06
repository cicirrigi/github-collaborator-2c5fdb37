'use client';

import { BookingFloatingDock } from '@/components/ui/booking-floating-dock/BookingFloatingDock.modular';
import type { BookingType } from '@/hooks/useBookingState';
import { useBookingState } from '@/hooks/useBookingState';
import { ArrowRight, CalendarRange, Car, Clock, Gem, RefreshCw } from 'lucide-react';

/**
 * 🎛️ Zustand Booking Type Dock — Modern Pill Style
 * Connects to Zustand store, passes LucideIcon components directly
 */
export function ZustandBookingTypeDock() {
  const { bookingType, setBookingType } = useBookingState();

  const items = [
    { title: 'One Way', icon: ArrowRight, tab: 'oneway' as BookingType },
    { title: 'Return', icon: RefreshCw, tab: 'return' as BookingType },
    { title: 'Hourly', icon: Clock, tab: 'hourly' as BookingType },
    { title: 'Daily', icon: CalendarRange, tab: 'daily' as BookingType },
    { title: 'Fleet', icon: Car, tab: 'fleet' as BookingType },
    { title: 'Bespoke', icon: Gem, tab: 'bespoke' as BookingType },
  ].map(({ title, icon, tab }) => ({
    title,
    icon,
    onClick: () => setBookingType(tab),
    isActive: bookingType === tab,
  }));

  return <BookingFloatingDock items={items} />;
}
