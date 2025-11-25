'use client';

import { Music } from 'lucide-react';
import { useEffect, useState } from 'react';
import { TRIP_PREFERENCES, type TripPreference } from './service-config';

interface TripPreferencesCardV2Props {
  className?: string;
}

export function TripPreferencesCardV2({ className = '' }: TripPreferencesCardV2Props) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <div className={`relative ${className}`}>
      {/* 🎵 Luxury Black-Glass Card */}
      <div
        className='relative p-5 rounded-3xl transition-all duration-300 h-full'
        style={{
          background: 'linear-gradient(145deg, rgba(10,10,10,0.65), rgba(15,15,15,0.55))',
          border: '1px solid rgba(203,178,106,0.35)',
          backdropFilter: 'blur(22px)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 10px 40px rgba(0,0,0,0.55)',
        }}
      >
        {/* Header */}
        <div className='flex items-center gap-3 mb-5'>
          <div
            className='w-9 h-9 rounded-xl flex items-center justify-center shadow-lg'
            style={{
              background:
                'conic-gradient(from 210deg at 50% 50%, rgba(203,178,106,0.25), rgba(203,178,106,0.1), rgba(203,178,106,0.25))',
              boxShadow: '0 0 15px rgba(203,178,106,0.25)',
            }}
          >
            <Music className='w-5 h-5' style={{ color: '#CBB26A' }} />
          </div>

          <div>
            <h3 className='text-white font-semibold text-lg tracking-wide'>Trip Preferences</h3>
            <p className='text-amber-200/50 text-xs'>Personal comfort settings</p>
          </div>
        </div>

        {/* Preferences Vertical List */}
        <div className='space-y-3'>
          {TRIP_PREFERENCES.map(preference => (
            <PreferenceItem
              key={preference.id}
              preference={preference}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
            />
          ))}
        </div>

        {/* Footer */}
        <div className='text-center mt-5 pt-4 border-t border-white/10'>
          <p className='text-yellow-200/50 text-xs tracking-wide'>
            Customize your journey to your personal preferences
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────── */
/*                  Preference Item Component              */
/* ─────────────────────────────────────────────────────── */
interface PreferenceItemProps {
  preference: TripPreference;
  activeDropdown: string | null;
  setActiveDropdown: (id: string | null) => void;
}

function PreferenceItem({ preference, activeDropdown, setActiveDropdown }: PreferenceItemProps) {
  const [selectedValue, setSelectedValue] = useState<string | null>(null); // Local state for testing
  // const bookingStore = useBookingState(); // TODO: Use when integrating with Zustand
  // const { tripConfiguration } = bookingStore; // TODO: Use when integrating with Zustand
  const { icon: Icon, title, options } = preference;

  const showDropdown = activeDropdown === preference.id;

  // Add/remove click outside listener
  useEffect(() => {
    if (showDropdown) {
      // Close dropdown when clicking outside - defined inside useEffect
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.preference-dropdown')) {
          setActiveDropdown(null);
        }
      };

      // Use timeout to avoid immediate triggering
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 10);
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
    return undefined; // Explicit return for non-cleanup case
  }, [showDropdown, setActiveDropdown]);

  // 🔮 ZUSTAND INTEGRATION PLACEHOLDER - Trip preferences not implemented yet
  // const { tripPreferences } = tripConfiguration.servicePackages;

  // Get current selection - using local state until Zustand is implemented
  const currentValue = selectedValue; // TODO: Replace with tripPreferences[preference.id] when implemented
  const currentOption = options.find(opt => opt.value === currentValue);

  const handleOptionSelect = (optionValue: string) => {
    const newValue = optionValue === 'no-preference' ? null : optionValue;

    // Update local state for testing
    setSelectedValue(newValue);

    // 🔮 ZUSTAND INTEGRATION PLACEHOLDER - Store actions not implemented yet
    if (preference.id === 'music') {
      // store.setMusicPreference(newValue);
      // TODO: Set music preference in Zustand store
    } else if (preference.id === 'temperature') {
      // store.setTemperaturePreference(newValue);
      // TODO: Set temperature preference in Zustand store
    } else if (preference.id === 'communication') {
      // store.setCommunicationPreference(newValue);
      // TODO: Set communication preference in Zustand store
    }

    setActiveDropdown(null);
  };

  return (
    <div className='relative group preference-dropdown'>
      {/* Preference Card */}
      <div
        className='p-3 rounded-xl backdrop-blur-sm transition-all duration-200 group-hover:shadow-lg cursor-pointer'
        style={{
          backgroundColor: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(16px)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 6px 20px rgba(0,0,0,0.25)',
        }}
        onClick={e => {
          e.stopPropagation();
          setActiveDropdown(showDropdown ? null : preference.id);
        }}
      >
        {/* Content - Horizontal Layout */}
        <div className='flex items-center gap-3'>
          {/* Icon Container */}
          <div
            className='w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110'
            style={{
              background: 'linear-gradient(145deg, rgba(35,35,35,0.85), rgba(12,12,12,0.95))',
              border: '1px solid rgba(203,178,106,0.25)',
              boxShadow: '0 0 12px rgba(203,178,106,0.15), inset 0 0 6px rgba(0,0,0,0.6)',
            }}
          >
            <Icon className='w-5 h-5' style={{ color: '#CBB26A' }} />
          </div>

          {/* Title & Selection */}
          <div className='flex-1'>
            <h4 className='text-white font-medium text-sm leading-tight tracking-wide'>{title}</h4>
            <p className='text-gray-300/60 text-xs mt-0.5'>
              {currentOption?.label || 'No preference set'}
            </p>
          </div>

          {/* No selection indicator on cards */}

          {/* Dropdown Arrow */}
          <div
            className='text-gray-400 transition-transform duration-200'
            style={{
              transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            ▼
          </div>
        </div>
      </div>

      {/* Dropdown Options */}
      {showDropdown && (
        <div className='absolute top-full left-0 right-0 mt-2 z-50 preference-dropdown'>
          <div
            className='py-2 rounded-xl shadow-2xl border'
            style={{
              background: 'rgba(15,15,15,0.95)',
              border: '1px solid rgba(203,178,106,0.35)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 25px 45px rgba(0,0,0,0.6), 0 0 25px rgba(203,178,106,0.25)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {options.map(option => (
              <button
                key={option.value}
                className={`w-full p-3 text-left text-sm transition-all duration-200 hover:bg-amber-400/15 hover:text-amber-200 cursor-pointer ${
                  option.value === currentValue
                    ? 'bg-amber-400/15 text-amber-400'
                    : 'bg-transparent text-white'
                }`}
                onClick={() => handleOptionSelect(option.value)}
              >
                {option.label}
                {option.value === currentValue && <span className='ml-2 text-amber-400'>✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export type { TripPreferencesCardV2Props };
