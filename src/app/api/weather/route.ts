import type { ForecastDay, WeatherAlert, WeatherBundle } from '@/lib/weather/types';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Google API response interfaces (minimal typing for external APIs)
interface GoogleForecastDay {
  displayDate: { year: number; month: number; day: number };
  minTemperature: { degrees: number };
  maxTemperature: { degrees: number };
  daytimeForecast: {
    weatherCondition: { description: { text: string }; iconBaseUri: string };
    relativeHumidity: number;
    precipitation?: { probability?: { percent: number } };
    wind?: { speed?: { value: number } };
  };
  nighttimeForecast: {
    weatherCondition: { description: { text: string }; iconBaseUri: string };
    relativeHumidity: number;
    precipitation?: { probability?: { percent: number } };
    wind?: { speed?: { value: number } };
  };
}

interface GoogleAlert {
  alertId: string;
  alertTitle?: { text: string };
  description?: string;
  eventType: string;
  severity: string;
  certainty: string;
  urgency: string;
  areaName: string;
  startTime: string;
  expirationTime?: string;
  dataSource: { name: string; authorityUri: string };
}

export async function GET(req: NextRequest) {
  try {
    const lat = req.nextUrl.searchParams.get('lat');
    const lng = req.nextUrl.searchParams.get('lng');

    if (!lat || !lng) {
      return NextResponse.json({ error: 'Missing ?lat= & ?lng=' }, { status: 400 });
    }

    const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
    const latNum = Number(lat);
    const lngNum = Number(lng);

    // ---------- CURRENT ----------
    const currentURL =
      `https://weather.googleapis.com/v1/currentConditions:lookup` +
      `?key=${KEY}&location.latitude=${latNum}&location.longitude=${lngNum}`;

    const currentRes = await fetch(currentURL);
    if (!currentRes.ok) throw new Error(`Current failed: ${currentRes.status}`);
    const current = await currentRes.json();

    // ---------- FORECAST ----------
    const forecastURL =
      `https://weather.googleapis.com/v1/forecast/days:lookup` +
      `?key=${KEY}&location.latitude=${latNum}&location.longitude=${lngNum}&days=5`;

    const forecastRes = await fetch(forecastURL);
    const forecastJson = await forecastRes.json();

    const forecast: ForecastDay[] =
      forecastJson?.forecastDays?.map((d: GoogleForecastDay) => ({
        date: `${d.displayDate.year}-${d.displayDate.month}-${d.displayDate.day}`,
        minTemp: d.minTemperature.degrees,
        maxTemp: d.maxTemperature.degrees,
        daytime: {
          description: d.daytimeForecast.weatherCondition.description.text,
          icon: d.daytimeForecast.weatherCondition.iconBaseUri,
          humidity: d.daytimeForecast.relativeHumidity,
          precipitationChance: d.daytimeForecast.precipitation?.probability?.percent ?? 0,
          windKmh: d.daytimeForecast.wind?.speed?.value ?? 0,
        },
        nighttime: {
          description: d.nighttimeForecast.weatherCondition.description.text,
          icon: d.nighttimeForecast.weatherCondition.iconBaseUri,
          humidity: d.nighttimeForecast.relativeHumidity,
          precipitationChance: d.nighttimeForecast.precipitation?.probability?.percent ?? 0,
          windKmh: d.nighttimeForecast.wind?.speed?.value ?? 0,
        },
      })) ?? [];

    // ---------- ALERTS ----------
    const alertsURL =
      `https://weather.googleapis.com/v1/publicAlerts:lookup` +
      `?key=${KEY}&location.latitude=${latNum}&location.longitude=${lngNum}`;

    const alertsRes = await fetch(alertsURL);
    const alertsJson = await alertsRes.json();

    const alerts: WeatherAlert[] =
      alertsJson.weatherAlerts?.map((a: GoogleAlert) => ({
        id: a.alertId,
        title: a.alertTitle?.text,
        description: a.description,
        eventType: a.eventType,
        severity: a.severity,
        certainty: a.certainty,
        urgency: a.urgency,
        areaName: a.areaName,
        startTime: a.startTime,
        endTime: a.expirationTime ?? null,
        dataSource: a.dataSource,
      })) ?? [];

    // ---------- BUNDLE ----------
    const bundle: WeatherBundle = {
      location: { lat: latNum, lng: lngNum },
      current: {
        currentTime: current.currentTime,
        isDaytime: current.isDaytime,
        temperature: current.temperature,
        feelsLike: current.feelsLikeTemperature,
        humidity: current.relativeHumidity,
        uvIndex: current.uvIndex,
        condition: {
          type: current.weatherCondition.type,
          description: current.weatherCondition.description.text,
          icon: current.weatherCondition.iconBaseUri,
        },
        wind: {
          direction: current.wind.direction.cardinal,
          speedKmh: current.wind.speed.value,
          gustKmh: current.wind.gust.value,
        },
        visibilityKm: current.visibility.distance,
        cloudCover: current.cloudCover,
      },
      forecast,
      alerts,
    };

    return NextResponse.json(bundle);
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error: 'Weather API failed',
        details: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
