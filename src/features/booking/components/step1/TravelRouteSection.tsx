'use client';

import { GlassmorphismCard } from '@/components/ui/GlassmorphismCard';
import { useBookingState } from '@/hooks/useBookingState';
import { getBookingRule } from '@/lib/booking/booking-rules';
import { MapPin, Route } from 'lucide-react';
import { DropoffSection } from './sections/DropoffSection';
import { PickupSection } from './sections/PickupSection';

export function TravelRouteSection() {
  const { tripConfiguration, bookingType, setIsDifferentReturnLocation } = useBookingState();

  const isDifferentReturnLocation = tripConfiguration.isDifferentReturnLocation;
  const bookingRule = getBookingRule(bookingType);
  const dropoffTitle = bookingRule.dropoffOptional
    ? 'DROP-OFF LOCATION (Optional)'
    : 'DROP-OFF LOCATION';

  return (
    <GlassmorphismCard>
      <div className='flex items-center gap-2 mb-4'>
        <Route className='w-4 h-4 text-amber-200/60' />
        <span className='text-white font-medium text-sm'>Select Your Journey Details</span>
      </div>

      <div className='space-y-6'>
        <div className='relative'>
          {/* Vertical connection line */}
          <div className='absolute left-3 top-4 bottom-[-12px] w-px bg-gradient-to-b from-amber-300/40 via-amber-400/20 to-transparent'></div>

          {/* Pickup Location */}
          <div className='flex items-start gap-4'>
            <div className='flex flex-col items-center mt-7'>
              <div className='w-6 h-6 bg-gradient-to-br from-amber-300/20 to-amber-400/30 rounded-full border border-amber-300/40 flex items-center justify-center'>
                <div className='w-2 h-2 bg-amber-300 rounded-full'></div>
              </div>
            </div>
            <div className='flex-1'>
              <div className='text-white text-xs font-medium tracking-wider mb-2'>
                PICK-UP LOCATION
              </div>
              <PickupSection />
            </div>
          </div>

          {/* Dropoff Location */}
          <div className='flex items-start gap-4 mt-6'>
            <div className='flex flex-col items-center mt-7'>
              <div className='w-6 h-6 bg-gradient-to-br from-amber-400/20 to-amber-500/30 rounded-full border border-amber-400/40 flex items-center justify-center'>
                <div className='w-2 h-2 bg-amber-400 rounded-full'></div>
              </div>
            </div>
            <div className='flex-1'>
              <div className='text-white text-xs font-medium tracking-wider mb-2'>
                {dropoffTitle}
              </div>
              <DropoffSection />
            </div>
          </div>

          {/* Return Trip Info Display */}
          {bookingType === 'return' && tripConfiguration.pickup && tripConfiguration.dropoff && (
            <div className='flex items-start gap-4 mt-6'>
              <div className='flex flex-col items-center mt-7'>
                <div
                  className='w-6 h-6 bg-gradient-to-br from-amber-300/20 to-amber-400/30 rounded-full border border-amber-300/40 flex items-center justify-center animate-pulse'
                  style={{ animationDuration: '2s' }}
                >
                  <Route className='w-3 h-3 text-amber-300 transform scale-x-[-1]' />
                </div>
              </div>
              <div className='flex-1'>
                <div className='text-amber-100 text-xs font-light tracking-wider mb-2'>
                  RETURN TRIP
                </div>
                <div className='inline-block px-2 py-1 rounded-md bg-amber-100/10 border border-amber-300/30 text-amber-200/90 text-sm font-medium tracking-wide'>
                  <span className='text-amber-100 font-semibold'>
                    {tripConfiguration.dropoff.address}
                  </span>{' '}
                  <span className='text-amber-300 mx-1'>→</span>{' '}
                  <span className='text-amber-100 font-semibold'>
                    {tripConfiguration.pickup.address}
                  </span>
                  {tripConfiguration.returnDateTime && (
                    <span className='text-amber-200/70 ml-2'>
                      •{' '}
                      {tripConfiguration.returnDateTime.toLocaleDateString('en-GB', {
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      at{' '}
                      {tripConfiguration.returnDateTime.toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Return Trip Options for bookingType='return' */}
          {bookingType === 'return' && (
            <div className='mt-6 pt-4 border-t border-amber-200/10'>
              <label className='flex items-center gap-2 cursor-pointer mb-4 ml-1'>
                <input
                  type='checkbox'
                  checked={isDifferentReturnLocation}
                  onChange={e => setIsDifferentReturnLocation(e.target.checked)}
                  className='w-4 h-4 rounded border border-amber-200/40 bg-transparent checked:bg-amber-400 checked:border-amber-400 text-amber-400 focus:ring-1 focus:ring-amber-400/50'
                />
                <span className='text-xs text-white font-light'>
                  Different Return Pick-Up Location?
                </span>
              </label>

              {/* Different Return Location Fields - EXACT same pattern */}
              {isDifferentReturnLocation && (
                <>
                  {/* Return Pickup Location - EXACT same as pickup above */}
                  <div className='flex items-start gap-4 mt-6'>
                    <div className='flex flex-col items-center mt-7'>
                      <div className='w-6 h-6 bg-gradient-to-br from-amber-300/20 to-amber-400/30 rounded-full border border-amber-300/40 flex items-center justify-center'>
                        <div className='w-2 h-2 bg-amber-300 rounded-full'></div>
                      </div>
                    </div>
                    <div className='flex-1'>
                      <div className='text-white text-xs font-medium tracking-wider mb-2'>
                        RETURN PICK-UP LOCATION
                      </div>
                      <div className='relative'>
                        <div className='absolute left-3 top-1/2 -translate-y-1/2 z-10'>
                          <MapPin className='w-4 h-4 text-amber-200/60' />
                        </div>
                        <input
                          type='text'
                          placeholder='Enter return pickup location'
                          className='w-full bg-transparent border border-amber-200/20 rounded-md px-3 py-2 pl-10 text-amber-50 text-sm font-light placeholder:text-amber-200/40 focus:border-amber-200/40 focus:outline-none transition-colors'
                        />
                      </div>
                    </div>
                  </div>

                  {/* Return Dropoff Location - EXACT same as dropoff above */}
                  <div className='flex items-start gap-4 mt-6'>
                    <div className='flex flex-col items-center mt-7'>
                      <div className='w-6 h-6 bg-gradient-to-br from-amber-400/20 to-amber-500/30 rounded-full border border-amber-400/40 flex items-center justify-center'>
                        <div className='w-2 h-2 bg-amber-400 rounded-full'></div>
                      </div>
                    </div>
                    <div className='flex-1'>
                      <div className='text-white text-xs font-medium tracking-wider mb-2'>
                        RETURN DROP-OFF LOCATION
                      </div>
                      <div className='relative'>
                        <div className='absolute left-3 top-1/2 -translate-y-1/2 z-10'>
                          <MapPin className='w-4 h-4 text-amber-200/60' />
                        </div>
                        <input
                          type='text'
                          placeholder='Enter return dropoff location'
                          className='w-full bg-transparent border border-amber-200/20 rounded-md px-3 py-2 pl-10 text-amber-50 text-sm font-light placeholder:text-amber-200/40 focus:border-amber-200/40 focus:outline-none transition-colors'
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </GlassmorphismCard>
  );
}
