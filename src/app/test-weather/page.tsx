'use client';

export const dynamic = 'force-dynamic';

import { Button, Card } from '@/components/ui';
import { WeatherWidget } from '@/features/booking/components/step1/WeatherWidget';
import { useWeather } from '@/hooks/weather';
import { AlertTriangle, Eye, MapPin, RefreshCw, Thermometer, Wind } from 'lucide-react';

export default function TestWeatherPage() {
  const {
    location,
    weather,
    loading,
    error,
    autoDetect,
    requestPreciseLocation,
    canRequestPrecise,
    refresh,
  } = useWeather();

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8'>
      <div className='max-w-4xl mx-auto space-y-8'>
        {/* Header */}
        <div className='text-center space-y-4'>
          <h1 className='text-4xl font-bold text-gray-900 dark:text-white'>
            🌤️ Weather System Test
          </h1>
          <p className='text-lg text-gray-600 dark:text-gray-300'>
            Testează implementarea completă Weather cu Zustand + Google API
          </p>
        </div>

        {/* Control Panel */}
        <Card className='vl-card p-6'>
          <h2 className='text-xl font-semibold mb-4 flex items-center space-x-2'>
            <MapPin className='h-5 w-5' />
            <span>Controls</span>
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <Button onClick={autoDetect} disabled={loading} className='flex items-center space-x-2'>
              <MapPin className='h-4 w-4' />
              <span>Auto Detect (IP)</span>
              {loading && <RefreshCw className='h-4 w-4 animate-spin' />}
            </Button>

            <Button
              onClick={requestPreciseLocation}
              disabled={loading || !canRequestPrecise}
              variant='outline'
              className='flex items-center space-x-2'
            >
              <MapPin className='h-4 w-4' />
              <span>GPS Precise</span>
              {!canRequestPrecise && <span className='text-xs'>(Limited)</span>}
            </Button>

            <Button
              onClick={refresh}
              disabled={loading || !location}
              variant='ghost'
              className='flex items-center space-x-2'
            >
              <RefreshCw className='h-4 w-4' />
              <span>Refresh Weather</span>
            </Button>
          </div>
        </Card>

        {/* Weather Widget Demo */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Widget Component */}
          <div className='space-y-4'>
            <h2 className='text-xl font-semibold'>WeatherWidget Component</h2>
            <WeatherWidget />
          </div>

          {/* Raw Data Display */}
          <div className='space-y-4'>
            <h2 className='text-xl font-semibold'>Raw Hook Data</h2>

            {/* Location Info */}
            <Card className='vl-card p-4'>
              <h3 className='font-medium mb-2 flex items-center space-x-2'>
                <MapPin className='h-4 w-4' />
                <span>Location Data</span>
              </h3>
              {location ? (
                <div className='space-y-1 text-sm'>
                  <p>
                    <span className='font-medium'>City:</span> {location.city}
                  </p>
                  <p>
                    <span className='font-medium'>Country:</span> {location.country}
                  </p>
                  <p>
                    <span className='font-medium'>Coordinates:</span> {location.lat.toFixed(4)},{' '}
                    {location.lng.toFixed(4)}
                  </p>
                  <p>
                    <span className='font-medium'>Source:</span>{' '}
                    <span className='px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs'>
                      {location.source}
                    </span>
                  </p>
                </div>
              ) : (
                <p className='text-gray-500 text-sm'>No location data</p>
              )}
            </Card>

            {/* Weather Details */}
            {weather && (
              <Card className='vl-card p-4'>
                <h3 className='font-medium mb-2 flex items-center space-x-2'>
                  <Thermometer className='h-4 w-4' />
                  <span>Current Weather</span>
                </h3>
                <div className='space-y-2 text-sm'>
                  <div className='grid grid-cols-2 gap-2'>
                    <p>
                      <span className='font-medium'>Temperature:</span>{' '}
                      {weather.current.temperature.degrees}°
                    </p>
                    <p>
                      <span className='font-medium'>Feels Like:</span>{' '}
                      {weather.current.feelsLike.degrees}°
                    </p>
                    <p>
                      <span className='font-medium'>Humidity:</span> {weather.current.humidity}%
                    </p>
                    <p>
                      <span className='font-medium'>UV Index:</span> {weather.current.uvIndex}
                    </p>
                  </div>

                  <div className='border-t pt-2'>
                    <p>
                      <span className='font-medium'>Condition:</span>{' '}
                      {weather.current.condition.description}
                    </p>
                    <div className='flex items-center space-x-4 mt-1'>
                      <span className='flex items-center space-x-1'>
                        <Wind className='h-3 w-3' />
                        <span>
                          {weather.current.wind.speedKmh} km/h {weather.current.wind.direction}
                        </span>
                      </span>
                      <span className='flex items-center space-x-1'>
                        <Eye className='h-3 w-3' />
                        <span>{weather.current.visibilityKm} km</span>
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Forecast */}
            {weather?.forecast && weather.forecast.length > 0 && (
              <Card className='vl-card p-4'>
                <h3 className='font-medium mb-2'>5-Day Forecast</h3>
                <div className='space-y-2'>
                  {weather.forecast.slice(0, 3).map((day, index) => (
                    <div
                      key={index}
                      className='flex justify-between items-center text-sm border-b pb-2'
                    >
                      <span>{day.date}</span>
                      <span>
                        {day.minTemp}° - {day.maxTemp}°
                      </span>
                      <span className='text-xs text-gray-500'>{day.daytime.description}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Alerts */}
            {weather?.alerts && weather.alerts.length > 0 && (
              <Card className='vl-card p-4 border-orange-200 bg-orange-50'>
                <h3 className='font-medium mb-2 flex items-center space-x-2 text-orange-800'>
                  <AlertTriangle className='h-4 w-4' />
                  <span>Weather Alerts ({weather.alerts.length})</span>
                </h3>
                <div className='space-y-2'>
                  {weather.alerts.slice(0, 2).map((alert, index) => (
                    <div key={index} className='text-sm'>
                      <p className='font-medium text-orange-800'>{alert.title}</p>
                      <p className='text-orange-600 text-xs'>
                        {alert.severity} - {alert.eventType}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Status */}
            <Card className='vl-card p-4'>
              <h3 className='font-medium mb-2'>System Status</h3>
              <div className='space-y-1 text-sm'>
                <p>
                  <span className='font-medium'>Loading:</span>{' '}
                  <span className={loading ? 'text-orange-600' : 'text-green-600'}>
                    {loading ? 'Yes' : 'No'}
                  </span>
                </p>
                <p>
                  <span className='font-medium'>Error:</span>{' '}
                  <span className={error ? 'text-red-600' : 'text-green-600'}>
                    {error || 'None'}
                  </span>
                </p>
                <p>
                  <span className='font-medium'>Can Request GPS:</span>{' '}
                  <span className={canRequestPrecise ? 'text-green-600' : 'text-red-600'}>
                    {canRequestPrecise ? 'Yes' : 'No (Rate Limited)'}
                  </span>
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* JSON Debug */}
        {weather && (
          <Card className='vl-card p-4'>
            <h3 className='font-medium mb-2'>Raw JSON Data (Debug)</h3>
            <pre className='text-xs bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto max-h-60'>
              {JSON.stringify({ location, weather, loading, error }, null, 2)}
            </pre>
          </Card>
        )}
      </div>
    </div>
  );
}
