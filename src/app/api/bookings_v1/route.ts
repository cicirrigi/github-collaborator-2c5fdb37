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

    // Get total count for pagination with explicit filter (defense in depth)
    const { count } = await supabase
      .from('client_bookings_list_v2')
      .select('*', { count: 'exact', head: true })
      .eq('auth_user_id', session.user.id);

    // Query enhanced view with RLS protection + explicit filter (defense in depth)
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
        vehicle_model_id,
        amount_pence,
        payment_status
      `
      )
      .eq('auth_user_id', session.user.id) // Explicit filter - defense in depth
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (bookingsError) {
      return NextResponse.json(
        { error: 'Failed to fetch bookings', details: bookingsError.message },
        { status: 500 }
      );
    }

    // Map vehicle model_id or category to friendly names
    const getVehicleName = (modelId?: string | null, category?: string | null) => {
      // Prefer specific model name if available
      if (modelId) {
        switch (modelId) {
          case 'bmw-5-series':
            return 'BMW 5 Series';
          case 'mercedes-e-class':
            return 'Mercedes E-Class';
          case 'bmw-7-series':
            return 'BMW 7 Series';
          case 'mercedes-s-class':
            return 'Mercedes S-Class';
          case 'mercedes-v-class':
            return 'Mercedes V-Class';
          case 'range-rover':
            return 'Range Rover';
          default:
            // If model_id exists but not recognized, use it as-is
            return modelId
              .split('-')
              .map(w => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ');
        }
      }

      // Fallback to category-based names
      if (category) {
        switch (category) {
          case 'executive':
            return 'Executive';
          case 'luxury':
            return 'Luxury';
          case 'suv':
            return 'SUV';
          case 'mpv':
            return 'MPV';
          default:
            return category;
        }
      }

      return 'Vehicle';
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
      vehicle: getVehicleName(booking.vehicle_model_id, booking.vehicle_category_id),
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
