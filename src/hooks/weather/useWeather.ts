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

  // Auto detect IP on first mount
  useEffect(() => {
    if (!location && !locLoading) {
      autoDetect();
    }
  }, [location, locLoading, autoDetect]);

  // Load weather whenever location is updated
  useEffect(() => {
    if (location) load(location);
  }, [location, load]);

  // Refresh wrapper
  const doRefresh = useCallback(async () => {
    if (!location) return;
    await refresh(location);
  }, [location, refresh]);

  return {
    location,
    weather,
    loading,
    error,
    autoDetect,
    requestPreciseLocation: requestGPS,
    canRequestPrecise,
    refresh: doRefresh,
  };
}
