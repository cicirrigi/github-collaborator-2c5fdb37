/**
 * 📋 RecentActivityWidget - Display recent bookings activity
 *
 * Shows last 5 bookings with car images, route, date/time, and price
 */

'use client';

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { DashboardWidget } from './DashboardWidget';

interface RecentBooking {
  id: string;
  pickup_location: string;
  dropoff_location: string;
  pickup_datetime: string;
  total_price_pence: number;
  vehicle_category: string;
  vehicle_model_id?: string;
  status: string;
}

interface RecentActivityWidgetProps {
  bookings: RecentBooking[];
}

// Map vehicle models to car images (prefer model_id over category)
const VEHICLE_IMAGES: Record<string, string> = {
  // By model_id (specific vehicles)
  'bmw-5-series': '/images/vehicles-webp/5 Series Front.webp',
  'mercedes-e-class': '/images/vehicles-webp/E Class Front.webp',
  'bmw-7-series': '/images/vehicles-webp/7 Series Front.webp',
  'mercedes-s-class': '/images/vehicles-webp/S Class Front.webp',
  'mercedes-v-class': '/images/vehicles-webp/V Class Front.webp',
  'range-rover': '/images/vehicles-webp/Range Rover Left side angle.webp',
  // Fallback by category
  executive: '/images/vehicles-webp/E Class Front.webp',
  luxury: '/images/vehicles-webp/S Class Front.webp',
  suv: '/images/vehicles-webp/Range Rover Left side angle.webp',
  mpv: '/images/vehicles-webp/V Class Front.webp',
};

export function RecentActivityWidget({ bookings }: RecentActivityWidgetProps) {
  const recentBookings = bookings.slice(0, 3);

  return (
    <DashboardWidget className='p-0'>
      {/* Header */}
      <div className='px-6 py-4 border-b border-white/10 flex items-center justify-between'>
        <h3 className='text-sm font-semibold uppercase tracking-wider text-white/70'>
          Recent Activity
        </h3>
        <Link
          href='/account/bookings'
          className='flex items-center gap-2 text-xs text-white/70 hover:text-amber-400 transition-colors group'
        >
          <span>VIEW ALL BOOKINGS</span>
          <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
        </Link>
      </div>

      {/* Bookings List */}
      <div className='divide-y divide-white/10'>
        {recentBookings.length === 0 ? (
          <div className='px-6 py-8 text-center text-white/50'>No recent bookings</div>
        ) : (
          recentBookings.map(booking => {
            const pickupDate = new Date(booking.pickup_datetime);
            // Prefer vehicle_model_id for specific model images, fallback to category
            const imageKey = booking.vehicle_model_id || booking.vehicle_category.toLowerCase();
            const vehicleImage = VEHICLE_IMAGES[imageKey] || '/images/vehicles/economy-car.png';
            const priceInPounds = booking.total_price_pence / 100;

            return (
              <div
                key={booking.id}
                className='px-6 py-4 hover:bg-white/5 transition-colors cursor-pointer'
              >
                <div className='flex items-center gap-4'>
                  {/* Car Thumbnail */}
                  <div className='relative w-16 h-16 rounded-lg overflow-hidden bg-white/5 flex-shrink-0'>
                    <Image
                      src={vehicleImage}
                      alt={booking.vehicle_category}
                      fill
                      className='object-contain'
                    />
                  </div>

                  {/* Route & DateTime */}
                  <div className='flex-1 min-w-0'>
                    <p className='text-white font-medium truncate'>
                      {booking.pickup_location} • {booking.dropoff_location}
                    </p>
                    <p className='text-white/50 text-sm'>
                      {pickupDate.toLocaleDateString('en-GB', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}{' '}
                      {pickupDate.toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {/* Price & Class */}
                  <div className='text-right flex-shrink-0'>
                    <p className='text-white font-bold text-lg'>£{priceInPounds}</p>
                    <p className='text-white/50 text-xs uppercase'>{booking.vehicle_category}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </DashboardWidget>
  );
}
