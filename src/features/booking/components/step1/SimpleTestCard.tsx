'use client';

import { UnifiedCalendar } from '@/components/calendar/UnifiedCalendar';
import { useBookingState } from '@/hooks/useBookingState';
import { Calendar, Luggage, Plane, Route, Users } from 'lucide-react';
import { CardHeader } from './CardHeader';
import { DropoffSection } from './sections/DropoffSection';
import { PickupSection } from './sections/PickupSection';

export function SimpleTestCard() {
  const {
    tripConfiguration,
    bookingType,
    setPassengers,
    setLuggage,
    setPickupDateTime,
    setReturnDateTime,
    setDailyRange,
    setFlightNumberPickup,
  } = useBookingState();

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
                <span className='text-amber-100/80 text-sm font-light tracking-wider'>
                  Trip Locations
                </span>
              </div>

              <div className='space-y-6'>
                <div className='relative'>
                  {/* Vertical connection line */}
                  <div className='absolute left-3 top-8 bottom-0 w-px bg-gradient-to-b from-amber-300/40 via-amber-400/20 to-transparent'></div>

                  {/* Pickup Location */}
                  <div className='flex items-start gap-4'>
                    <div className='flex flex-col items-center mt-1'>
                      <div className='w-6 h-6 bg-gradient-to-br from-amber-300/20 to-amber-400/30 rounded-full border border-amber-300/40 flex items-center justify-center'>
                        <div className='w-2 h-2 bg-amber-300 rounded-full'></div>
                      </div>
                    </div>
                    <div className='flex-1 -mt-1'>
                      <div className='text-amber-200/70 text-xs font-light tracking-wider mb-2'>
                        PICKUP LOCATION
                      </div>
                      <PickupSection />
                    </div>
                  </div>

                  {/* Dropoff Location */}
                  <div className='flex items-start gap-4 mt-6'>
                    <div className='flex flex-col items-center mt-1'>
                      <div className='w-6 h-6 bg-gradient-to-br from-amber-400/20 to-amber-500/30 rounded-full border border-amber-400/40 flex items-center justify-center'>
                        <div className='w-2 h-2 bg-amber-400 rounded-full'></div>
                      </div>
                    </div>
                    <div className='flex-1 -mt-1'>
                      <div className='text-amber-200/70 text-xs font-light tracking-wider mb-2'>
                        DROP-OFF LOCATION
                      </div>
                      <DropoffSection />
                    </div>
                  </div>
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
          <div className='flex flex-col'>
            {/* Real UnifiedCalendar */}
            <div className='bg-white/3 rounded-lg p-4 border border-amber-200/10'>
              <div className='flex items-center gap-2 mb-4'>
                <Calendar className='w-4 h-4 text-amber-200/60' />
                <span className='text-amber-100/80 text-sm font-light tracking-wider'>
                  Select Date & Time
                </span>
              </div>
              {bookingType === 'oneway' && (
                <UnifiedCalendar
                  bookingType='oneway'
                  date={tripConfiguration.pickupDateTime}
                  onChangeDate={setPickupDateTime}
                />
              )}
              {bookingType === 'return' && (
                <div className='space-y-4'>
                  <div className='space-y-3'>
                    <div className='flex items-center gap-2'>
                      <Calendar className='w-4 h-4 text-amber-200/60' />
                      <span className='text-amber-100/80 text-sm font-light tracking-wider'>
                        Departure
                      </span>
                    </div>
                    <UnifiedCalendar
                      bookingType='return'
                      modal
                      date={tripConfiguration.pickupDateTime}
                      onChangeDate={setPickupDateTime}
                      placeholder='Select departure date & time...'
                    />
                  </div>
                  <div className='space-y-3'>
                    <div className='flex items-center gap-2'>
                      <Calendar className='w-4 h-4 text-amber-200/60' />
                      <span className='text-amber-100/80 text-sm font-light tracking-wider'>
                        Return
                      </span>
                    </div>
                    <UnifiedCalendar
                      bookingType='return'
                      modal
                      date={tripConfiguration.returnDateTime}
                      onChangeDate={setReturnDateTime}
                      minDate={tripConfiguration.pickupDateTime ?? new Date()}
                      placeholder='Select return date & time...'
                    />
                  </div>
                </div>
              )}
              {bookingType === 'daily' && (
                <UnifiedCalendar
                  bookingType='daily'
                  range={tripConfiguration.dailyRange}
                  onChangeRange={setDailyRange}
                />
              )}
              {['hourly', 'fleet', 'bespoke'].includes(bookingType) && (
                <UnifiedCalendar
                  bookingType={bookingType}
                  date={tripConfiguration.pickupDateTime}
                  onChangeDate={setPickupDateTime}
                />
              )}
            </div>

            {/* Flight Number - Swiss Elegance */}
            <div className='bg-white/3 rounded-lg p-4 border border-amber-200/10 mt-4'>
              <div className='flex items-center gap-2 mb-3'>
                <Plane className='w-4 h-4 text-amber-200/60' />
                <span className='text-amber-100/80 text-sm font-light tracking-wider'>
                  Flight Number
                </span>
              </div>
              <input
                type='text'
                value={tripConfiguration.flightNumberPickup}
                onChange={e => setFlightNumberPickup(e.target.value)}
                placeholder='Optional flight number'
                className='w-full bg-transparent border border-amber-200/20 rounded-md px-3 py-2 text-amber-50 text-sm font-light placeholder:text-amber-200/40 focus:border-amber-200/40 focus:outline-none transition-colors'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
