'use client';

import { format } from 'date-fns';
import { Banknote, Calendar, Car, CheckCircle, Hash, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import BookingDetailsModal from './BookingDetailsModal';

interface Booking {
  id: string;
  reference: string;
  status: string;
  booking_type: string;
  pickup: string;
  dropoff: string;
  scheduled_at: string;
  vehicle: string;
  amount: number;
  currency: string;
  payment_status: string;
  created_at: string;
}

interface BookingHistoryListProps {
  initialBookings?: Booking[];
  initialPagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: 'bg-green-100 text-green-800',
  PENDING_PAYMENT: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
  CANCELLED: 'bg-red-100 text-red-800',
  NEW: 'bg-gray-100 text-gray-800',
};

const VEHICLE_LABELS: Record<string, string> = {
  economy: 'Economy',
  business: 'Business',
  luxury: 'Luxury',
  suv: 'SUV',
  mpv: 'MPV',
};

export default function BookingHistoryList({
  initialBookings = [],
  initialPagination = { page: 1, limit: 20, total: 0, totalPages: 0 },
}: BookingHistoryListProps) {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState(initialPagination);

  // Update state when initial props change (server navigation)
  useEffect(() => {
    setBookings(initialBookings);
    setPagination(initialPagination);
  }, [initialBookings, initialPagination]);

  const handlePageChange = (newPage: number) => {
    router.push(`/account/bookings?page=${newPage}`);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy, HH:mm');
    } catch {
      return dateString;
    }
  };

  const formatRoute = (pickup: string, dropoff: string) => {
    const cleanAddress = (addr: string) => {
      if (!addr) return '';
      const parts = addr.split(',');
      return parts.length > 2 ? parts.slice(0, 2).join(',') : addr;
    };
    return `${cleanAddress(pickup)} → ${cleanAddress(dropoff)}`;
  };

  if (bookings.length === 0) {
    return (
      <div className='rounded-lg bg-white dark:bg-neutral-900 p-12 text-center shadow border border-neutral-200 dark:border-neutral-800'>
        <p className='text-neutral-500 dark:text-neutral-400'>No bookings found</p>
      </div>
    );
  }

  return (
    <div className='overflow-hidden bg-white dark:bg-neutral-900 shadow sm:rounded-lg border border-neutral-200 dark:border-neutral-800'>
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-neutral-200 dark:divide-neutral-800'>
          <thead className='bg-neutral-50 dark:bg-neutral-800/50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400'>
                <div className='flex items-center gap-2'>
                  <Hash className='h-4 w-4' />
                  <span>Reference</span>
                </div>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400'>
                <div className='flex items-center gap-2'>
                  <MapPin className='h-4 w-4' />
                  <span>Route</span>
                </div>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400'>
                <div className='flex items-center gap-2'>
                  <Calendar className='h-4 w-4' />
                  <span>Date & Time</span>
                </div>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400'>
                <div className='flex items-center gap-2'>
                  <Car className='h-4 w-4' />
                  <span>Vehicle</span>
                </div>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400'>
                <div className='flex items-center gap-2'>
                  <Banknote className='h-4 w-4' />
                  <span>Amount</span>
                </div>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400'>
                <div className='flex items-center gap-2'>
                  <CheckCircle className='h-4 w-4' />
                  <span>Status</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-neutral-200 dark:divide-neutral-800 bg-white dark:bg-neutral-900'>
            {bookings.map(booking => (
              <tr
                key={booking.id}
                onClick={() => {
                  setSelectedBookingId(booking.id);
                  setIsModalOpen(true);
                }}
                className='cursor-pointer transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
              >
                <td className='whitespace-nowrap px-6 py-4'>
                  <div className='text-sm font-medium text-neutral-900 dark:text-white'>
                    {booking.reference}
                  </div>
                </td>
                <td className='px-6 py-4'>
                  <div className='max-w-xs text-sm text-neutral-900 dark:text-neutral-100'>
                    {formatRoute(booking.pickup, booking.dropoff)}
                  </div>
                </td>
                <td className='whitespace-nowrap px-6 py-4 text-sm text-neutral-900 dark:text-neutral-100'>
                  {formatDateTime(booking.scheduled_at)}
                </td>
                <td className='whitespace-nowrap px-6 py-4 text-sm text-neutral-900 dark:text-neutral-100'>
                  {VEHICLE_LABELS[booking.vehicle] || booking.vehicle}
                </td>
                <td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-neutral-900 dark:text-white'>
                  {formatCurrency(booking.amount, booking.currency)}
                </td>
                <td className='whitespace-nowrap px-6 py-4'>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      STATUS_COLORS[booking.status] ||
                      'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
                    }`}
                  >
                    {booking.status.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className='flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800 px-6 py-4 bg-neutral-50 dark:bg-neutral-800/50'>
          <div className='flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400'>
            <span>
              Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}{' '}
              bookings
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
              disabled={pagination.page === 1}
              className='px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              Previous
            </button>
            <span className='px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300'>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.page + 1))}
              disabled={pagination.page === pagination.totalPages}
              className='px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              Next
            </button>
          </div>
        </div>
      )}

      <BookingDetailsModal
        bookingId={selectedBookingId || ''}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBookingId(null);
        }}
      />
    </div>
  );
}
