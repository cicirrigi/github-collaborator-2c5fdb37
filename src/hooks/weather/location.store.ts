'use client';

import { WeatherCache } from '@/lib/weather/cache';
import { RateLimiter } from '@/lib/weather/rateLimit';
import type { LocationData } from '@/lib/weather/types';
import { create } from 'zustand';

interface LocationStore {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  _cache: WeatherCache;
  _rate: RateLimiter;
  canRequestPrecise: boolean;
  autoDetect: () => Promise<void>;
  requestGPS: () => Promise<void>;
}

export const useLocationStore = create<LocationStore>((set, get) => ({
  location: null,
  loading: false,
  error: null,

  _cache: new WeatherCache(5 * 60 * 1000), // 5 min
  _rate: new RateLimiter(),

  canRequestPrecise: true,

  /** AUTO-DETECT (IP) */
  async autoDetect() {
    const { _cache, _rate } = get();

    // Rate limit
    if (!_rate.canAutoDetect()) return;

    // 1. Try IP cache
    const cached = _cache.get('location_ip') as LocationData;
    if (cached) {
      set({ location: cached });
      return;
    }

    set({ loading: true });

    try {
      const res = await fetch('/api/location/detect');
      const loc = await res.json();

      if (loc.source === 'ip') {
        _cache.set('location_ip', loc);
      }

      set({ location: loc });
      _rate.recordAutoDetect();
    } catch {
      set({
        location: {
          city: 'London',
          country: 'UK',
          lat: 51.5074,
          lng: -0.1278,
          source: 'fallback',
        },
      });
    } finally {
      set({ loading: false });
    }
  },

  /** PRECISE LOCATION (GPS) */
  async requestGPS() {
    const { _rate } = get();

    if (!_rate.canPrecise()) {
      set({ error: 'GPS limit reached' });
      return;
    }

    set({ loading: true });

    const pos = await new Promise<GeolocationPosition | null>(resolve => {
      navigator.geolocation?.getCurrentPosition(resolve, () => resolve(null), {
        enableHighAccuracy: true,
        timeout: 10000,
      });
    });

    if (!pos) {
      set({ loading: false, error: 'GPS denied' });
      return;
    }

    const { latitude: lat, longitude: lng } = pos.coords;

    try {
      const res = await fetch(`/api/location/reverse?lat=${lat}&lng=${lng}`);
      const data = await res.json();

      const loc: LocationData = {
        city: data.city,
        country: data.country,
        lat,
        lng,
        source: 'gps',
      };

      set({ location: loc });
    } catch {
      set({
        location: {
          city: 'Precise Location',
          country: '',
          lat,
          lng,
          source: 'gps',
        },
      });
    }

    _rate.recordPrecise();
    set({ loading: false });
  },
}));
