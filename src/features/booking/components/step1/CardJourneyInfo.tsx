'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { Route } from 'lucide-react';
import { CardHeader } from './CardHeader';

export function CardJourneyInfo() {
  const { calculateEstimatedDistanceAndTime } = useBookingState();
  const { distanceKm, durationMinutes } = calculateEstimatedDistanceAndTime();

  return (
    <div className='vl-card-flex' style={{ height: 'auto' }}>
      <CardHeader icon={Route} title='Journey Summary' subtitle='Estimate based on route' />
      <div className='vl-card-inner' style={{ gap: 0 }}>
        <div
          className='text-center'
          style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            borderRadius: '10px',
            padding: '10px 14px',
            color: 'white',
            boxSizing: 'border-box',
          }}
        >
          <span className='font-semibold'>{distanceKm} km</span> •{' '}
          <span className='font-semibold'>{durationMinutes} min</span>
        </div>
      </div>
    </div>
  );
}
