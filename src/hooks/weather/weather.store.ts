'use client';

import { fetchFullWeather } from '@/lib/weather/api';
import { WeatherCache } from '@/lib/weather/cache';
import type { LocationData, WeatherBundle } from '@/lib/weather/types';
import { create } from 'zustand';

interface WeatherStore {
  weather: WeatherBundle | null;
  loading: boolean;
  error: string | null;

  _cache: WeatherCache;

  load: (loc: LocationData) => Promise<void>;
  refresh: (loc: LocationData) => Promise<void>;
}

export const useWeatherStore = create<WeatherStore>((set, get) => ({
  weather: null,
  loading: false,
  error: null,

  _cache: new WeatherCache(30 * 60 * 1000), // 30 min cache

  /** LOAD WEATHER */
  async load(loc: LocationData) {
    const { _cache } = get();
    const key = `weather_${loc.lat}_${loc.lng}`;

    set({ loading: true });

    const cached = _cache.get<WeatherBundle>(key);
    if (cached) {
      set({ weather: cached, loading: false, error: null });
      return;
    }

    try {
      const data = await fetchFullWeather(loc.lat, loc.lng);
      _cache.set(key, data);
      set({ weather: data, error: null });
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : 'Weather fetch failed' });
    }

    set({ loading: false });
  },

  /** REFRESH WEATHER */
  async refresh(loc: LocationData) {
    const key = `weather_${loc.lat}_${loc.lng}`;
    get()._cache.clear(key);
    await get().load(loc);
  },
}));
