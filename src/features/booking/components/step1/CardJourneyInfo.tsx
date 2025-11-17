'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { motion } from 'framer-motion';
import { Route } from 'lucide-react';
import { CardHeader } from './CardHeader';

export function CardJourneyInfo() {
  const { calculateEstimatedDistanceAndTime } = useBookingState();
  const { distanceKm, durationMinutes } = calculateEstimatedDistanceAndTime();

  return (
    <motion.div
      key={`${distanceKm}-${durationMinutes}`}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className='vl-card-flex'
    >
      <CardHeader icon={Route} title='Journey Summary' subtitle='Estimate based on route' />
      <div className='vl-card-inner'>
        <p className='text-white'>
          <span className='font-semibold'>{distanceKm} km</span> •{' '}
          <span className='font-semibold'>{durationMinutes} min</span>
        </p>
        <p className='text-white/50 text-sm'>Traffic: Conditional</p>
      </div>
    </motion.div>
  );
}
