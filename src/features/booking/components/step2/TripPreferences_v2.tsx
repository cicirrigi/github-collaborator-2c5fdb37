'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { ChevronDown, Volume2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { TRIP_PREFERENCES, type TripPreference } from './service-config';

interface TripPreferencesV2Props {
  className?: string;
}

export function TripPreferencesV2({ className = '' }: TripPreferencesV2Props) {
  const bookingStore = useBookingState();
  const { tripConfiguration } = bookingStore;

  // Get current preferences from Zustand store
  const preferences = tripConfiguration.servicePackages.tripPreferences;

  const handlePreferenceChange = (
    preferenceId: 'music' | 'temperature' | 'communication',
    value: string
  ) => {
    // Access store actions via typed store reference
    const store = bookingStore as typeof bookingStore & {
      setMusicPreference: (value: string) => void;
      setTemperaturePreference: (value: string) => void;
      setCommunicationStyle: (value: string) => void;
    };

    switch (preferenceId) {
      case 'music':
        store.setMusicPreference(value);
        break;
      case 'temperature':
        store.setTemperaturePreference(value);
        break;
      case 'communication':
        store.setCommunicationStyle(value);
        break;
    }
  };

  return (
    <section className={`space-y-4 ${className}`}>
      {/* 🎯 Compact Header */}
      <div className='flex items-center gap-2'>
        <Volume2 className='w-4 h-4 text-yellow-400' />
        <h3 className='text-white font-medium text-base'>Trip Preferences</h3>
        <div className='px-2 py-1 rounded text-xs bg-blue-400/20 text-blue-200'>Optional</div>
      </div>

      {/* 🎵 Preferences Grid */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {TRIP_PREFERENCES.map(preference => (
          <PreferenceDropdown
            key={preference.id}
            preference={preference}
            selectedValue={preferences[preference.id]}
            onValueChange={value => handlePreferenceChange(preference.id, value)}
          />
        ))}
      </div>
    </section>
  );
}

// 🎛️ Preference Dropdown Component
interface PreferenceDropdownProps {
  preference: TripPreference;
  selectedValue: string;
  onValueChange: (value: string) => void;
}

function PreferenceDropdown({ preference, selectedValue, onValueChange }: PreferenceDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { icon: Icon, title, options } = preference;

  const selectedOption = options.find(opt => opt.value === selectedValue);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }

    // Return undefined pentru code paths care nu returnează cleanup function
    return undefined;
  }, [isOpen]);

  return (
    <div className='relative z-50' style={{ overflow: 'visible' }} ref={dropdownRef}>
      {/* 🎨 Main Container */}
      <div
        className='p-4 rounded-xl backdrop-blur-sm transition-all duration-200 bg-white/5 border border-white/10 group-hover:shadow-lg group cursor-pointer'
        style={{
          backdropFilter: 'blur(16px)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 6px 20px rgba(0,0,0,0.25)',
        }}
      >
        {/* Header cu Icon & Title */}
        <div className='flex items-center gap-3 mb-3'>
          <div
            className='w-8 h-8 rounded-lg flex items-center justify-center'
            style={{
              backgroundColor: 'rgba(60,60,60,0.8)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            <Icon className='w-4 h-4' style={{ color: '#CBB26A' }} />
          </div>
          <h4 className='text-white font-medium text-sm'>{title}</h4>
        </div>

        {/* Custom Dropdown */}
        <div className='relative'>
          <button
            className={`w-full p-3 rounded-lg text-left flex items-center justify-between transition-all duration-200 hover:bg-white/10 border cursor-pointer ${
              isOpen ? 'bg-yellow-400/10 border-yellow-400/30' : 'bg-white/8 border-white/15'
            }`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className='text-white text-sm'>
              {selectedOption?.label || 'Select option...'}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-yellow-400 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown Options */}
          {isOpen && (
            <div
              className='absolute top-full left-0 right-0 mt-2 rounded-lg overflow-hidden'
              style={{
                zIndex: 9999,
                position: 'absolute',
                overflow: 'visible',
                backgroundColor: 'rgba(20,20,20,0.95)',
                border: '1px solid rgba(255,255,255,0.15)',
                backdropFilter: 'none',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              {options.map(option => (
                <button
                  key={option.value}
                  className={`w-full p-3 text-left text-sm transition-all duration-200 hover:bg-yellow-400/15 hover:text-yellow-200 first:rounded-t-lg last:rounded-b-lg cursor-pointer ${
                    option.value === selectedValue
                      ? 'bg-yellow-400/15 text-yellow-400'
                      : 'bg-transparent text-white'
                  }`}
                  onClick={() => {
                    onValueChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  {option.label}
                  {option.value === selectedValue && (
                    <span className='ml-2 text-yellow-400'>✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 🔧 Export
export type { TripPreferencesV2Props };
