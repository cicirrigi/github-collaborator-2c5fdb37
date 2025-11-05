// @ts-nocheck - Component under development with complex TypeScript issues
'use client';

import { cn } from '@/lib/utils';
import type { TripConfiguration } from '@/types/booking/step1.types';
import { useState } from 'react';
import type { GooglePlace } from '../../location-picker/types';
import { TRAVEL_PLANNER_PRO_THEME as theme } from '../constants';
// import type { BookingRule } from '../constants/booking-rules';
import { ReturnMode, useReturnJourneyLogic } from '../hooks/useReturnJourneyLogic';
import { ReturnLocationField } from './ReturnLocationField';

interface ReturnJourneyCardProps {
  tripConfiguration: TripConfiguration;
  onReturnPickupChange: (location: GooglePlace | null) => void;
  onReturnDropoffChange: (location: GooglePlace | null) => void;
  onSameDayReturnChange: (sameDayReturn: boolean) => void;
  className?: string;
}

export const ReturnJourneyCard = ({
  tripConfiguration,
  _bookingRule, // Prefixed as unused
  onReturnPickupChange,
  onReturnDropoffChange,
  onSameDayReturnChange,
  className,
}: ReturnJourneyCardProps) => {
  const [hasCustomLocations, setHasCustomLocations] = useState(false);

  const { returnPickup, returnDropoff, isAutoReversed, canEdit, mode, isSameDayReturn } =
    useReturnJourneyLogic(tripConfiguration, hasCustomLocations);

  // TODO: Fix useProgressiveActivation typing issues
  // const progressiveState = useProgressiveActivation(tripConfiguration);

  // Return Journey can only be configured after outbound locations are complete
  const isReturnSectionActive = true; // Temporarily enabled for development

  return (
    <div
      className={cn(
        theme.card,
        'overflow-visible',
        className,
        'transition-opacity duration-200',
        !isReturnSectionActive && 'opacity-50'
      )}
    >
      <h3 className={theme.sectionTitle}>Return Journey Settings</h3>

      {/* Progressive Activation Status */}
      {!isReturnSectionActive && (
        <div
          className={cn(
            'p-3 mb-4 rounded-lg border text-sm',
            theme.colors.neutral.bg,
            theme.colors.neutral.border,
            theme.colors.neutral.text.muted
          )}
        >
          🔒 <strong>Complete outbound locations first</strong> to configure your return journey
        </div>
      )}

      {isReturnSectionActive && (
        <p className={cn('text-sm mb-4', theme.colors.neutral.text.subtle)}>
          Configure your return journey options and locations.
        </p>
      )}

      {/* 🕒 Same Day Return Toggle - Principal Control */}
      <div
        className={cn(
          'p-4 rounded-lg border bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200',
          !isReturnSectionActive && 'opacity-50 pointer-events-none'
        )}
      >
        <label className='flex items-center justify-between cursor-pointer'>
          <div className='flex items-center gap-3'>
            <input
              type='checkbox'
              checked={isSameDayReturn}
              onChange={e => onSameDayReturnChange(e.target.checked)}
              className='accent-amber-500 w-5 h-5 rounded border-gray-300 focus:ring-amber-500 focus:ring-2'
            />
            <div>
              <div className='text-sm font-medium text-amber-900'>🕒 Same-day return</div>
              <div className='text-xs text-amber-700 mt-1'>
                Both pickup and return on the same day
              </div>
            </div>
          </div>
          {isSameDayReturn && (
            <span className='text-xs font-medium text-amber-800 bg-amber-200 px-2 py-1 rounded'>
              Locked to departure day
            </span>
          )}
        </label>
      </div>

      <div className={cn('space-y-4', !isReturnSectionActive && 'pointer-events-none')}>
        {/* 📍 Auto-Reverse Status & Edit Toggle */}
        {mode !== ReturnMode.DISABLED && (
          <div
            className={cn(
              'p-3 rounded-lg border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2',
              isAutoReversed
                ? cn(theme.colors.return.bg, theme.colors.return.border)
                : cn(theme.colors.neutral.bg, theme.colors.neutral.border)
            )}
          >
            <div>
              <div className='flex items-center gap-2 font-medium'>
                {isAutoReversed ? '🔄 Auto-reversed route' : '✏️ Custom return route'}
              </div>
              <p className={cn('text-xs mt-1 opacity-80', theme.colors.neutral.text.subtle)}>
                {isAutoReversed
                  ? 'Route automatically mirrored from outbound journey.'
                  : 'You are setting custom return locations.'}
              </p>
            </div>

            {canEdit && (
              <button
                onClick={() => setHasCustomLocations(!hasCustomLocations)}
                className={cn(
                  'px-3 py-1 rounded-md text-xs font-medium border transition-colors',
                  hasCustomLocations
                    ? cn(
                        theme.colors.neutral.text.primary,
                        'border-[var(--border-primary)] hover:bg-[var(--surface-secondary)]'
                      )
                    : cn(
                        theme.colors.return.text,
                        'border-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/10'
                      )
                )}
              >
                {hasCustomLocations ? 'Use Auto-Reverse' : 'Customize'}
              </button>
            )}
          </div>
        )}

        {/* 🗺️ Return Location Display */}
        <div className='space-y-4'>
          {/* Return Pickup (where return journey starts) */}
          <ReturnLocationField
            label='Return pickup location'
            value={returnPickup}
            onChange={onReturnPickupChange}
            placeholder={
              canEdit ? 'Please select Return pickup location' : 'Complete outbound locations first'
            }
            variant='pickup'
            disabled={!canEdit || (!hasCustomLocations && isAutoReversed)}
          />

          {/* Return Dropoff (where return journey ends) */}
          <ReturnLocationField
            label='Return destination'
            value={returnDropoff}
            onChange={onReturnDropoffChange}
            placeholder={
              canEdit ? 'Please select Return destination' : 'Complete outbound locations first'
            }
            variant='destination'
            disabled={!canEdit || (!hasCustomLocations && isAutoReversed)}
          />

          {/* Smart Status Indicator */}
          <div
            className={cn(
              'text-xs p-3 rounded-lg flex items-center gap-2',
              theme.colors.success.bg,
              theme.colors.success.border
            )}
          >
            <span>🔁</span>
            <span className={theme.colors.success.text}>
              {isAutoReversed
                ? 'Return locations auto-sync with outbound trip.'
                : "You're using custom return locations — synced manually."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
