'use client';

import type { UseWeatherReturn } from '@/lib/weather/types';
import { useCallback, useEffect } from 'react';
import { useLocationStore } from './location.store';
import { useWeatherStore } from './weather.store';

export function useWeather(): UseWeatherReturn {
  const {
    location,
    loading: locLoading,
    error: locError,
    autoDetect,
    requestGPS,
    canRequestPrecise,
  } = useLocationStore();

  const { weather, loading: wxLoading, error: wxError, load, refresh } = useWeatherStore();

  const loading = locLoading || wxLoading;
  const error = locError || wxError;

  // First load → auto-detect
  useEffect(() => {
    if (!location) autoDetect();
  }, [autoDetect, location]);

  // Load weather when location updates
  useEffect(() => {
    if (location) load(location);
  }, [location, load]);

  const refreshWeather = useCallback(async () => {
    if (location) await refresh(location);
  }, [location, refresh]);

  return {
    location,
    weather,
    loading,
    error,
    autoDetect,
    requestPreciseLocation: requestGPS,
    canRequestPrecise,
    refresh: refreshWeather,
  };
}
