'use client';

import type { BookingTabType } from '@/components/ui/booking-tabs-pro/types';
import { useBookingState } from '@/hooks/useBookingState';
import type { BookingType } from '@/lib/booking/booking-rules';
import { useEffect } from 'react';

/**
 * 🔄 Hook pentru sincronizare tab activ cu Zustand store (UPDATED pentru noul store)
 *
 * Sincronizează tab-ul activ din UI cu booking state-ul global
 */
export function useBookingTabSync(activeTab: BookingTabType) {
  const { setBookingType } = useBookingState();

  useEffect(() => {
    // Direct mapping - BookingTabType e identic cu BookingType
    const bookingTypeMap: Record<BookingTabType, BookingType> = {
      oneway: 'oneway',
      return: 'return',
      hourly: 'hourly',
      fleet: 'fleet',
    };

    setBookingType(bookingTypeMap[activeTab]);
  }, [activeTab, setBookingType]);
}
