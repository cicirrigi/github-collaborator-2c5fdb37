/**
 * 📭 Dashboard Empty State
 *
 * Placeholder for dashboard content
 * Will be replaced with actual dashboard design later
 */

'use client';

import { LayoutDashboard } from 'lucide-react';

export function DashboardEmptyState() {
  return (
    <div className='min-h-[calc(100vh-8rem)] flex items-center justify-center p-6'>
      <div className='max-w-md w-full'>
        <div className='bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-8 text-center border border-neutral-200 dark:border-neutral-700'>
          {/* Icon */}
          <div className='w-16 h-16 mx-auto mb-4 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center'>
            <LayoutDashboard className='w-8 h-8 text-amber-600 dark:text-amber-400' />
          </div>

          {/* Title */}
          <h2 className='text-2xl font-bold text-neutral-900 dark:text-white mb-2'>
            Dashboard Coming Soon
          </h2>

          {/* Description */}
          <p className='text-neutral-600 dark:text-neutral-400 mb-6'>
            The new luxury dashboard design is under construction. Use the sidebar to navigate to
            other sections.
          </p>

          {/* Info Badge */}
          <div className='inline-flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800'>
            <span className='text-sm font-medium text-amber-900 dark:text-amber-400'>
              ✨ Sidebar navigation is ready to use
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
