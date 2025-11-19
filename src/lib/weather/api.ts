import type { WeatherBundle } from './types';

export async function fetchFullWeather(lat: number, lng: number): Promise<WeatherBundle> {
  const url = `/api/weather?lat=${lat}&lng=${lng}`;

  const res = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Weather fetch failed: ${res.status}`);
  }

  return (await res.json()) as WeatherBundle;
}
