/**
 * 🏠 Account Dashboard Page - Main Account Overview
 *
 * Dashboard principal cu overview pentru utilizator
 * Clean, fără logic hardcodat, responsive
 */

import { HeroSection } from '@/features/account/components/dashboard/HeroSection';
import { LifetimeSpendingWidget } from '@/features/account/components/dashboard/LifetimeSpendingWidget';
import { NextReservationWidget } from '@/features/account/components/dashboard/NextReservationWidget';
import { PreferredVehicleWidget } from '@/features/account/components/dashboard/PreferredVehicleWidget';
import { QuickActionsWidget } from '@/features/account/components/dashboard/QuickActionsWidget';
import { RecentActivityWidget } from '@/features/account/components/dashboard/RecentActivityWidget';
import { TotalRidesWidget } from '@/features/account/components/dashboard/TotalRidesWidget';
import type { DashboardData } from '@/features/account/hooks/useDashboard';
import { createSupabaseServerClient } from '@/lib/supabase/server';

async function getDashboardData(): Promise<DashboardData | null> {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('customer_dashboard_v1')
      .select('*')
      .eq('auth_user_id', user.id)
      .single();

    if (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch dashboard:', error);
      return null;
    }

    return data as DashboardData;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching dashboard:', error);
    return null;
  }
}

async function getNextUpcomingBooking() {
  try {
    const supabase = await createSupabaseServerClient();
    const now = new Date().toISOString();

    // Get current user for explicit filtering (defense in depth)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data: booking, error } = await supabase
      .from('client_bookings_list_v2')
      .select(
        `
        pickup_address,
        scheduled_at
      `
      )
      .eq('auth_user_id', user.id) // Explicit filter - defense in depth
      .gte('scheduled_at', now)
      .in('booking_status', ['CONFIRMED', 'PENDING_PAYMENT'])
      .order('scheduled_at', { ascending: true })
      .limit(1)
      .single();

    if (error || !booking) {
      return null;
    }

    return {
      pickup_location: booking.pickup_address || 'Unknown',
      pickup_datetime: booking.scheduled_at,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching next booking:', error);
    return null;
  }
}

async function getRecentBookings() {
  try {
    const supabase = await createSupabaseServerClient();

    // Get current user for explicit filtering (defense in depth)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    const { data: bookings, error } = await supabase
      .from('client_bookings_list_v2')
      .select(
        `
        id,
        pickup_address,
        dropoff_address,
        scheduled_at,
        amount_pence,
        vehicle_category_id,
        vehicle_model_id,
        booking_status
      `
      )
      .eq('auth_user_id', user.id) // Explicit filter - defense in depth
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch recent bookings:', error);
      return [];
    }

    // Map to RecentActivityWidget expected format
    const mappedBookings = (bookings || []).map(booking => ({
      id: booking.id,
      pickup_location: booking.pickup_address || 'Unknown',
      dropoff_location: booking.dropoff_address || 'Unknown',
      pickup_datetime: booking.scheduled_at,
      total_price_pence: booking.amount_pence || 0,
      vehicle_category: booking.vehicle_category_id || 'economy',
      vehicle_model_id: booking.vehicle_model_id,
      status: booking.booking_status || 'unknown',
    }));

    return mappedBookings;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching recent bookings:', error);
    return [];
  }
}

export default async function AccountPage() {
  const dashboardData = await getDashboardData();
  const recentBookings = await getRecentBookings();
  const nextBooking = await getNextUpcomingBooking();

  return (
    <div className='min-h-screen bg-neutral-900'>
      <HeroSection dashboardData={dashboardData} />

      {/* Stats Widgets - Below Hero */}
      <div className='px-6 md:px-12 -mt-12 pb-32 bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex flex-wrap gap-2'>
            {/* Left Column - Quick Actions & Preferred Vehicle */}
            <div className='min-w-[320px] max-w-[320px] space-y-2'>
              <QuickActionsWidget />
              <PreferredVehicleWidget vehicleModel='S-Class' preferredChauffeur='James' />
            </div>

            {/* Next Reservation Widget */}
            <div className='flex-1 min-w-[200px]'>
              <NextReservationWidget nextBooking={nextBooking ?? undefined} />
            </div>

            {/* Lifetime Spending Widget */}
            <div className='min-w-[320px] max-w-[320px]'>
              <LifetimeSpendingWidget />
            </div>

            {/* Total Rides Widget */}
            <div className='min-w-[200px] max-w-[200px]'>
              <TotalRidesWidget />
            </div>
          </div>

          {/* Recent Activity - Below middle widgets */}
          <div className='-mt-[396px] ml-[328px]'>
            <div className='min-w-[524px]'>
              <RecentActivityWidget bookings={recentBookings} />
            </div>
          </div>
        </div>

        {/* Future Sections */}
        <div className='px-6 md:px-12 py-8'>
          <div className='max-w-7xl mx-auto'>{/* Future: Other widgets */}</div>
        </div>
      </div>
    </div>
  );
}
