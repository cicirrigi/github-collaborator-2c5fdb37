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
    <div ref={containerRef} className={`block w-full ${className}`}>
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
        {/* Header */}
        <div className='flex items-center gap-3 mb-5'>
          <div
            className='w-9 h-9 rounded-xl flex items-center justify-center shadow-lg'
            style={{
              background:
                'conic-gradient(from 210deg at 50% 50%, rgba(203,178,106,0.25), rgba(203,178,106,0.1), rgba(203,178,106,0.25))',
              boxShadow: '0 0 12px rgba(203,178,106,0.15)',
            }}
          >
            {(() => {
              const IconComponent = TRIP_PREFERENCES[0]?.icon;
              return IconComponent ? (
                <IconComponent className='w-5 h-5' style={{ color: '#CBB26A' }} />
              ) : null;
            })()}
          </div>

          <div>
            <h3 className='text-white font-semibold text-lg tracking-wide'>Comfort Preferences</h3>
            <p className='text-white text-xs'>Select your personal ride setting</p>
          </div>
        </div>

        {/* Preferences Column - Vertical Stack */}
        <div className='flex flex-col gap-2'>
          {TRIP_PREFERENCES.map(pref => {
            const current = preferences[pref.id];
            const selectedLabel = pref.options.find(o => o.value === current)?.label || pref.title;

            return (
              <div key={pref.id} className='relative'>
                <button
                  className='
                    w-full px-3 py-2 flex items-center justify-between gap-2
                    rounded-lg border border-white/10
                    bg-white/5 backdrop-blur-sm
                    hover:bg-white/10 hover:border-white/20
                    transition-all duration-150
                    text-white text-sm
                  '
                  onClick={e => {
                    e.stopPropagation();
                    setOpenId(openId === pref.id ? null : pref.id);
                  }}
                >
                  <div className='flex items-center gap-2'>
                    <pref.icon className='w-4 h-4 text-amber-300' />
                    <span>{selectedLabel}</span>
                  </div>
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
