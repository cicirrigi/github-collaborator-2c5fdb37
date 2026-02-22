'use client';

import React from 'react';
import { Bell } from 'lucide-react';

/**
 * Notifications Tab Component - Placeholder
 *
 * User notification preferences (to be implemented later)
 */
export function NotificationsTab() {
  return (
    <div className='space-y-6'>
      {/* Page Description */}
      <div className='mb-8'>
        <p className='text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed'>
          Configure your notification preferences for email, SMS, and other alerts.
        </p>
      </div>

      {/* Placeholder Content */}
      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <div
          className='
          w-16 h-16 mx-auto mb-4 rounded-full
          bg-blue-100 dark:bg-blue-900/30
          flex items-center justify-center
        '
        >
          <Bell className='w-8 h-8 text-blue-600 dark:text-blue-400' />
        </div>
        <h3 className='text-lg font-semibold text-neutral-900 dark:text-white mb-2'>
          Notifications Settings
        </h3>
        <p className='text-neutral-600 dark:text-neutral-400 text-sm max-w-md'>
          This section will contain notification preferences for booking confirmations, trip
          updates, payment receipts, and marketing communications.
        </p>
      </div>
    </div>
  );
}
