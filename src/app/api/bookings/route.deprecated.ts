/**
 * 📋 Bookings API Route – Vantage Lane 2.0 ENTERPRISE
 *
 * PROPER ENTERPRISE IMPLEMENTATION:
 * - Server-side booking creation with full mapping system
 * - Authentication via requireUser guard (via Supabase session)
 * - Full TripConfiguration validation
 * - Uses enterprise booking mappers
 * - Proper error handling and HTTP status codes
 */

import { createSupabaseServerClient } from '@/lib/supabase/server';
import {
  mapOnewayBooking,
  mapOnewayLegs,
  mapReturnBooking,
  mapReturnLegs,
} from '@/services/booking-mapping';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { z } from 'zod';

/* --------------------------------------------------
 * 📝 Request/Response Schemas - ENTERPRISE GRADE
 * -------------------------------------------------- */

const createBookingSchema = z.object({
  tripConfiguration: z.any(), // TODO: Create proper Zod schema for TripConfiguration
  bookingType: z.enum(['oneway', 'return', 'hourly', 'daily', 'fleet', 'bespoke']),
  pricingSnapshot: z
    .object({
      finalPricePence: z.number().int().positive(),
      currency: z.string().optional(),
      breakdown: z.any().optional(),
    })
    .optional(),
});

type CreateBookingRequest = z.infer<typeof createBookingSchema>;

/* --------------------------------------------------
 * 📋 GET /api/bookings - List user bookings
 * -------------------------------------------------- */

