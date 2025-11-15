'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CornerDownRight, Flag, MapPin } from 'lucide-react';
import { useBookingStore } from '../store/booking.store';
import { PillInput } from './PillInput';

export function PickupDropoffSection() {
  const {
    tripType,
    pickup,
    dropoff,
    returnPickup,
    returnDropoff,
    setPickup,
    setDropoff,
    setReturnPickup,
    setReturnDropoff,
  } = useBookingStore();

  return (
    <div className='space-y-5'>
      {/* Pickup */}
      <PillInput
        value={pickup}
        onChange={setPickup}
        placeholder='Pickup Location'
        icon={<MapPin className='h-5 w-5' />}
      />

      {/* Dropoff — hide if hourly */}
      {tripType !== 'hourly' && (
        <PillInput
          value={dropoff}
          onChange={setDropoff}
          placeholder='Dropoff Location'
          icon={<Flag className='h-5 w-5' />}
        />
      )}

      {/* Return Trip */}
      <AnimatePresence>
        {tripType === 'return' && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className='space-y-5'
          >
            <PillInput
              value={returnPickup}
              onChange={setReturnPickup}
              placeholder='Return Pickup'
              icon={<CornerDownRight className='h-5 w-5' />}
            />

            <PillInput
              value={returnDropoff}
              onChange={setReturnDropoff}
              placeholder='Return Dropoff'
              icon={<CornerDownRight className='h-5 w-5' />}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
