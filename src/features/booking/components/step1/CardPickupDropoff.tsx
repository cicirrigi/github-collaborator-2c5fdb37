'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { AnimatePresence, motion } from 'framer-motion';
import { Flag, MapPin } from 'lucide-react';
import { CardHeader } from './CardHeader';

export function CardPickupDropoff() {
  const { bookingType, tripConfiguration, setPickup, setDropoff } = useBookingState();

  // Bridge values pentru compatibility
  const pickup = tripConfiguration.pickup?.address || '';
  const dropoff = tripConfiguration.dropoff?.address || '';

  // Bridge functions pentru string → LocationData conversion
  const handlePickupChange = (value: string) => {
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
    <div className='vl-card-flex'>
      <CardHeader
        icon={MapPin}
        title='Trip Locations'
        subtitle='Configure pickup and destination'
      />

      <div className='vl-card-inner'>
        {/* PICKUP LOCATION */}
        <div className='space-y-3'>
          <div className='flex items-center gap-2'>
            <div className='p-1.5 bg-green-500/10 rounded-lg'>
              <MapPin className='w-4 h-4 text-green-400' />
            </div>
            <span className='text-white font-medium text-sm'>Pickup Location</span>
          </div>
          <input
            type='text'
            value={pickup}
            onChange={e => handlePickupChange(e.target.value)}
            placeholder='Enter pickup address...'
            className='vl-input focus:ring-green-400/50 focus:border-green-400/50'
          />
        </div>

        {/* DROPOFF LOCATION - Conditional based on booking type */}
        {bookingType !== 'hourly' && (
          <>
            <div className='border-t border-white/10'></div>
            <div className='space-y-3'>
              <div className='flex items-center gap-2'>
                <div className='p-1.5 bg-red-500/10 rounded-lg'>
                  <Flag className='w-4 h-4 text-red-400' />
                </div>
                <span className='text-white font-medium text-sm'>Destination</span>
              </div>
              <input
                type='text'
                value={dropoff}
                onChange={e => handleDropoffChange(e.target.value)}
                placeholder='Enter destination address...'
                className='vl-input focus:ring-red-400/50 focus:border-red-400/50'
              />
            </div>
          </>
        )}

        {/* RETURN TRIP PLACEHOLDER */}
        <AnimatePresence>
          {bookingType === 'return' && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              <div className='border-t border-white/10 pt-5'>
                <div className='p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl text-center'>
                  <p className='text-blue-300 text-sm font-medium'>Return Trip</p>
                  <p className='text-blue-300/60 text-xs mt-1'>
                    Return fields will be configured automatically
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BOOKING TYPE HINT */}
        <div className='pt-3 border-t border-white/10'>
          <div className='flex items-center justify-between text-xs'>
            <span className='text-white/50'>Trip Type:</span>
            <span className='text-[var(--brand-primary,#f5d469)] capitalize font-medium'>
              {bookingType}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
