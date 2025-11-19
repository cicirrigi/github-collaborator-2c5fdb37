'use client';

import { WeatherCache } from '@/lib/weather/cache';
import { RateLimiter } from '@/lib/weather/rateLimit';
import type { LocationData } from '@/lib/weather/types';
import { create } from 'zustand';

interface LocationStore {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  canRequestPrecise: boolean;

  _cache: WeatherCache;
  _rate: RateLimiter;

  autoDetect: () => Promise<void>;
  requestGPS: () => Promise<void>;
}

export const useLocationStore = create<LocationStore>((set, get) => ({
  location: null,
  loading: false,
  error: null,
  canRequestPrecise: true,

  _cache: new WeatherCache(5 * 60 * 1000), // 5 min → perfect for booking
  _rate: new RateLimiter(),

  /** IP AUTO-DETECT */
  async autoDetect() {
    const { _cache, _rate } = get();

    if (!_rate.canAutoDetect()) return;

    // Check cache
    const cached = _cache.get<LocationData>('location_ip');
    if (cached) {
      set({ location: cached });
      return;
    }

    set({ loading: true, error: null });

    try {
      const res = await fetch('/api/location/detect');
      const loc = await res.json();

      if (loc?.lat && loc?.lng && loc?.source === 'ip') {
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
        error: null,
      });
    } finally {
      set({ loading: false });
    }
  },

  /** GPS */
  async requestGPS() {
    const { _rate } = get();

    if (!_rate.canPrecise()) {
      set({ error: 'GPS limit reached' });
      return;
    }

    set({ loading: true, error: null });

    const pos = await new Promise<GeolocationPosition | null>(resolve => {
      navigator.geolocation?.getCurrentPosition(
        p => resolve(p),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 15000 }
      );
    });

    if (!pos) {
      const insecure = location.protocol === 'http:' && !location.hostname.includes('localhost');

      set({
        error: insecure ? 'GPS requires HTTPS or localhost' : 'GPS unavailable',
        loading: false,
      });
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

      set({ location: loc, error: null });
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
