'use client';

import { Divider } from '@/components/ui/Divider';
import { useBookingState } from '@/hooks/useBookingState';
import { Plane, Route } from 'lucide-react';
import { CardHeader } from './CardHeader';

export function CardJourneyFlightCombo() {
  const { calculateEstimatedDistanceAndTime, tripConfiguration, setFlightNumberPickup } =
    useBookingState();
  const { distanceKm, durationMinutes, error } = calculateEstimatedDistanceAndTime();

  return (
    <div className='vl-card-flex' style={{ height: 'auto' }}>
      <div className='vl-card-inner'>
        {/* Journey Summary Section */}
        <div>
          <CardHeader icon={Route} title='Journey Summary' subtitle='Estimate based on route' />
          <div style={{ gap: 0 }}>
            <div
              className='text-center'
              style={{
                width: '100%',
                background: error ? 'rgba(239, 68, 68, 0.12)' : 'rgba(255, 255, 255, 0.12)',
                border: error
                  ? '1px solid rgba(239, 68, 68, 0.25)'
                  : '1px solid rgba(255, 255, 255, 0.18)',
                borderRadius: '10px',
                padding: '10px 14px',
                color: error ? '#fca5a5' : 'white',
                boxSizing: 'border-box',
              }}
            >
              {error ? (
                <span className='font-medium'>{error}</span>
              ) : (
                <>
                  <span className='font-semibold'>{distanceKm} km</span> •{' '}
                  <span className='font-semibold'>{durationMinutes} min</span>
                </>
              )}
            </div>
          </div>
        </div>

        <Divider />

        {/* Flight Number Section */}
        <div>
          <CardHeader icon={Plane} title='Flight Number' subtitle='Optional for airport pickups' />
          <div>
            <input
              type='text'
              placeholder='ex: EZY543 ▸ Heathrow T5'
              value={tripConfiguration.flightNumberPickup}
              onChange={e => setFlightNumberPickup(e.target.value)}
              className='vl-input'
              style={{ height: 'auto' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
