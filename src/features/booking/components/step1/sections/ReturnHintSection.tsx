'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { AnimatePresence, motion } from 'framer-motion';
import { usePickupDropoffLogic } from '../hooks/usePickupDropoffLogic';

const Divider = () => <div className='border-t border-white/10'></div>;

export function ReturnHintSection() {
  const { bookingType } = usePickupDropoffLogic();
  const { calculateEstimatedDistanceAndTime } = useBookingState();
  const { distanceKm, durationMinutes } = calculateEstimatedDistanceAndTime();

  return (
    <>
      {/* RETURN TRIP PLACEHOLDER */}
      <AnimatePresence>
        {bookingType === 'return' && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            <Divider />
            <div className='vl-return-box'>Return trip auto-configured</div>
          </motion.div>
        )}
      </AnimatePresence>

      <Divider />
      <div className='vl-hint-row'>
        <span>Journey:</span>
        <span className='vl-hint-value'>
          {distanceKm} km • {durationMinutes} min
        </span>
      </div>
    </>
  );
}
