'use client';

import React from 'react';
import { Globe } from 'lucide-react';

/**
 * Privacy Tab Component - Placeholder
 *
 * User privacy settings and data controls
 */
export function PrivacyTab() {
  return (
    <div className='space-y-6'>
      {/* Page Description */}
      <div className='mb-8'>
        <p className='text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed'>
          Manage your privacy settings and control how your data is used.
        </p>
      </div>

      {/* Placeholder Content */}
      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <div
          className='
          w-16 h-16 mx-auto mb-4 rounded-full
          bg-green-100 dark:bg-green-900/30
          flex items-center justify-center
        '
        >
          <Globe className='w-8 h-8 text-green-600 dark:text-green-400' />
        </div>
        <h3 className='text-lg font-semibold text-neutral-900 dark:text-white mb-2'>
          Privacy Settings
        </h3>
        <p className='text-neutral-600 dark:text-neutral-400 text-sm max-w-md'>
          This section will contain privacy controls for data sharing, location tracking, trip
          history retention, and account visibility settings.
        </p>
      </div>
    </div>
  );
}
