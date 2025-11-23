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

  // Auto detect IP on first mount only - use ref to prevent dependency issues
  useEffect(() => {
    if (!location && !locLoading) {
      console.log('🔍 useEffect triggering autoDetect');
      autoDetect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, locLoading]); // Intentionally exclude autoDetect to prevent infinite loops

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
