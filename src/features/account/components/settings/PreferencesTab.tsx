'use client';

import React from 'react';
import { BookingDefaultsSection } from './preferences/BookingDefaultsSection';
import { TripExperienceSection } from './preferences/TripExperienceSection';
import { VehiclePreferencesSection } from './preferences/VehiclePreferencesSection';

/**
 * Preferences Tab Component
 *
 * User trip preferences and booking defaults
 * - Default booking type and vehicle category
 * - Favorite vehicles per category
 * - Trip experience preferences (music, temperature, communication)
 */
export function PreferencesTab() {
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      // TODO: Collect and save preferences from child components
      console.log('Saving preferences...');

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success feedback
      alert('Preferences saved successfully!');
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Failed to save preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all preferences to defaults?')) {
      // TODO: Reset all preferences to default values
      console.log('Resetting preferences to defaults...');
      alert('Preferences reset to defaults!');
    }
  };

  return (
    <div className='space-y-6'>
      {/* Page Description */}
      <div className='mb-8'>
        <p className='text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed'>
          Set your default preferences for booking trips. These settings will pre-populate the
          booking form but can be changed during booking.
        </p>
      </div>

      {/* Booking Defaults */}
      <BookingDefaultsSection />

      {/* Vehicle Preferences */}
      <VehiclePreferencesSection />

      {/* Trip Experience */}
      <TripExperienceSection />

      {/* Save Changes Footer */}
      <div className='pt-6 border-t border-neutral-200 dark:border-neutral-700'>
        <div className='flex flex-col sm:flex-row gap-3 sm:justify-end'>
          <button
            type='button'
            onClick={handleResetToDefaults}
            className='
              px-4 py-2 text-sm font-medium
              bg-neutral-100 text-neutral-700
              dark:bg-neutral-800 dark:text-neutral-300
              border border-neutral-300 dark:border-neutral-600
              rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700
              transition-colors duration-200
              order-2 sm:order-1
            '
          >
            Reset to Defaults
          </button>
          <button
            type='button'
            onClick={handleSaveChanges}
            disabled={isSaving}
            className='
              px-6 py-2 text-sm font-medium
              bg-[var(--brand-primary)] text-white
              rounded-lg hover:bg-[var(--brand-primary)]/90
              transition-colors duration-200
              order-1 sm:order-2
              disabled:opacity-50 disabled:cursor-not-allowed
            '
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
