/**
 * 📅 Booking History Page - User Booking Management
 *
 * Pagina pentru vizualizarea istoricului rezervărilor
 * Clean, fără logic hardcodat, responsive
 * Optimized: Server-side data fetch for instant loading
 */

import BookingHistoryList from '@/app/bookings/components/BookingHistoryList';
import { createSupabaseServerClient } from '@/lib/supabase/server';

async function getBookings(page: number = 1, limit: number = 20) {
  try {
    const supabase = await createSupabaseServerClient();
    const offset = (page - 1) * limit;

    // Get current user for explicit filtering (defense in depth)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { bookings: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } };
    }

    // Get total count for pagination
    const { count } = await supabase
      .from('client_bookings_list_v2')
      .select('*', { count: 'exact', head: true })
      .eq('auth_user_id', user.id); // Explicit filter - defense in depth

    // Query bookings with pagination
    const { data: bookingsData, error: bookingsError } = await supabase
      .from('client_bookings_list_v2')
      .select(
        `
        id,
        reference,
        currency,
        booking_status,
        booking_type,
        created_at,
        pickup_address,
        dropoff_address,
        scheduled_at,
        vehicle_category_id,
        vehicle_model_id,
        amount_pence,
        payment_status
      `
      )
      .eq('auth_user_id', user.id) // Explicit filter - defense in depth
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (bookingsError) {
      // eslint-disable-next-line no-console
      console.error('Error fetching bookings:', bookingsError);
      return { bookings: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } };
    }

    // Map to UI format
    const bookings = (bookingsData || []).map(booking => ({
      id: booking.id,
      reference: booking.reference,
      status: booking.booking_status,
      booking_type: booking.booking_type,
      pickup: booking.pickup_address || '',
      dropoff: booking.dropoff_address || '',
      scheduled_at: booking.scheduled_at,
      vehicle: booking.vehicle_category_id || 'economy',
      amount: (booking.amount_pence || 0) / 100,
      currency: booking.currency || 'GBP',
      payment_status: booking.payment_status || 'pending',
      created_at: booking.created_at,
    }));

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      bookings,
      pagination: { page, limit, total, totalPages },
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching bookings:', error);
    return { bookings: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } };
  }
}

export default async function BookingsPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = Number(searchParams.page) || 1;
  const { bookings, pagination } = await getBookings(page, 20);

  return (
    <div className='p-6'>
      <BookingHistoryList initialBookings={bookings} initialPagination={pagination} />
    </div>
  );
}
