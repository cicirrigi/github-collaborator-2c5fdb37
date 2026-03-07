import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import BookingHistoryList from './components/BookingHistoryList';

export const runtime = 'nodejs';

export default async function BookingsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  return (
    <div className='min-h-screen bg-neutral-50 dark:bg-neutral-950'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-neutral-900 dark:text-white'>Booking History</h1>
          <p className='mt-2 text-sm text-neutral-600 dark:text-neutral-400'>
            View and manage your bookings
          </p>
        </div>

        <BookingHistoryList />
      </div>
    </div>
  );
}
