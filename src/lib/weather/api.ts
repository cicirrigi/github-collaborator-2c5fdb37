import type { WeatherBundle } from './types';

export async function fetchFullWeather(lat: number, lng: number): Promise<WeatherBundle> {
  const res = await fetch(`/api/weather/full?lat=${lat}&lng=${lng}`, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error(`Weather API returned ${res.status}: ${res.statusText}`);
  }

  return res.json();
}
