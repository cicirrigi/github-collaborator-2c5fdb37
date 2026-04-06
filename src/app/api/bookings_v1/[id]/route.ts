import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * GET /api/bookings_v1/[id] - Get single booking by ID (using client_booking_details_v1 view)
 *
 * SECURITY: Uses session client with RLS protection (no service role bypass).
 * View-based approach for consistent data access across web and mobile.
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: bookingId } = await params;
    const supabase = await createSupabaseServerClient();
    const {
      data: { session },
      error: sessionErr,
    } = await supabase.auth.getSession();

    if (sessionErr || !session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // UUID validation
    const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRe.test(bookingId)) {
      return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 });
    }

    // Query enhanced view with RLS protection
    const { data: row, error: bookingError } = await supabase
      .from('client_booking_details_v1')
      .select(
        `
        id,
        reference,
        currency,
        booking_status,
        booking_type,
        created_at,
        updated_at,
        payment_status,
        amount_pence,
        stripe_payment_intent_id,
        pickup_address,
        dropoff_address,
        scheduled_at,
        vehicle_category_id,
        vehicle_model_id,
        distance_miles,
        duration_min,
        trip_configuration_raw
      `
      )
      .eq('id', bookingId)
      .single();

    if (bookingError || !row) {
      return NextResponse.json(
        { error: 'Booking not found', details: bookingError?.message },
        { status: 404 }
      );
    }

    // Transform response with all booking details
    const booking = {
      id: row.id,
      reference: row.reference,
      currency: row.currency,
      status: row.booking_status,
      booking_type: row.booking_type,
      created_at: row.created_at,
      updated_at: row.updated_at,
      payment: {
        status: row.payment_status,
        amount_pence: row.amount_pence,
        stripe_payment_intent_id: row.stripe_payment_intent_id,
      },
      trip: {
        pickup_address: row.pickup_address,
        dropoff_address: row.dropoff_address,
        scheduled_at: row.scheduled_at,
        distance_miles: row.distance_miles ? Number(row.distance_miles) : null,
        duration_min: row.duration_min,
      },
      vehicle: {
        category_id: row.vehicle_category_id,
        model_id: row.vehicle_model_id,
      },
      trip_configuration: row.trip_configuration_raw,
    };

    return NextResponse.json({ booking });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: 'Internal server error', debug: msg }, { status: 500 });
  }
}
