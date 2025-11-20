'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { Luggage, MapPin, Route, Users } from 'lucide-react';
import { CalendarSection } from './CalendarSection';
import { CardHeader } from './CardHeader';
import { DropoffSection } from './sections/DropoffSection';
import { PickupSection } from './sections/PickupSection';

export function SimpleTestCard() {
  const {
    tripConfiguration,
    bookingType,
    setPassengers,
    setLuggage,
    setIsDifferentReturnLocation,
  } = useBookingState();

  const isDifferentReturnLocation = tripConfiguration.isDifferentReturnLocation;

  return (
    <div className='vl-card-flex col-span-1 lg:col-span-2'>
      <CardHeader
        icon={Route}
        title='Luxury Trip Manager'
        subtitle='Premium all-in-one booking experience'
      />
      <div className='vl-card-inner'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 h-full relative'>
          {/* Left Side - Trip Details */}
          <div className='space-y-6'>
            {/* Pickup & Dropoff - Swiss Refined */}
            <div className='bg-white/3 rounded-lg p-4 border border-amber-200/10'>
              <div className='flex items-center gap-2 mb-4'>
                <Route className='w-4 h-4 text-amber-200/60' />
                <span className='text-white font-medium text-sm'>Travel Route</span>
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
                    <div className='flex-1 -mt-1'>
                      <div className='text-amber-200/80 text-xs font-medium tracking-wider mb-2'>
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
                    <div className='flex-1 -mt-1'>
                      <div className='text-amber-200/80 text-xs font-medium tracking-wider mb-2'>
                        DROP-OFF LOCATION
                      </div>
                      <DropoffSection />
                    </div>
                  </div>

                  {/* Return Trip Info Display */}
                  {bookingType === 'return' &&
                    tripConfiguration.pickup &&
                    tripConfiguration.dropoff && (
                      <div className='flex items-start gap-4 mt-6'>
                        <div className='flex flex-col items-center mt-7'>
                          <div
                            className='w-6 h-6 bg-gradient-to-br from-amber-300/20 to-amber-400/30 rounded-full border border-amber-300/40 flex items-center justify-center animate-pulse'
                            style={{ animationDuration: '2s' }}
                          >
                            <Route className='w-3 h-3 text-amber-300 transform scale-x-[-1]' />
                          </div>
                        </div>
                        <div className='flex-1 -mt-1'>
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
                            <div className='flex-1 -mt-1'>
                              <div className='text-amber-200/80 text-xs font-medium tracking-wider mb-2'>
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
                            <div className='flex-1 -mt-1'>
                              <div className='text-amber-200/80 text-xs font-medium tracking-wider mb-2'>
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
            </div>

            {/* Passengers & Luggage - Swiss Precision */}
            <div className='grid grid-cols-2 gap-8'>
              <div className='bg-white/3 rounded-lg p-4 border border-amber-200/10'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='flex items-center gap-2'>
                    <Users className='w-4 h-4 text-amber-200/60' />
                    <span className='text-amber-100/80 text-sm font-light tracking-wider'>
                      Passengers
                    </span>
                  </div>
                </div>
                <div className='flex items-center justify-between'>
                  <button
                    onClick={() => setPassengers(Math.max(1, tripConfiguration.passengers - 1))}
                    className='w-7 h-7 rounded-full border border-amber-200/20 text-amber-200/70 hover:border-amber-200/40 hover:text-amber-200 transition-all duration-200 text-sm font-light'
                  >
                    −
                  </button>
                  <div className='text-amber-50 font-light text-lg tabular-nums'>
                    {tripConfiguration.passengers}
                  </div>
                  <button
                    onClick={() => setPassengers(tripConfiguration.passengers + 1)}
                    className='w-7 h-7 rounded-full border border-amber-200/20 text-amber-200/70 hover:border-amber-200/40 hover:text-amber-200 transition-all duration-200 text-sm font-light'
                  >
                    +
                  </button>
                </div>
              </div>

              <div className='bg-white/3 rounded-lg p-4 border border-amber-200/10'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='flex items-center gap-2'>
                    <Luggage className='w-4 h-4 text-amber-200/60' />
                    <span className='text-amber-100/80 text-sm font-light tracking-wider'>
                      Luggage
                    </span>
                  </div>
                </div>
                <div className='flex items-center justify-between'>
                  <button
                    onClick={() => setLuggage(Math.max(0, tripConfiguration.luggage - 1))}
                    className='w-7 h-7 rounded-full border border-amber-200/20 text-amber-200/70 hover:border-amber-200/40 hover:text-amber-200 transition-all duration-200 text-sm font-light'
                  >
                    −
                  </button>
                  <div className='text-amber-50 font-light text-lg tabular-nums'>
                    {tripConfiguration.luggage}
                  </div>
                  <button
                    onClick={() => setLuggage(tripConfiguration.luggage + 1)}
                    className='w-7 h-7 rounded-full border border-amber-200/20 text-amber-200/70 hover:border-amber-200/40 hover:text-amber-200 transition-all duration-200 text-sm font-light'
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Journey Info - Minimal Elegance */}
            <div className='bg-white/3 rounded-lg p-4 border border-amber-200/10'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Route className='w-4 h-4 text-amber-200/60' />
                  <span className='text-amber-100/80 text-sm font-light tracking-wider'>
                    Journey
                  </span>
                </div>
                <div className='text-amber-50 font-light text-sm tabular-nums'>25 km • 30 min</div>
              </div>
            </div>
          </div>

          {/* Refined Divider - Desktop Only */}
          <div className='hidden lg:block absolute left-1/2 top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-amber-200/15 to-transparent transform -translate-x-1/2'></div>

          {/* Right Side - Real Calendar */}
          <CalendarSection />
        </div>
      </div>
    </div>
  );
}
