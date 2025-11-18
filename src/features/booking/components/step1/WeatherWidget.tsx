'use client';

import { Cloud, CloudRain, Sun, Wind } from 'lucide-react';
import { CardHeader } from './CardHeader';

export function WeatherWidget() {
  // Mockup data - va fi înlocuit cu API real
  const mockWeatherData = {
    location: 'London',
    temperature: 18,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    forecast: [
      { time: '12:00', temp: 18, icon: 'sun' },
      { time: '15:00', temp: 20, icon: 'cloud' },
      { time: '18:00', temp: 16, icon: 'rain' },
      { time: '21:00', temp: 14, icon: 'cloud' },
    ],
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sun':
        return <Sun className='w-4 h-4 text-amber-300' />;
      case 'cloud':
        return <Cloud className='w-4 h-4 text-amber-200' />;
      case 'rain':
        return <CloudRain className='w-4 h-4 text-amber-200' />;
      default:
        return <Sun className='w-4 h-4 text-amber-300' />;
    }
  };

  return (
    <div className='vl-card-flex' style={{ height: 'auto' }}>
      <CardHeader
        icon={Cloud}
        title='Weather Forecast'
        subtitle='Current conditions and forecast'
      />
      <div className='vl-card-inner space-y-2'>
        {/* Header - Mini */}
        <div className='flex items-center gap-2'>
          <Cloud className='w-3 h-3 text-amber-200/60' />
          <span className='text-amber-100/80 text-xs font-light tracking-wider'>Weather</span>
        </div>

        {/* Current Weather - Ultra Compact */}
        <div className='bg-white/3 rounded p-2 border border-amber-200/10'>
          <div className='flex items-center justify-between mb-1'>
            <div>
              <div className='text-amber-50 text-lg font-light tabular-nums'>
                {mockWeatherData.temperature}°C
              </div>
              <div className='text-amber-100/80 text-xs font-light'>
                {mockWeatherData.condition}
              </div>
            </div>
            <div className='w-6 h-6 bg-gradient-to-br from-amber-300/20 to-amber-400/30 rounded-full border border-amber-300/40 flex items-center justify-center'>
              <Cloud className='w-3 h-3 text-amber-300' />
            </div>
          </div>

          {/* Weather Details - Single Line */}
          <div className='flex items-center justify-between text-xs'>
            <div className='flex items-center gap-1'>
              <Wind className='w-2 h-2 text-amber-200/60' />
              <span className='text-amber-100/60 font-light'>{mockWeatherData.windSpeed}km/h</span>
            </div>
            <div className='flex items-center gap-1'>
              <div className='w-1.5 h-1.5 rounded-full bg-amber-200/40'></div>
              <span className='text-amber-100/60 font-light'>{mockWeatherData.humidity}%</span>
            </div>
          </div>
        </div>

        {/* Forecast Button - Just Link */}
        <div className='bg-white/3 rounded p-2 border border-amber-200/10 text-center'>
          <button className='text-amber-200/60 hover:text-amber-200 text-xs font-light transition-colors tracking-wider'>
            View Full Forecast
          </button>
        </div>
      </div>
    </div>
  );
}
