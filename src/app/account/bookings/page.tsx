/**
 * 📅 Booking History Page - User Booking Management
 *
 * Pagina pentru vizualizarea istoricului rezervărilor
 * Clean, fără logic hardcodat, responsive
 */

import BookingHistoryList from '@/app/bookings/components/BookingHistoryList';
import { AccountLayout } from '@/features/account/components/shared/AccountLayout';

function BookingsContent() {
  return (
    <div className='space-y-6'>
      <div className='p-6'>
        <h1 className='text-2xl font-bold text-neutral-900 dark:text-white'>Booking History</h1>
        <p className='mt-2 text-sm text-neutral-600 dark:text-neutral-400'>
          View and manage your bookings
        </p>
      </div>
      <BookingHistoryList />
    </div>
  );
}

export default function BookingsPage() {
  return (
    <AccountLayout>
      <BookingsContent />
    </AccountLayout>
  );
}
