'use client';

import { UnifiedCalendar } from '@/components/calendar/UnifiedCalendar';
import { useBookingState } from '@/hooks/useBookingState';
import { getBookingRule } from '@/lib/booking/booking-rules';
import { Calendar, Plane } from 'lucide-react';

export function CalendarSection() {
  const {
    tripConfiguration,
    bookingType,
    setPickupDateTime,
    setReturnDateTime,
    setFlightNumberPickup,
    setFlightNumberReturn,
  } = useBookingState();

  const bookingRule = getBookingRule(bookingType);

  return (
    <div className='flex flex-col'>
      {/* Real UnifiedCalendar */}
      <div className='bg-white/3 rounded-lg p-4 border border-amber-200/10'>
        <div className='flex items-center gap-2 mb-4'>
          <Calendar className='w-4 h-4 text-amber-200/60' />
          <span className='text-white font-medium text-sm'>Select Date & Time</span>
        </div>

        {bookingType === 'oneway' && (
          <UnifiedCalendar
            bookingType='oneway'
            date={tripConfiguration.pickupDateTime}
            onChangeDate={setPickupDateTime}
            minDate={new Date()}
          />
        )}

        {bookingType === 'return' && (
          <div className='space-y-4'>
            <div className='space-y-3'>
              <div className='flex items-center'>
                <span className='text-amber-200/80 text-xs font-medium tracking-wider'>
                  DEPARTURE
                </span>
              </div>
              <UnifiedCalendar
                bookingType='return'
                modal
                date={tripConfiguration.pickupDateTime}
                onChangeDate={setPickupDateTime}
                minDate={new Date()}
                placeholder='Select departure date & time...'
              />
            </div>
            <div className='space-y-3'>
              <div className='flex items-center'>
                <span className='text-amber-200/80 text-xs font-medium tracking-wider'>RETURN</span>
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

            {/* Flight Numbers for Return Trip */}
            {bookingRule.showFlightNumbers && (
              <div className='bg-white/3 rounded-lg p-4 border border-amber-200/10'>
                <div className='flex items-center gap-2 mb-3'>
                  <Plane className='w-4 h-4 text-amber-200/60' />
                  <span className='text-white font-medium text-sm'>Flight Numbers (Optional)</span>
                </div>
                <div className='space-y-3'>
                  {/* Departure Flight */}
                  <div>
                    <label className='text-amber-200/80 text-xs font-medium tracking-wider mb-1 block'>
                      DEPARTURE FLIGHT
                    </label>
                    <input
                      type='text'
                      value={tripConfiguration.flightNumberPickup}
                      onChange={e => setFlightNumberPickup(e.target.value)}
                      placeholder='Optional flight number (e.g., BA123)'
                      className='w-full bg-transparent border border-amber-200/20 rounded-md px-3 py-2 text-amber-50 text-sm font-light placeholder:text-amber-200/40 focus:border-amber-200/40 focus:outline-none transition-colors'
                    />
                  </div>
                  {/* Return Flight */}
                  <div>
                    <label className='text-amber-200/80 text-xs font-medium tracking-wider mb-1 block'>
                      RETURN FLIGHT
                    </label>
                    <input
                      type='text'
                      value={tripConfiguration.flightNumberReturn}
                      onChange={e => setFlightNumberReturn(e.target.value)}
                      placeholder='Optional flight number (e.g., LH456)'
                      className='w-full bg-transparent border border-amber-200/20 rounded-md px-3 py-2 text-amber-50 text-sm font-light placeholder:text-amber-200/40 focus:border-amber-200/40 focus:outline-none transition-colors'
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {['hourly', 'daily', 'fleet', 'bespoke'].includes(bookingType) && (
          <UnifiedCalendar
            bookingType={bookingType}
            date={tripConfiguration.pickupDateTime}
            onChangeDate={setPickupDateTime}
            minDate={new Date()}
          />
        )}
      </div>

      {/* Flight Number - pentru non-return trips */}
      {bookingType !== 'return' && bookingRule.showFlightNumbers && (
        <div className='bg-white/3 rounded-lg p-4 border border-amber-200/10 mt-4'>
          <div className='flex items-center gap-2 mb-3'>
            <Plane className='w-4 h-4 text-amber-200/60' />
            <span className='text-white font-medium text-sm'>Flight Number (Optional)</span>
          </div>
          <input
            type='text'
            value={tripConfiguration.flightNumberPickup}
            onChange={e => setFlightNumberPickup(e.target.value)}
            placeholder='Optional flight number (e.g., BA123)'
            className='w-full bg-transparent border border-amber-200/20 rounded-md px-3 py-2 text-amber-50 text-sm font-light placeholder:text-amber-200/40 focus:border-amber-200/40 focus:outline-none transition-colors'
          />
        </div>
      )}
    </div>
  );
}
