'use client';

import { WeatherForecastModal } from '@/features/booking/components/step1/WeatherForecastModal';
import { useWeather } from '@/hooks/weather';
import { useForecastModal } from '@/hooks/weather/useForecastModal';
import { MapPin, Sun } from 'lucide-react';

export function WeatherWidgetCompact() {
  const { location, weather } = useWeather();

  const {
    isOpen: isForecastOpen,
    forecast,
    location: modalLocation,
    openModal: openForecast,
    closeModal: closeForecast,
  } = useForecastModal();

  // Fallback pentru când nu avem date
  const displayData = {
    location: location ? `${location.city}` : 'London',
    temperature: weather ? Math.round(weather.current.temperature.degrees) : 18,
    condition: weather ? weather.current.condition.description : 'Loading...',
  };

  return (
    <>
      <div
        className='
          flex items-center space-x-3
          rounded-xl px-4 py-2
          hover:bg-white/10
          cursor-pointer transition-all duration-200
          text-sm
        '
        onClick={() => {
          // Deschide modalul cu forecast complet
          openForecast();
        }}
      >
        {/* Location */}
        <div className='flex items-center space-x-1 text-amber-200/80'>
          <MapPin className='w-3 h-3' />
          <span className='font-medium'>{displayData.location}</span>
        </div>

        {/* Weather */}
        <div className='flex items-center space-x-2'>
          <Sun className='w-5 h-5 text-amber-300' />
          <div className='flex flex-col'>
            <span className='text-white font-semibold'>{displayData.temperature}°C</span>
            <span className='text-amber-200/60 text-xs leading-none'>{displayData.condition}</span>
          </div>
        </div>
      </div>

      {/* Weather Forecast Modal */}
      <WeatherForecastModal
        isOpen={isForecastOpen}
        onClose={closeForecast}
        forecast={forecast}
        location={modalLocation}
      />
    </>
  );
}
