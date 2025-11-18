'use client';

import { Button } from '@/components/ui';
import { luxuryCardTokens } from '@/design-system/tokens/luxury-card';
import { useWeather } from '@/hooks/weather';
import { motion } from 'framer-motion';
import { Crosshair, Eye, MapPin, RefreshCw, Thermometer, Wind } from 'lucide-react';

export function WeatherWidget() {
  const {
    location,
    weather,
    loading,
    error,
    autoDetect,
    refresh,
    requestPreciseLocation,
    canRequestPrecise,
  } = useWeather();

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
    hover: {
      scale: 1.02,
      boxShadow: luxuryCardTokens.shadows.hover,
      transition: {
        duration: Number(luxuryCardTokens.durations.normal.replace('ms', '')) / 1000,
        ease: 'easeInOut',
      },
    },
  };

  const shimmerVariants = {
    initial: { x: '-100%' },
    animate: {
      x: '100%',
      transition: {
        duration: 2,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatDelay: 3,
      },
    },
  };

  if (loading) {
    return (
      <motion.div
        variants={cardVariants}
        initial='initial'
        animate='animate'
        className='relative overflow-hidden rounded-xl bg-gradient-to-br from-neutral-900/95 via-neutral-800/95 to-neutral-900/95 backdrop-blur-lg border border-white/10 p-6'
        style={{
          boxShadow: luxuryCardTokens.shadows.base,
        }}
      >
        {/* Shimmer effect */}
        <motion.div
          variants={shimmerVariants}
          initial='initial'
          animate='animate'
          className='absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent'
          style={{ transform: 'skewX(-12deg)' }}
        />

        <div className='flex items-center justify-center h-32 relative'>
          <div className='flex items-center space-x-3 text-neutral-300'>
            <RefreshCw className='h-5 w-5 animate-spin text-amber-400' />
            <span className='font-medium'>Detecting location...</span>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        variants={cardVariants}
        initial='initial'
        animate='animate'
        className='relative overflow-hidden rounded-xl bg-gradient-to-br from-red-900/20 via-neutral-800/95 to-neutral-900/95 backdrop-blur-lg border border-red-500/20 p-6'
      >
        <div className='text-center space-y-4 relative'>
          <div className='text-red-400 text-sm font-medium'>{error}</div>
          <div className='flex gap-3 justify-center'>
            <Button
              size='sm'
              variant='outline'
              onClick={autoDetect}
              className='bg-neutral-800/50 border-neutral-600 hover:bg-neutral-700/70 hover:border-amber-500/50 text-neutral-200'
            >
              Try Again
            </Button>
            {canRequestPrecise && (
              <Button
                size='sm'
                onClick={requestPreciseLocation}
                className='bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-medium'
              >
                <Crosshair className='h-3 w-3 mr-1' />
                Use GPS
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  if (!weather) {
    return (
      <motion.div
        variants={cardVariants}
        initial='initial'
        animate='animate'
        className='relative overflow-hidden rounded-xl bg-gradient-to-br from-neutral-900/95 via-neutral-800/95 to-neutral-900/95 backdrop-blur-lg border border-white/10 p-6 text-center'
      >
        <p className='text-neutral-400'>No weather data available</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial='initial'
      animate='animate'
      whileHover='hover'
      className='relative overflow-hidden rounded-xl bg-gradient-to-br from-neutral-900/95 via-neutral-800/95 to-neutral-900/95 backdrop-blur-lg border border-white/10 p-6'
      style={{
        boxShadow: luxuryCardTokens.shadows.base,
      }}
    >
      {/* Luxury shimmer overlay */}
      <motion.div
        variants={shimmerVariants}
        initial='initial'
        animate='animate'
        className='absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/5 to-transparent pointer-events-none'
        style={{ transform: 'skewX(-12deg)' }}
      />

      <div className='space-y-4 relative'>
        {/* Header with location and controls */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <MapPin className='h-4 w-4 text-amber-400' />
            <span className='text-sm font-medium text-neutral-200'>
              {location?.city}, {location?.country}
            </span>
            <span className='px-2 py-1 rounded-full text-xs bg-neutral-700/50 text-neutral-400'>
              {location?.source}
            </span>
          </div>

          <div className='flex items-center gap-2'>
            {canRequestPrecise && location?.source !== 'gps' && (
              <Button
                size='sm'
                variant='ghost'
                onClick={requestPreciseLocation}
                className='h-8 w-8 p-0 text-amber-400 hover:bg-amber-400/10 hover:text-amber-300'
              >
                <Crosshair className='h-3 w-3' />
              </Button>
            )}
            <Button
              size='sm'
              variant='ghost'
              onClick={refresh}
              className='h-8 w-8 p-0 text-neutral-400 hover:bg-neutral-700/50 hover:text-neutral-200'
            >
              <RefreshCw className='h-3 w-3' />
            </Button>
          </div>
        </div>

        {/* Current weather showcase */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <div className='p-3 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-400/30'>
              <Thermometer className='h-6 w-6 text-amber-400' />
            </div>
            <div>
              <p className='text-3xl font-bold bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent'>
                {Math.round(weather.current.temperature.degrees)}°
              </p>
              <p className='text-xs text-neutral-400 font-medium'>
                {weather.current.condition.description}
              </p>
              <p className='text-xs text-neutral-500'>
                Feels like {Math.round(weather.current.feelsLike.degrees)}°
              </p>
            </div>
          </div>

          {/* Weather metrics */}
          <div className='text-right space-y-2'>
            <div className='flex items-center justify-end space-x-2 text-xs'>
              <span className='text-blue-400 text-sm'>💧</span>
              <span className='text-neutral-300 font-medium'>{weather.current.humidity}%</span>
              <span className='text-neutral-500'>humidity</span>
            </div>
            <div className='flex items-center justify-end space-x-2 text-xs'>
              <Wind className='h-3 w-3 text-neutral-400' />
              <span className='text-neutral-300 font-medium'>{weather.current.wind.speedKmh}</span>
              <span className='text-neutral-500'>km/h</span>
            </div>
            <div className='flex items-center justify-end space-x-2 text-xs'>
              <Eye className='h-3 w-3 text-neutral-400' />
              <span className='text-neutral-300 font-medium'>{weather.current.visibilityKm}</span>
              <span className='text-neutral-500'>km</span>
            </div>
          </div>
        </div>

        {/* Weather alerts */}
        {weather.alerts && weather.alerts.length > 0 && (
          <div className='rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 p-3'>
            <div className='flex items-center space-x-2'>
              <div className='h-2 w-2 rounded-full bg-orange-400 animate-pulse' />
              <p className='text-xs font-semibold text-orange-400'>Weather Alert</p>
            </div>
            <p className='text-xs text-orange-300 mt-1'>{weather.alerts[0]?.title}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
