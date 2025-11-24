'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { AlertCircle, BarChart3, Car, CheckCircle, Crown, Truck, Users } from 'lucide-react';
import React from 'react';

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
        <div className='pt-4 border-t border-white/10'>
          <div className='flex items-center justify-between'>
            <span className='text-white/70 text-sm'>Estimated Total</span>
            <div className='text-right'>
              <div className='text-white font-medium'>£{Math.round(totalPrice)}</div>
              <div className='text-white/50 text-xs'>
                {fleetSelection.fleetMode === 'standard'
                  ? 'per transfer'
                  : fleetSelection.fleetMode === 'hourly'
                    ? `for ${fleetSelection.fleetHours || 2}h`
                    : `for ${fleetSelection.fleetDays || 1} day${(fleetSelection.fleetDays || 1) > 1 ? 's' : ''}`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 📊 Reusable Stat Card Component
interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  subtext: string;
}

function StatCard({ icon: Icon, label, value, subtext }: StatCardProps) {
  return (
    <div
      className='p-3 rounded-lg'
      style={{
        backgroundColor: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className='flex items-center gap-3'>
        <div
          className='w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0'
          style={{
            backgroundColor: 'rgba(60,60,60,0.8)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        >
          <Icon className='w-5 h-5 text-amber-400' />
        </div>
        <div className='flex-1 min-w-0'>
          <div className='text-white font-medium text-lg'>{value}</div>
          <div className='text-white/60 text-xs'>{label}</div>
          <div className='text-white/40 text-xs'>{subtext}</div>
        </div>
      </div>
    </div>
  );
}

// 🚗 Vehicle Breakdown Item
interface VehicleBreakdownItemProps {
  categoryId: string;
  count: number;
  models: Record<string, number>;
}

function VehicleBreakdownItem({ categoryId, count, models }: VehicleBreakdownItemProps) {
  const categoryName =
    categoryId === 'luxury'
      ? 'First Class'
      : categoryId.charAt(0).toUpperCase() + categoryId.slice(1);

  // Vehicle category icons
  const getVehicleIcon = (category: string) => {
    switch (category) {
      case 'luxury':
        return Crown;
      case 'suv':
        return Truck;
      case 'mpv':
        return Users;
      default:
        return Car;
    }
  };

  const VehicleIcon = getVehicleIcon(categoryId);

  return (
    <div className='flex flex-col items-center py-3 text-center px-2'>
      <div className='flex items-center gap-1.5 mb-1'>
        <VehicleIcon className='w-3.5 h-3.5 text-amber-200/70' />
        <span className='text-white text-sm font-medium'>
          {count}x {categoryName}
        </span>
      </div>
      <div className='text-white/50 text-xs'>
        {Object.entries(models).map(([modelName, modelCount], index) => (
          <span key={modelName}>
            {index > 0 && ', '}
            {modelCount}x {modelName}
          </span>
        ))}
      </div>
    </div>
  );
}

// ✅ Validation Status Component
interface ValidationStatusProps {
  isValid: boolean;
  totalCapacity: number;
  passengers: number;
}

function ValidationStatus({ isValid, totalCapacity, passengers }: ValidationStatusProps) {
  if (isValid) {
    return (
      <div className='flex items-center gap-2 text-green-400 text-sm'>
        <CheckCircle className='w-4 h-4' />
        <span>Fleet capacity sufficient for {passengers} passengers</span>
      </div>
    );
  }

  return (
    <div className='flex items-center gap-2 text-amber-400 text-sm'>
      <AlertCircle className='w-4 h-4' />
      <span>
        Need {passengers - totalCapacity} more passenger capacity ({totalCapacity}/{passengers})
      </span>
    </div>
  );
}
