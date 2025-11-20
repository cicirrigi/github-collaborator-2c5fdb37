'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRightLeft } from 'lucide-react';
import { usePickupDropoffLogic } from '../hooks/usePickupDropoffLogic';

const Divider = () => <div className='border-t border-white/10'></div>;

export function ReturnHintSection() {
  const { bookingType } = usePickupDropoffLogic();
  const { calculateEstimatedDistanceAndTime, tripConfiguration } = useBookingState();
  const { distanceKm, durationMinutes } = calculateEstimatedDistanceAndTime();

  const { pickup, dropoff } = tripConfiguration;

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
            <div className='vl-return-box'>
              {pickup && dropoff ? (
                <div className='flex items-center gap-2 text-xs'>
                  <ArrowRightLeft className='w-3 h-3' />
                  <span>
                    Return: {dropoff.address} → {pickup.address}
                  </span>
                </div>
              ) : (
                <span className='text-xs'>Return trip auto-configured</span>
              )}
            </div>
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
