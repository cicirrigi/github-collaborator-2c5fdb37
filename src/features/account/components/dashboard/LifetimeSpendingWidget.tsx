/**
 * 💰 LifetimeSpendingWidget - Display lifetime spending with car background
 *
 * Wider stat widget showing total spending with S-Class car image
 */

'use client';

import { useDashboard } from '../../hooks/useDashboard';
import { DashboardWidget } from './DashboardWidget';

export function LifetimeSpendingWidget() {
  const { dashboard, loading } = useDashboard();

  if (loading) {
    return (
      <DashboardWidget className='h-[180px]'>
        <div className='animate-pulse h-full flex items-center justify-center'>
          <div className='text-white/50'>Loading...</div>
        </div>
      </DashboardWidget>
    );
  }

  const totalSpent = dashboard?.total_spent_pounds || 0;

  return (
    <DashboardWidget className='h-[180px] relative overflow-hidden'>
      {/* Background Car Image - Optional for now */}
      <div className='absolute inset-0 opacity-20'>
        <div className='absolute right-0 bottom-0 w-2/3 h-full bg-gradient-to-l from-white/5 to-transparent' />
      </div>

      {/* Content */}
      <div className='relative flex flex-col h-full pt-4'>
        {/* Label */}
        <p className='text-white/70 text-xs md:text-sm font-medium text-center mb-3'>
          Lifetime Spending
        </p>

        {/* Large Currency */}
        <div className='flex-1 flex items-center justify-center'>
          <h2 className='text-3xl md:text-4xl font-bold text-white'>
            £{totalSpent.toLocaleString()}
          </h2>
        </div>

        {/* Class Badges */}
        <div className='flex justify-center gap-2 pb-4'>
          <span className='text-xs text-white/50 bg-white/10 px-2 py-1 rounded'>S-Class</span>
        </div>
      </div>
    </DashboardWidget>
  );
}
