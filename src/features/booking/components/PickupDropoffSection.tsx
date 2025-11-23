'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { AnimatePresence, motion } from 'framer-motion';
import { Flag, MapPin } from 'lucide-react';
import { PillInput } from './PillInput';

export function PickupDropoffSection() {
  const { bookingType, tripConfiguration, setPickup, setDropoff } = useBookingState();

  // Bridge values pentru compatibility cu PillInput (string-based)
  const pickup = tripConfiguration.pickup?.address || '';
  const dropoff = tripConfiguration.dropoff?.address || '';

  // Bridge functions pentru string → LocationData conversion
  const handlePickupChange = (value: string) => {
    // Pentru acum, creez un LocationData simplu cu address
    const locationData = value
      ? {
          placeId: `temp-${Date.now()}`,
          address: value,
          coordinates: [0, 0] as [number, number],
          type: 'address' as const,
          components: {},
        }
      : null;
    setPickup(locationData);
  };

  const handleDropoffChange = (value: string) => {
    const locationData = value
      ? {
          placeId: `temp-${Date.now()}`,
          address: value,
          coordinates: [0, 0] as [number, number],
          type: 'address' as const,
          components: {},
        }
      : null;
    setDropoff(locationData);
  };

  return (
    <div className='space-y-5'>
      {/* Pickup */}
      <PillInput
        value={pickup}
        onChange={handlePickupChange}
        placeholder='Pickup Location'
        icon={<MapPin className='h-5 w-5' />}
      />

      {/* Dropoff — hide if hourly */}
      {bookingType !== 'hourly' && (
        <PillInput
          value={dropoff}
          onChange={handleDropoffChange}
          placeholder='Dropoff Location'
          icon={<Flag className='h-5 w-5' />}
        />
      )}

      {/* Return Trip - Placeholder pentru acum */}
      <AnimatePresence>
        {bookingType === 'return' && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className='space-y-5'
          >
            <div className='p-4 bg-white/5 rounded-2xl border border-white/10 text-center text-white/50'>
              Return trip fields - Coming soon...
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
