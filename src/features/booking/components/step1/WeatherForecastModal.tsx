'use client';

import type { ForecastDay } from '@/lib/weather/types';
import { AnimatePresence, motion } from 'framer-motion';
import { Cloud, CloudRain, Droplets, Sun, Wind, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  forecast: ForecastDay[];
  location: string | null;
}

export function WeatherForecastModal({ isOpen, onClose, forecast, location }: Props) {
  const getWeatherIcon = (d: string) => {
    const x = d.toLowerCase();
    if (x.includes('rain') || x.includes('drizzle'))
      return <CloudRain className='w-4 h-4 text-amber-300' />;
    if (x.includes('clear') || x.includes('sunny'))
      return <Sun className='w-4 h-4 text-amber-300' />;
    return <Cloud className='w-4 h-4 text-amber-300' />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50'
            onClick={onClose}
          />

          {/* Modal - perfectly centered */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className='fixed inset-0 flex items-center justify-center z-50 p-4'
          >
            <div className='bg-black/90 backdrop-blur-lg border border-amber-200/20 rounded-xl w-full max-w-md max-h-[85vh] mx-auto flex flex-col'>
              {/* Header - Fixed */}
              <div className='flex items-center justify-between p-6 pb-4 flex-shrink-0'>
                <div>
                  <h2 className='text-amber-50 text-lg font-light'>5-Day Forecast</h2>
                  {location && <p className='text-amber-200/70 text-sm font-light'>{location}</p>}
                </div>
                <button
                  onClick={onClose}
                  className='w-8 h-8 rounded-full bg-amber-300/10 hover:bg-amber-300/20 flex items-center justify-center text-amber-300/70 hover:text-amber-300 transition-all'
                >
                  <X className='w-4 h-4' />
                </button>
              </div>

              {/* Forecast List - Scrollable */}
              <div className='px-6 pb-6 overflow-auto flex-1'>
                <div className='space-y-3'>
                  {forecast.map((day, _index) => (
                    <div
                      key={day.date}
                      className='bg-white/5 rounded-lg p-3 border border-amber-200/10'
                    >
                      {/* Day Header */}
                      <div className='flex items-center justify-between mb-2'>
                        <span className='text-amber-100/80 text-sm font-light'>
                          {formatDate(day.date)}
                        </span>
                        <div className='flex items-center gap-2'>
                          <span className='text-amber-50 text-sm font-light'>
                            {Math.round(day.maxTemp)}° / {Math.round(day.minTemp)}°
                          </span>
                        </div>
                      </div>

                      {/* Day/Night Forecast */}
                      <div className='grid grid-cols-2 gap-3 text-xs'>
                        {/* Daytime */}
                        <div className='bg-white/3 rounded p-2'>
                          <div className='flex items-center gap-1 mb-1'>
                            {getWeatherIcon(day.daytime.description)}
                            <span className='text-amber-200/60 font-light'>Day</span>
                          </div>
                          <div className='text-amber-100/70 text-xs font-light mb-1'>
                            {day.daytime.description}
                          </div>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-1'>
                              <Wind className='w-2 h-2 text-amber-200/50' />
                              <span className='text-amber-100/60'>{day.daytime.windKmh}km/h</span>
                            </div>
                            <div className='flex items-center gap-1'>
                              <Droplets className='w-2 h-2 text-amber-200/50' />
                              <span className='text-amber-100/60'>{day.daytime.humidity}%</span>
                            </div>
                          </div>
                        </div>

                        {/* Nighttime */}
                        <div className='bg-white/3 rounded p-2'>
                          <div className='flex items-center gap-1 mb-1'>
                            {getWeatherIcon(day.nighttime.description)}
                            <span className='text-amber-200/60 font-light'>Night</span>
                          </div>
                          <div className='text-amber-100/70 text-xs font-light mb-1'>
                            {day.nighttime.description}
                          </div>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-1'>
                              <Wind className='w-2 h-2 text-amber-200/50' />
                              <span className='text-amber-100/60'>{day.nighttime.windKmh}km/h</span>
                            </div>
                            <div className='flex items-center gap-1'>
                              <Droplets className='w-2 h-2 text-amber-200/50' />
                              <span className='text-amber-100/60'>{day.nighttime.humidity}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
