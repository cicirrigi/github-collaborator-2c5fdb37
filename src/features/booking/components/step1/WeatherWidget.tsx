'use client';

import { useWeather } from '@/hooks/weather';
import { useForecastModal } from '@/hooks/weather/useForecastModal';
import { Cloud, CloudRain, Crosshair, Droplets, RefreshCw, Wind } from 'lucide-react';
import { CardHeader } from './CardHeader';
import { WeatherForecastModal } from './WeatherForecastModal';

export function WeatherWidget() {
  const { location, weather, loading, error, refresh, requestPreciseLocation, canRequestPrecise } =
    useWeather();

  const {
    isOpen: isForecastOpen,
    forecast,
    location: modalLocation,
    openModal: openForecast,
    closeModal: closeForecast,
  } = useForecastModal();

  const getWeatherIcon = (condition?: string) => {
    if (!condition) return <Cloud className='w-3 h-3 text-amber-300' />;

    const c = condition.toLowerCase();
    if (c.includes('rain') || c.includes('drizzle'))
      return <CloudRain className='w-3 h-3 text-amber-300' />;
    if (c.includes('clear') || c.includes('sunny'))
      return <Cloud className='w-3 h-3 text-amber-300' />;
    return <Cloud className='w-3 h-3 text-amber-300' />;
  };

  return (
    <div className='vl-card-flex' style={{ height: 'auto' }}>
      <CardHeader
        icon={Cloud}
        title='Weather Forecast'
        subtitle='Current conditions and forecast'
      />
      <div className='vl-card-inner space-y-2'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Cloud className='w-3 h-3 text-amber-200/60' />
            <span className='text-amber-100/80 text-sm font-light tracking-wider'>
              {location ? `${location.city}, ${location.country}` : 'Weather'}
            </span>

            {location?.source === 'gps' && (
              <span className='px-1 py-0.5 rounded text-[10px] bg-amber-300/20 text-amber-300/80 font-light'>
                GPS
              </span>
            )}
          </div>

          <div className='flex gap-2'>
            {canRequestPrecise && location?.source !== 'gps' && (
              <button
                onClick={requestPreciseLocation}
                className='w-6 h-6 rounded-full bg-amber-300/10 hover:bg-amber-300/20 flex items-center justify-center text-amber-300/70 hover:text-amber-300 transition-all'
              >
                <Crosshair className='w-3 h-3' />
              </button>
            )}

            <button
              onClick={refresh}
              className='w-6 h-6 rounded-full bg-amber-300/10 hover:bg-amber-300/20 flex items-center justify-center text-amber-300/70 hover:text-amber-300 transition-all'
            >
              <RefreshCw className='w-3 h-3' />
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className='bg-white/3 rounded p-2 border border-amber-200/10'>
            <div className='flex items-center gap-2'>
              <RefreshCw className='w-3 h-3 animate-spin text-amber-300/70' />
              <span className='text-amber-200/70 text-xs font-light'>Loading weather...</span>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className='bg-white/3 rounded p-2 border border-amber-200/10'>
            <div className='text-amber-200/60 text-xs font-light mb-2'>Unable to load weather</div>
            <div className='flex gap-2'>
              <button
                onClick={refresh}
                className='px-3 py-1 rounded-full bg-amber-300/10 hover:bg-amber-300/20 text-amber-300/70 hover:text-amber-300 text-xs font-light transition-all flex items-center gap-1'
              >
                <RefreshCw className='w-3 h-3' />
                Retry
              </button>

              {canRequestPrecise && (
                <button
                  onClick={requestPreciseLocation}
                  className='px-3 py-1 rounded-full bg-amber-300/10 hover:bg-amber-300/20 text-amber-300/70 hover:text-amber-300 text-xs font-light transition-all flex items-center gap-1'
                >
                  <Crosshair className='w-3 h-3' />
                  GPS
                </button>
              )}
            </div>
          </div>
        )}

        {/* Weather */}
        {!loading && !error && weather && (
          <>
            {/* Current Weather - Ultra Compact */}
            <div className='bg-white/3 rounded p-2 border border-amber-200/10'>
              <div className='flex items-center justify-between mb-1'>
                <div>
                  <div className='text-amber-50 text-lg font-light tabular-nums'>
                    {Math.round(weather.current.temperature.degrees)}°C
                  </div>
                  <div className='text-amber-100/80 text-xs font-light'>
                    {weather.current.condition.description}
                  </div>
                </div>
                <div className='w-6 h-6 bg-gradient-to-br from-amber-300/20 to-amber-400/30 rounded-full border border-amber-300/40 flex items-center justify-center'>
                  {getWeatherIcon(weather.current.condition.description)}
                </div>
              </div>

              {/* Weather Details - Single Line */}
              <div className='flex items-center justify-between text-sm'>
                <div className='flex items-center gap-1.5'>
                  <Wind className='w-3 h-3 text-amber-200/60' />
                  <span className='text-amber-100/60 font-light'>
                    {weather.current.wind.speedKmh}km/h
                  </span>
                </div>
                <div className='flex items-center gap-1.5'>
                  <Droplets className='w-3 h-3 text-amber-200/60' />
                  <span className='text-amber-100/60 font-light'>{weather.current.humidity}%</span>
                </div>
              </div>
            </div>

            {/* Forecast Button */}
            <div className='bg-white/3 rounded p-2 border border-amber-200/10 text-center'>
              <button
                onClick={openForecast}
                className='text-amber-300/70 hover:text-amber-300 text-xs font-light transition-colors tracking-wider'
              >
                View 5-Day Forecast
              </button>
            </div>
          </>
        )}

        {/* Forecast Modal */}
        <WeatherForecastModal
          isOpen={isForecastOpen}
          onClose={closeForecast}
          forecast={forecast}
          location={modalLocation}
        />
      </div>
    </div>
  );
}
