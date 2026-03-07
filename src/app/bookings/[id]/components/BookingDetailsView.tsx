'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';

interface BookingDetails {
  id: string;
  reference: string;
  status: string;
  booking_type: string;
  currency: string;
  amount_pence: number;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400',
  PENDING_PAYMENT: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400',
  COMPLETED: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400',
  CANCELLED: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400',
  NEW: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
};

interface BookingDetailsViewProps {
  bookingId: string;
}

export default function BookingDetailsView({ bookingId }: BookingDetailsViewProps) {
  const router = useRouter();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookingDetails() {
      try {
        const response = await fetch(`/api/bookings_v1/${bookingId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch booking details');
        }
        const data = await response.json();
        setBooking(data.booking);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchBookingDetails();
  }, [bookingId]);

  const formatCurrency = (amountPence: number, currency: string) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency,
    }).format(amountPence / 100);
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy, HH:mm');
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='text-neutral-500 dark:text-neutral-400'>Loading booking details...</div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className='space-y-4'>
        <button
          onClick={() => router.back()}
          className='flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors'
        >
          <ArrowLeft className='h-4 w-4' />
          Back to bookings
        </button>
        <div className='rounded-lg bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800'>
          <p className='text-sm text-red-600 dark:text-red-400'>{error || 'Booking not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <button
          onClick={() => router.back()}
          className='flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors'
        >
          <ArrowLeft className='h-4 w-4' />
          Back to bookings
        </button>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            STATUS_COLORS[booking.status] ||
            'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
          }`}
        >
          {booking.status.replace('_', ' ')}
        </span>
      </div>

      <div className='bg-white dark:bg-neutral-900 rounded-lg shadow border border-neutral-200 dark:border-neutral-800 overflow-hidden'>
        <div className='px-6 py-4 border-b border-neutral-200 dark:border-neutral-800'>
          <h1 className='text-2xl font-bold text-neutral-900 dark:text-white'>
            Booking {booking.reference}
          </h1>
          <p className='text-sm text-neutral-500 dark:text-neutral-400 mt-1'>
            {booking.booking_type.charAt(0).toUpperCase() + booking.booking_type.slice(1)} booking
          </p>
        </div>

        <div className='p-6 space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <h3 className='text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2'>
                Booking Reference
              </h3>
              <p className='text-lg font-semibold text-neutral-900 dark:text-white'>
                {booking.reference}
              </p>
            </div>

            <div>
              <h3 className='text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2'>
                Total Amount
              </h3>
              <p className='text-lg font-semibold text-neutral-900 dark:text-white'>
                {formatCurrency(booking.amount_pence, booking.currency)}
              </p>
            </div>

            <div>
              <h3 className='text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2'>
                Payment Status
              </h3>
              <p className='text-sm text-neutral-900 dark:text-neutral-100'>
                {booking.payment_status === 'succeeded' ? 'Paid' : 'Pending'}
              </p>
            </div>

            <div>
              <h3 className='text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2'>
                Booking Type
              </h3>
              <p className='text-sm text-neutral-900 dark:text-neutral-100'>
                {booking.booking_type.charAt(0).toUpperCase() + booking.booking_type.slice(1)}
              </p>
            </div>

            <div>
              <h3 className='text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2'>
                Created
              </h3>
              <p className='text-sm text-neutral-900 dark:text-neutral-100'>
                {formatDateTime(booking.created_at)}
              </p>
            </div>

            <div>
              <h3 className='text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2'>
                Last Updated
              </h3>
              <p className='text-sm text-neutral-900 dark:text-neutral-100'>
                {formatDateTime(booking.updated_at)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-neutral-50 dark:bg-neutral-900/50 rounded-lg p-6 border border-neutral-200 dark:border-neutral-800'>
        <p className='text-sm text-neutral-600 dark:text-neutral-400'>
          Additional booking details (route, vehicle, breakdown) will be available here.
        </p>
      </div>
    </div>
  );
}
