import { createSupabaseServerClient } from '@/lib/supabase/server';
import { buildBookingPayload, buildLegsPayload } from '@/services/booking-mapping/dbPayload';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const createBookingSchema = z.object({
  tripConfiguration: z.any(),
  bookingType: z.enum(['oneway', 'return', 'hourly', 'daily', 'fleet', 'bespoke']),
  pricingSnapshot: z
    .object({
      finalPricePence: z.number().int().nonnegative(),
      currency: z.string().optional(),
      breakdown: z.any().optional(),
      routeData: z
        .object({
          distance: z.number().nullable(),
          duration: z.number().nullable(),
          isCalculated: z.boolean(),
        })
        .optional(),
    })
    .optional(),
});

export async function POST(req: Request) {
  try {
    // 1) Session (normal server client)
    const supabase = await createSupabaseServerClient();
    const {
      data: { session },
      error: sessionErr,
    } = await supabase.auth.getSession();

    if (sessionErr || !session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // 2) Validate body
    const body = await req.json();
    const parsed = createBookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { tripConfiguration, bookingType, pricingSnapshot } = parsed.data;

    // DEBUG: Check if routeData is coming from frontend
    console.log('BOOKING_CREATE routeData', pricingSnapshot?.routeData);

    // 3) Admin client (service role)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    const user = session.user;

    // 4) Upsert customer (schema ta)
    const { data: customer, error: customerErr } = await supabaseAdmin
      .from('customers')
      .upsert(
        {
          auth_user_id: user.id,
          email: user.email ?? 'unknown@example.com',
          // defaults exist in DB but we can still send:
          first_name: 'Guest',
          last_name: '',
          is_active: true,
        },
        { onConflict: 'auth_user_id' }
      )
      .select('id')
      .single();

    if (customerErr || !customer) {
      return NextResponse.json(
        { success: false, error: 'Failed to upsert customer', details: customerErr?.message },
        { status: 500 }
      );
    }

    // 5) Build payloads (exact schema)
    const p_booking = buildBookingPayload({
      customerId: customer.id,
      bookingType,
      tripConfiguration,
      currency: pricingSnapshot?.currency ?? 'GBP',
    });

    const p_legs = buildLegsPayload(
      pricingSnapshot?.routeData
        ? {
            bookingType,
            tripConfiguration,
            pricingState: { routeData: pricingSnapshot.routeData },
          }
        : {
            bookingType,
            tripConfiguration,
          }
    );

    // DEBUG: Check if distance/duration made it into p_legs
    console.log('BOOKING_CREATE p_legs[0] distance/duration', {
      distance_miles: p_legs?.[0]?.distance_miles,
      duration_min: p_legs?.[0]?.duration_min,
    });

    // 6) RPC atomic create
    const { data: bookingId, error: rpcErr } = await supabaseAdmin.rpc('create_booking_with_legs', {
      p_booking,
      p_legs,
    });

    if (rpcErr || !bookingId) {
      return NextResponse.json(
        { success: false, error: 'Failed to create booking in database', bookingError: rpcErr },
        { status: 500 }
      );
    }

    // 7) Read reference for UI
    const { data: created, error: readErr } = await supabaseAdmin
      .from('bookings')
      .select('id, reference, currency')
      .eq('id', bookingId)
      .single();

    if (readErr) {
      // booking exists; return minimal
      return NextResponse.json({
        success: true,
        bookingId,
        reference: null,
        amount_total_pence: pricingSnapshot?.finalPricePence ?? 0,
        currency: (pricingSnapshot?.currency ?? 'GBP').toUpperCase(),
      });
    }

    return NextResponse.json({
      success: true,
      bookingId: created.id,
      reference: created.reference,
      amount_total_pence: pricingSnapshot?.finalPricePence ?? 0,
      currency: created.currency,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { success: false, error: 'Internal server error', debug: msg },
      { status: 500 }
    );
  }
}

// GET handler - Keep existing functionality
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

    const user = session.user;

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    // Find customer
    const { data: customerData, error: customerError } = await supabaseAdmin
      .from('customers')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    if (customerError || !customerData) {
      return NextResponse.json({ bookings: [] });
    }

    // Get bookings with corrected schema
    const { data: bookings, error: bookingsError } = await supabaseAdmin
      .from('bookings')
      .select(
        `
        id,
        reference,
        currency,
        status,
        created_at
      `
      )
      .eq('customer_id', customerData.id)
      .order('created_at', { ascending: false });

    if (bookingsError) {
      return NextResponse.json(
        { error: 'Failed to fetch bookings', details: bookingsError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ bookings: bookings || [] });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: 'Internal server error', debug: msg }, { status: 500 });
  }
}
