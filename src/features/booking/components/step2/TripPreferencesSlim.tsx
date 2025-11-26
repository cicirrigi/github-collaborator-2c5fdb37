'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { useEffect, useRef, useState } from 'react';
import { TRIP_PREFERENCES } from './service-config';

interface TripPreferencesSlimProps {
  className?: string;
}

export function TripPreferencesSlim({ className = '' }: TripPreferencesSlimProps) {
  const bookingStore = useBookingState();
  const containerRef = useRef<HTMLDivElement>(null);

  const [openId, setOpenId] = useState<string | null>(null);

  // Close dropdown if click outside
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpenId(null);
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const preferences = bookingStore.tripConfiguration.servicePackages.tripPreferences;

  const updatePreference = (id: 'music' | 'temperature' | 'communication', value: string) => {
    // Type assertion for store methods - these exist in useBookingState
    const store = bookingStore as typeof bookingStore & {
      setMusicPreference: (value: string) => void;
      setTemperaturePreference: (value: string) => void;
      setCommunicationStyle: (value: string) => void;
    };
    if (id === 'music') store.setMusicPreference(value);
    if (id === 'temperature') store.setTemperaturePreference(value);
    if (id === 'communication') store.setCommunicationStyle(value);
  };

  return (
    <div ref={containerRef} className={`inline-block ${className}`}>
      <div
        className='
          flex flex-col
          px-4 py-3 rounded-xl
          backdrop-blur-xl
          border border-white/10
          shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_25px_rgba(0,0,0,0.45)]
        '
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.04))',
        }}
      >
        {/* Title Row */}
        <div className='flex items-center gap-2 mb-3'>
          <div
            className='w-7 h-7 rounded-lg flex items-center justify-center'
            style={{
              background:
                'conic-gradient(from 210deg, rgba(203,178,106,0.25), rgba(203,178,106,0.10), rgba(203,178,106,0.25))',
              boxShadow: '0 0 10px rgba(203,178,106,0.15)',
            }}
          >
            {(() => {
              const IconComponent = TRIP_PREFERENCES[0]?.icon;
              return IconComponent ? (
                <IconComponent className='w-4 h-4' style={{ color: '#CBB26A' }} />
              ) : null;
            })()}
          </div>

          <span className='text-white font-medium text-sm tracking-wide'>Trip Preferences</span>
        </div>

        {/* Preferences Row */}
        <div className='flex items-center gap-3'>
          {TRIP_PREFERENCES.map(pref => {
            const current = preferences[pref.id];
            const selectedLabel = pref.options.find(o => o.value === current)?.label || pref.title;

            return (
              <div key={pref.id} className='relative'>
                <button
                  className='
                    px-3 py-2 flex items-center gap-2
                    rounded-lg border border-white/10
                    bg-white/5 backdrop-blur-sm
                    hover:bg-white/10 hover:border-white/20
                    transition-all duration-150
                    text-white text-sm whitespace-nowrap
                  '
                  onClick={e => {
                    e.stopPropagation();
                    setOpenId(openId === pref.id ? null : pref.id);
                  }}
                >
                  <pref.icon className='w-4 h-4 text-amber-300' />
                  {selectedLabel}
                </button>

                {openId === pref.id && (
                  <div
                    className='
                      absolute top-full left-0 mt-2
                      rounded-lg shadow-2xl overflow-hidden
                      z-[9999] backdrop-blur-xl
                    '
                    style={{
                      background: 'rgba(15,15,15,0.95)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.6), 0 0 20px rgba(203,178,106,0.2)',
                    }}
                  >
                    {pref.options.map(option => (
                      <button
                        key={option.value}
                        className={`
                          w-full px-4 py-2 text-left text-sm
                          border-b border-white/5 last:border-b-0
                          transition-colors duration-150
                          ${option.value === current ? 'bg-yellow-400/20 text-yellow-300' : 'text-white'}
                          hover:bg-white/10
                        `}
                        onClick={e => {
                          e.stopPropagation();
                          updatePreference(pref.id, option.value);
                          setOpenId(null);
                        }}
                      >
                        {option.label}
                        {option.value === current && (
                          <span className='ml-2 text-yellow-300'>✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export type { TripPreferencesSlimProps };