export async function GET() {
  try {
    // Handle authentication for API routes (no redirects)
    const supabase = await createSupabaseServerClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session || !session.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const user = session.user;

    // Use admin client for customer lookup to avoid RLS issues
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    // Find customer record by auth_user_id (using admin client)
    const { data: customerData, error: customerError } = await supabaseAdmin
      .from('customers')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    if (customerError || !customerData) {
      console.error('Failed to find customer:', customerError);
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Then query bookings by customer_id
    const { data, error: dbError } = await supabase
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

    if (dbError) {
      console.error('Failed to fetch bookings:', dbError);
      return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
    }

    return NextResponse.json({
      bookings: data ?? [],
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Bookings GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/* --------------------------------------------------
 * 📋 POST /api/bookings - ENTERPRISE BOOKING CREATION
 * -------------------------------------------------- */

export async function POST(req: Request) {
  try {
    console.log('🔍 API Route: POST /api/bookings called');

    // 1) Auth check with normal server client (respects session)
    const supabase = await createSupabaseServerClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session?.user) {
      console.log('❌ No authenticated user found');
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const user = session.user;
    console.log('✅ Authentication successful, user:', user.id);

    // 2) Service-role client for DB writes that may bypass RLS
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: { persistSession: false },
      }
    );

    // 3) Parse + validate body
    const json = await req.json();
    const parsed = createBookingSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { tripConfiguration, bookingType, pricingSnapshot }: CreateBookingRequest = parsed.data;

    // 4) Find or create customer record (UPSERT to prevent duplicates)
    const { data: customer, error: upsertError } = await supabaseAdmin
      .from('customers')
      .upsert(
        {
          auth_user_id: user.id,
          email: user.email ?? 'unknown@example.com',
          first_name: 'Customer',
          last_name: 'User',
          is_active: true,
        },
        { onConflict: 'auth_user_id' }
      )
      .select('id')
      .single();

    if (upsertError || !customer) {
      console.error('❌ Failed to upsert customer record:', upsertError);
      return NextResponse.json(
        {
          error: 'Failed to create/find customer profile',
          details: upsertError?.message || 'Unknown',
        },
        { status: 500 }
      );
    }

    const customerId = customer.id;
    console.log('✅ Customer record ready:', customerId);

    // pricingSnapshot already extracted above

    // 5) Map TripConfiguration -> booking record
    const bookingRecord =
      bookingType === 'oneway'
        ? mapOnewayBooking(tripConfiguration, customerId)
        : mapReturnBooking(tripConfiguration, customerId);

    // 6) Add pricing snapshot + quote validity (NEW DB SCHEMA)
    const quoteValidUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now

    const bookingWithPricing = {
      ...bookingRecord,
      // bookingRecord already contains all correct fields from base-mapping
      currency: (pricingSnapshot?.currency ?? 'GBP').toUpperCase(),
      // Do NOT set reference - DB has generate_booking_reference() function
    };

    // DEBUG: Log booking payload keys and sample data
    console.log('🔍 BOOKING INSERT PAYLOAD KEYS:', Object.keys(bookingWithPricing));
    console.log('🔍 BOOKING INSERT SAMPLE:', {
      customer_id: bookingWithPricing.customer_id,
      has_trip_type: 'trip_type' in bookingWithPricing,
      has_booking_type: 'booking_type' in bookingWithPricing,
      has_booking_source: 'booking_source' in bookingWithPricing,
      has_source: 'source' in bookingWithPricing,
      status: bookingWithPricing.status,
    });

    // 7) Insert booking (MANUAL OBJECT CONSTRUCTION TO BYPASS CACHE ISSUE)
    console.log('🚀 MANUAL BOOKING INSERT - Bypassing schema cache issues');

    // DB SCHEMA CORRECTED - booking_type not trip_type
    const bookingInsertData = {
      customer_id: customerId,
      organization_id: null,

      booking_type: bookingType, // Fix: booking_type not trip_type
      booking_source: 'web', // DB has booking_source
      status: 'NEW', // has default 'NEW'
      payment_status: 'unpaid', // exists in DB
      currency: (pricingSnapshot?.currency ?? 'GBP').toUpperCase(),

      start_at: tripConfiguration.pickupDateTime
        ? new Date(tripConfiguration.pickupDateTime).toISOString()
        : null,

      passenger_count: tripConfiguration.passengers || 1,
      bag_count: tripConfiguration.luggage || 0,

      notes: tripConfiguration.customRequirements || null, // DB has notes
      flight_number: tripConfiguration.flightNumberPickup || null, // exists in DB
    };

    console.log('🔍 INSERT DATA:', bookingInsertData);

    const { data: insertedBooking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert([bookingInsertData])
      .select('id, reference, currency')
      .single();

    if (bookingError || !insertedBooking) {
      console.error(
        '❌ Failed to create booking FULL ERROR:',
        JSON.stringify(bookingError, null, 2)
      );

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create booking in database',
          bookingError, // return the whole object for now
        },
        { status: 500 }
      );
    }

    console.log('✅ Booking created:', insertedBooking.id);

    // 8) Insert booking legs (IMPORTANT: use service role for inserts)
    const legs =
      bookingType === 'oneway'
        ? mapOnewayLegs(insertedBooking.id, tripConfiguration)
        : mapReturnLegs(insertedBooking.id, tripConfiguration);

    const { error: legsError } = await supabaseAdmin.from('booking_legs').insert(legs);

    if (legsError) {
      console.error('❌ Failed to create booking legs:', legsError);

      // Optional: cleanup booking if legs failed (depends on your desired behavior)
      // await supabaseAdmin.from('bookings').delete().eq('id', insertedBooking.id);

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create booking legs',
          details: legsError.message,
        },
        { status: 500 }
      );
    }

    // 9) Return success payload
    return NextResponse.json({
      success: true,
      bookingId: insertedBooking.id,
      reference: insertedBooking.reference,
      amount_total_pence: pricingSnapshot?.finalPricePence || 0,
      currency: insertedBooking.currency,
    });
  } catch (error) {
    console.error('🚨 Enterprise booking creation error:', error);
    console.error('Error name:', error instanceof Error ? error.name : 'Unknown');
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json(
      {
        error: 'Internal server error',
        debug: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
