'use client';

import type { ForecastDay } from '@/lib/weather/types';
import { useState } from 'react';
import { useWeather } from './useWeather';

interface ForecastModalData {
  isOpen: boolean;
  forecast: ForecastDay[];
  location: string | null;
  openModal: () => void;
  closeModal: () => void;
}

export function useForecastModal(): ForecastModalData {
  const [isOpen, setIsOpen] = useState(false);
  const { weather, location } = useWeather();

  return {
    isOpen,
    openModal: () => setIsOpen(true),
    closeModal: () => setIsOpen(false),
    forecast: weather?.forecast || [],
    location: location ? `${location.city}, ${location.country}` : null,
  };
}
