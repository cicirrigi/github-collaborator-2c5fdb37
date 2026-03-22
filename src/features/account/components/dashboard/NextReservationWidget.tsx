/**
 * 📅 Next Reservation Widget
 *
 * Displays the next upcoming booking details
 */

'use client';

import { Calendar } from 'lucide-react';
import { DashboardWidget } from './DashboardWidget';

interface NextReservationWidgetProps {
  readonly nextBooking?:
    | {
        pickup_location: string;
        pickup_datetime: string;
      }
    | undefined;
}

export function NextReservationWidget({ nextBooking }: NextReservationWidgetProps) {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <DashboardWidget className='h-[180px]'>
      <div className='flex flex-col items-center justify-center h-full py-4 px-4'>
        {/* Icon */}
        <div className='mb-3'>
          <Calendar className='w-8 h-8 text-amber-500' />
        </div>

        {/* Title */}
        <h3 className='text-xs font-medium text-white/60 uppercase tracking-wider mb-3'>
          Next Reservation
        </h3>

        {nextBooking ? (
          <>
            {/* Date */}
            <p className='text-2xl font-bold text-white mb-1'>
              {formatDate(nextBooking.pickup_datetime)}
            </p>

            {/* Time */}
            <p className='text-sm text-white/70 mb-2'>{formatTime(nextBooking.pickup_datetime)}</p>

            {/* Location */}
            <p className='text-xs text-white/50 text-center line-clamp-2'>
              {nextBooking.pickup_location}
            </p>
          </>
        ) : (
          <p className='text-sm text-white/50'>No upcoming bookings</p>
        )}
      </div>
    </DashboardWidget>
  );
}
