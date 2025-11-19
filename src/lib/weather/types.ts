// ---------- LOCATION ----------
export interface LocationData {
  city: string;
  country: string;
  lat: number;
  lng: number;
  source: 'ip' | 'gps' | 'fallback';
}

// ---------- CURRENT WEATHER ----------
export interface CurrentWeather {
  currentTime: string;
  isDaytime: boolean;
  temperature: { degrees: number; unit: 'CELSIUS' | 'FAHRENHEIT' };
  feelsLike: { degrees: number; unit: 'CELSIUS' | 'FAHRENHEIT' };
  humidity: number;
  uvIndex: number;
  condition: { type: string; description: string; icon: string };
  wind: { direction: string; speedKmh: number; gustKmh: number };
  visibilityKm: number;
  cloudCover: number;
}

// ---------- FORECAST ----------
export interface ForecastDay {
  date: string;
  minTemp: number;
  maxTemp: number;
  daytime: {
    description: string;
    icon: string;
    humidity: number;
    precipitationChance: number;
    windKmh: number;
  };
  nighttime: {
    description: string;
    icon: string;
    humidity: number;
    precipitationChance: number;
    windKmh: number;
  };
}

// ---------- ALERTS ----------
export interface WeatherAlert {
  id: string;
  title: string;
  description?: string;
  eventType: string;
  severity: string;
  certainty: string;
  urgency: string;
  areaName: string;
  startTime: string;
  endTime: string | null;
  dataSource: { name: string; authorityUri: string };
}

// ---------- COMPLETE BUNDLE ----------
export interface WeatherBundle {
  location: { lat: number; lng: number };
  current: CurrentWeather;
  forecast: ForecastDay[];
  alerts: WeatherAlert[];
}

// ---------- HOOK RETURN ----------

export interface UseWeatherReturn {
  location: LocationData | null;
  weather: WeatherBundle | null;
  loading: boolean;
  error: string | null;
  autoDetect: () => Promise<void>;
  requestPreciseLocation: () => Promise<void>;
  canRequestPrecise: boolean;
  refresh: () => Promise<void>;
}
