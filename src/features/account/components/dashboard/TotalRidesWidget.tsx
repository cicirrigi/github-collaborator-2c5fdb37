/**
 * 📊 TotalRidesWidget - Display total rides count
 *
 * Compact stat widget showing total completed rides
 */

'use client';

import { useDashboard } from '../../hooks/useDashboard';
import { DashboardWidget } from './DashboardWidget';

export function TotalRidesWidget() {
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

  const totalRides = dashboard?.total_bookings || 0;

  return (
    <DashboardWidget className='h-[180px]'>
      <div className='flex flex-col h-full pt-4'>
        {/* Label */}
        <p className='text-white/70 text-xs md:text-sm font-medium text-center mb-3'>Total Rides</p>

        {/* Large Number */}
        <div className='flex-1 flex items-center justify-center'>
          <h2 className='text-4xl md:text-5xl font-bold text-white'>{totalRides}</h2>
        </div>

        {/* Subtitle */}
        <p className='text-white/50 text-xs text-center pb-4'>Total Rides</p>
      </div>
    </DashboardWidget>
  );
}
