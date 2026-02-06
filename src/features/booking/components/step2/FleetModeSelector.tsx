'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { Car, Clock, Minus, Plus, Users } from 'lucide-react';

interface FleetModeSelectorProps {
  className?: string;
}

export function FleetModeSelector({ className = '' }: FleetModeSelectorProps) {
  const { tripConfiguration, setFleetMode, setFleetHours, setFleetDays } = useBookingState();

  const fleetSelection = tripConfiguration.fleetSelection;

  return (
    <div className={`py-4 ${className}`}>
      {/* Centered Toggle Pills */}
      <div className='flex items-center justify-center mb-3'>
        <div className='flex items-center bg-white/5 rounded-full p-1 border border-white/10'>
          {[
            { mode: 'standard' as const, label: 'Transfer', icon: Car },
            { mode: 'hourly' as const, label: 'Hourly', icon: Clock },
            { mode: 'daily' as const, label: 'Daily', icon: Users },
          ].map(({ mode, label, icon: Icon }) => (
            <button
              key={mode}
              onClick={() => setFleetMode(mode)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all ${
                fleetSelection.fleetMode === mode
                  ? 'bg-amber-200/20 text-white shadow-sm'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              <Icon className='w-4 h-4' />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Thin Separator */}
      <div className='w-full h-px bg-white/5 mb-3'></div>

      {/* Time Selectors - Fully Centered */}
      {fleetSelection.fleetMode === 'hourly' && (
        <div className='flex flex-col items-center gap-2 mb-3'>
          <span className='text-white/50 text-sm'>Hours:</span>
          <div className='flex items-center gap-2 bg-white/5 rounded-full px-3 py-1.5 border border-white/10'>
            <button
              onClick={() => setFleetHours(Math.max(2, (fleetSelection.fleetHours || 2) - 1))}
              className='w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors'
            >
              <Minus className='w-3 h-3 text-white/70' />
            </button>
            <span className='text-white text-sm font-medium min-w-[2rem] text-center'>
              {fleetSelection.fleetHours || 2}h
            </span>
            <button
              onClick={() => setFleetHours(Math.min(10, (fleetSelection.fleetHours || 2) + 1))}
              className='w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors'
            >
              <Plus className='w-3 h-3 text-white/70' />
            </button>
          </div>
        </div>
      )}

      {fleetSelection.fleetMode === 'daily' && (
        <div className='flex flex-col items-center gap-2 mb-3'>
          <span className='text-white/50 text-sm'>Days:</span>
          <div className='flex items-center gap-2 bg-white/5 rounded-full px-3 py-1.5 border border-white/10'>
            <button
              onClick={() => setFleetDays(Math.max(1, (fleetSelection.fleetDays || 1) - 1))}
              className='w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors'
            >
              <Minus className='w-3 h-3 text-white/70' />
            </button>
            <span className='text-white text-sm font-medium min-w-[2rem] text-center'>
              {fleetSelection.fleetDays || 1}d
            </span>
            <button
              onClick={() => setFleetDays((fleetSelection.fleetDays || 1) + 1)}
              className='w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors'
            >
              <Plus className='w-3 h-3 text-white/70' />
            </button>
          </div>
        </div>
      )}

      {/* Centered Description */}
      <div className='text-center'>
        <p className='text-white/50 text-xs'>
          {fleetSelection.fleetMode === 'standard' && 'Single transfer with multiple vehicles'}
          {fleetSelection.fleetMode === 'hourly' &&
            `Fleet service for ${fleetSelection.fleetHours || 2} hours`}
          {fleetSelection.fleetMode === 'daily' &&
            `Fleet service for ${fleetSelection.fleetDays || 1} day${(fleetSelection.fleetDays || 1) > 1 ? 's' : ''}`}
        </p>
      </div>
    </div>
  );
}
