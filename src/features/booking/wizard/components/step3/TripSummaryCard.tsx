'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { getBookingRule } from '@/lib/booking/booking-rules';
import { format } from 'date-fns';
import { Calendar, Luggage, MapPin, Plane, Users } from 'lucide-react';

/**
 * 🎯 TRIP SUMMARY CARD - Step 3 Component
 *
 * Displays summary of Step 1 selections:
 * - Route information (pickup → dropoff)
 * - Date and time details
 * - Passengers, luggage, flight info
 *
 * Uses design tokens and Zustand store
 * Mobile friendly responsive design
 */
export function TripSummaryCard() {
  const { bookingType, tripConfiguration } = useBookingState();
  const bookingRule = getBookingRule(bookingType);

  const {
    pickup,
    dropoff,
    pickupDateTime,
    returnDateTime,
    passengers,
    luggage,
    flightNumberPickup,
    flightNumberReturn,
    hoursRequested,
    daysRequested,
  } = tripConfiguration;

  const formatLocation = (location: typeof pickup) => {
    if (!location) return 'Not selected';
    return location.address;
  };

  const formatDateTime = (date: Date | null) => {
    if (!date) return 'Not selected';
    return format(date, 'MMM dd, yyyy • HH:mm');
  };

  return (
    <div className='vl-card-flex'>
      {/* Header */}
      <div className='flex items-center gap-3 mb-5'>
        <div className='flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-600/20 backdrop-blur-sm border border-amber-500/20'>
          <MapPin className='w-5 h-5 text-amber-400' />
        </div>
        <div>
          <h3 className='text-lg font-semibold tracking-wide text-white'>Trip Overview</h3>
          <p className='text-amber-200/50 text-xs'>Your selected journey details</p>
        </div>
      </div>

      {/* Content */}
      <div className='vl-card-inner'>
        <div className='space-y-4'>
          {/* Route */}
          <div className='space-y-2'>
            <div className='flex items-center gap-2 text-neutral-300 text-sm'>
              <MapPin className='w-4 h-4' />
              <span>Route</span>
            </div>
            <div className='pl-6 space-y-2'>
              <div className='text-white text-sm'>
                <span className='text-emerald-400 font-medium'>From:</span> {formatLocation(pickup)}
              </div>
              {!bookingRule.dropoffOptional && (
                <div className='text-white text-sm'>
                  <span className='text-amber-400 font-medium'>To:</span> {formatLocation(dropoff)}
                </div>
              )}
            </div>
          </div>

          {/* DateTime */}
          <div className='space-y-2'>
            <div className='flex items-center gap-2 text-neutral-300 text-sm'>
              <Calendar className='w-4 h-4' />
              <span>Schedule</span>
            </div>
            <div className='pl-6 space-y-2'>
              <div className='text-white text-sm'>
                <span className='text-emerald-400 font-medium'>Pickup:</span>{' '}
                {formatDateTime(pickupDateTime)}
              </div>
              {bookingType === 'return' && (
                <div className='text-white text-sm'>
                  <span className='text-amber-400 font-medium'>Return:</span>{' '}
                  {formatDateTime(returnDateTime)}
                </div>
              )}
              {bookingType === 'hourly' && hoursRequested && (
                <div className='text-white text-sm'>
                  <span className='text-blue-400 font-medium'>Duration:</span> {hoursRequested}{' '}
                  hours
                </div>
              )}
              {bookingType === 'daily' && daysRequested && (
                <div className='text-white text-sm'>
                  <span className='text-purple-400 font-medium'>Duration:</span> {daysRequested}{' '}
                  days
                </div>
              )}
            </div>
          </div>

          {/* Passengers & Luggage */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <div className='flex items-center gap-2 text-neutral-300 text-sm'>
                <Users className='w-4 h-4' />
                <span>Passengers</span>
              </div>
              <div className='text-white font-medium'>{passengers}</div>
            </div>
            <div className='space-y-2'>
              <div className='flex items-center gap-2 text-neutral-300 text-sm'>
                <Luggage className='w-4 h-4' />
                <span>Luggage</span>
              </div>
              <div className='text-white font-medium'>{luggage}</div>
            </div>
          </div>

          {/* Flight Information */}
          {(flightNumberPickup || flightNumberReturn) && (
            <div className='space-y-2'>
              <div className='flex items-center gap-2 text-neutral-300 text-sm'>
                <Plane className='w-4 h-4' />
                <span>Flight Information</span>
              </div>
              <div className='pl-6 space-y-1'>
                {flightNumberPickup && (
                  <div className='text-white text-sm'>
                    <span className='text-emerald-400 font-medium'>Pickup:</span>{' '}
                    {flightNumberPickup}
                  </div>
                )}
                {flightNumberReturn && (
                  <div className='text-white text-sm'>
                    <span className='text-amber-400 font-medium'>Return:</span> {flightNumberReturn}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
