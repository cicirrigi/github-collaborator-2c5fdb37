'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { BarChart3, Truck, Users } from 'lucide-react';
import { FleetPriceEstimate } from './components/FleetPriceEstimate';
import { StatCard } from './components/StatCard';
import { ValidationStatus } from './components/ValidationStatus';
import { VehicleBreakdownItem } from './components/VehicleBreakdownItem';

interface FleetSummaryCardProps {
  className?: string;
}

export function FleetSummaryCard({ className = '' }: FleetSummaryCardProps) {
  const { tripConfiguration, getFleetSummary, getFleetTotalPrice, validateFleetSelection } =
    useBookingState();

  const fleetSelection = tripConfiguration.fleetSelection;
  const passengers = tripConfiguration.passengers;
  const fleetSummary = getFleetSummary();
  const totalPrice = getFleetTotalPrice();
  const isValidSelection = validateFleetSelection();

  // Don't render if no vehicles selected
  if (fleetSelection.totalVehicles === 0) {
    return null;
  }

  // Fleet pricing is now handled dynamically based on fleet mode

  return (
    <section className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className='flex items-center gap-2'>
        <BarChart3 className='w-5 h-5 text-amber-400' />
        <h3 className='text-white font-medium text-lg'>Fleet Summary</h3>
      </div>

      {/* Summary Card */}
      <div
        className='p-5 rounded-xl backdrop-blur-sm'
        style={{
          backgroundColor: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(16px)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 4px 12px rgba(0,0,0,0.2)',
        }}
      >
        {/* Top Stats */}
        <div className='grid grid-cols-2 gap-4 mb-4'>
          <StatCard
            icon={Truck}
            label='Total Vehicles'
            value={fleetSelection.totalVehicles.toString()}
            subtext='Selected'
          />
          <StatCard
            icon={Users}
            label='Total Capacity'
            value={fleetSelection.totalCapacity.toString()}
            subtext='Passengers'
          />
        </div>

        {/* Vehicle Breakdown */}
        {Object.keys(fleetSummary.categories).length > 0 && (
          <div className='mb-4'>
            <div className='flex items-center justify-center gap-2 mb-3'>
              <BarChart3 className='w-3 h-3 text-amber-200/60' />
              <h4 className='text-amber-200/80 text-xs font-medium tracking-wider uppercase'>
                Vehicle Breakdown
              </h4>
            </div>
            <div className='w-full h-px bg-white/10 mb-3'></div>
            <div className='grid grid-cols-2 gap-3 relative'>
              {Object.entries(fleetSummary.categories).map(([categoryId, categoryData]) => (
                <VehicleBreakdownItem
                  key={categoryId}
                  categoryId={categoryId}
                  count={categoryData.count}
                  models={categoryData.models}
                />
              ))}
              {/* Single center separator */}
              <div className='absolute left-1/2 top-0 bottom-0 w-px bg-white/10 transform -translate-x-0.5'></div>
            </div>

            {/* Validation Status - moved under separator */}
            <div className='mt-3'>
              <ValidationStatus
                isValid={isValidSelection}
                totalCapacity={fleetSelection.totalCapacity}
                passengers={passengers}
              />
            </div>
          </div>
        )}

        {/* Price Estimate */}
        <FleetPriceEstimate totalPrice={totalPrice} fleetSelection={fleetSelection} />
      </div>
    </section>
  );
}
