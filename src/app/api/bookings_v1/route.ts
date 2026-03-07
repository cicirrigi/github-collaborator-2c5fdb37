import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * GET /api/bookings_v1 - List user bookings (using client_bookings_list_v2 view)
 *
 * SECURITY: Uses session client with RLS protection (no service role bypass).
 * View-based approach for consistent data access across web and mobile.
 * Enhanced with route, vehicle, and payment information for booking history UI.
 */
export async function GET(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { session },
      error: sessionErr,
    } = await supabase.auth.getSession();

    if (sessionErr || !session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Parse query params for pagination
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = (page - 1) * limit;

    // Get total count for pagination
    const { count } = await supabase
      .from('client_bookings_list_v2')
      .select('*', { count: 'exact', head: true });

    // Query enhanced view with RLS protection (auth filtering handled by RLS)
    const { data: bookings, error: bookingsError } = await supabase
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
        amount_pence,
        payment_status
      `
      )
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (bookingsError) {
      return NextResponse.json(
        { error: 'Failed to fetch bookings', details: bookingsError.message },
        { status: 500 }
      );
    }

    // Map vehicle categories to friendly names
    const getVehicleName = (category: string) => {
      switch (category) {
        case 'luxury':
          return 'Luxury (S-Class)';
        case 'business':
          return 'Business (E-Class)';
        case 'economy':
          return 'Economy';
        case 'suv':
          return 'SUV';
        case 'mpv':
          return 'MPV';
        default:
          return category;
      }
    };

    // Transform response with proper formatting
    const transformedBookings = (bookings || []).map(booking => ({
      id: booking.id,
      reference: booking.reference,
      status: booking.booking_status,
      booking_type: booking.booking_type,
      pickup: booking.pickup_address,
      dropoff: booking.dropoff_address,
      scheduled_at: booking.scheduled_at,
      vehicle: booking.vehicle_category_id
        ? getVehicleName(booking.vehicle_category_id)
        : 'Vehicle',
      amount: booking.amount_pence ? Number(booking.amount_pence) / 100 : 0,
      currency: booking.currency,
      payment_status: booking.payment_status,
      created_at: booking.created_at,
    }));

    return NextResponse.json({
      bookings: transformedBookings,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: 'Internal server error', debug: msg }, { status: 500 });
  }
}
