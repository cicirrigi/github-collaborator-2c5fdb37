'use client';

import { useEffect } from 'react';
import { useBookingState } from '@/hooks/useBookingState';
import type { BookingTabType } from '@/components/ui/booking-tabs-pro/types';
import type { TripType } from '@/types/booking/common.types';

/**
 * 🔄 Hook pentru sincronizare tab activ cu Zustand store
 *
 * Sincronizează tab-ul activ din UI cu booking state-ul global
 */
export function useBookingTabSync(activeTab: BookingTabType) {
  const { setTripType } = useBookingState();

  useEffect(() => {
    const tripTypeMap: Record<BookingTabType, TripType> = {
      oneway: 'oneway',
      return: 'return',
      hourly: 'hourly',
      fleet: 'fleet',
    };

    setTripType(tripTypeMap[activeTab]);
  }, [activeTab, setTripType]);
}
