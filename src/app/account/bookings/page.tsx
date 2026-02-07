/**
 * 📅 Booking History Page - User Booking Management
 *
 * Pagina pentru vizualizarea istoricului rezervărilor
 * Clean, fără logic hardcodat, responsive
 */

import { AccountLayout } from '@/features/account/components/shared/AccountLayout';

function BookingsContent() {
  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold text-neutral-900 dark:text-white'>Booking History</h1>
      <div className='bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700'>
        <p className='text-neutral-600 dark:text-neutral-400'>
          Your booking history and trip management will be implemented here.
        </p>
      </div>
    </div>
  );
}

export default function BookingsPage() {
  return (
    <AccountLayout title='Booking History' description='View past and upcoming trips'>
      <BookingsContent />
    </AccountLayout>
  );
}
