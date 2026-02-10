'use client';

import React from 'react';
import { Volume2, Thermometer, MessageCircle } from 'lucide-react';

interface PreferenceOption {
  value: string;
  label: string;
}

interface TripPreference {
  id: 'music' | 'temperature' | 'communication';
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  options: PreferenceOption[];
}

const TRIP_PREFERENCES: TripPreference[] = [
  {
    id: 'music',
    title: 'Music Preference',
    icon: Volume2,
    options: [
      { value: 'no-preference', label: 'No Preference' },
      { value: 'classical', label: 'Classical' },
      { value: 'jazz', label: 'Jazz' },
      { value: 'pop', label: 'Pop' },
      { value: 'rock', label: 'Rock' },
      { value: 'silence', label: 'Prefer Silence' },
    ],
  },
  {
    id: 'temperature',
    title: 'Temperature Preference',
    icon: Thermometer,
    options: [
      { value: 'no-preference', label: 'No Preference' },
      { value: 'cool', label: 'Cool (18–20°C)' },
      { value: 'comfortable', label: 'Comfortable (21–23°C)' },
      { value: 'warm', label: 'Warm (24–26°C)' },
    ],
  },
  {
    id: 'communication',
    title: 'Communication Style',
    icon: MessageCircle,
    options: [
      { value: 'no-preference', label: 'No Preference' },
      { value: 'friendly', label: 'Friendly Chat' },
      { value: 'professional', label: 'Professional Only' },
      { value: 'minimal', label: 'Minimal' },
    ],
  },
];

export function TripExperienceSection() {
  const [preferences, setPreferences] = React.useState<Record<string, string>>({
    music: 'no-preference',
    temperature: 'comfortable',
    communication: 'professional',
  });

  const handlePreferenceChange = (preferenceId: string, value: string) => {
    setPreferences(prev => ({
      ...prev,
      [preferenceId]: value,
    }));
  };

  return (
    <section className='space-y-6'>
      {/* Section Header */}
      <div className='pb-4 border-b border-neutral-200 dark:border-neutral-700'>
        <h3 className='text-lg font-semibold text-neutral-900 dark:text-white'>Trip Experience</h3>
        <p className='text-sm text-neutral-600 dark:text-neutral-400 mt-1'>
          Set your preferred trip experience defaults
        </p>
      </div>

      {/* Trip Preferences Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {TRIP_PREFERENCES.map(preference => {
          const IconComponent = preference.icon;
          return (
            <div key={preference.id} className='space-y-3'>
              <label className='flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300'>
                <IconComponent className='w-4 h-4' />
                {preference.title}
              </label>
              <select
                value={preferences[preference.id] || 'no-preference'}
                onChange={e => handlePreferenceChange(preference.id, e.target.value)}
                className='
                  w-full px-3 py-2 text-sm
                  bg-white dark:bg-neutral-800
                  border border-neutral-300 dark:border-neutral-600
                  rounded-lg shadow-sm
                  text-neutral-900 dark:text-white
                  focus:ring-2 focus:ring-[var(--brand-primary)]/20
                  focus:border-[var(--brand-primary)]
                  transition-colors duration-200
                '
              >
                {preference.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      {/* Info Note */}
      <div
        className='
        mt-6 p-4 rounded-lg
        bg-blue-50 dark:bg-blue-950/30
        border border-blue-200 dark:border-blue-800
      '
      >
        <p className='text-sm text-blue-700 dark:text-blue-300'>
          <strong>Note:</strong> These preferences will be applied by default during booking but can
          be changed for individual trips as needed.
        </p>
      </div>
    </section>
  );
}
