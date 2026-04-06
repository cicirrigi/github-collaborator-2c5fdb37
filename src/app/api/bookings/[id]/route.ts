import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * GET /api/bookings/[id] - Get single booking by ID
 * Used by PaymentCard for polling booking status after payment
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

    const user = session.user;

    // Validate bookingId format (basic UUID check)
    if (!bookingId || bookingId.length < 36) {
      return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    // Find customer for security check (handle potential duplicates)
    const { data: customerData, error: customerError } = await supabaseAdmin
      .from('customers')
      .select('id')
      .eq('auth_user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(1);

    if (customerError || !customerData || customerData.length === 0) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const customer = customerData[0];
    if (!customer || !customer.id) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Get specific booking with security check (customer must own the booking)
    // CORRECTED: Using only fields that actually exist in DB schema
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select(
        `
        id,
        reference,
        currency,
        status,
        booking_type,
        created_at,
        updated_at
      `
      )
      .eq('id', bookingId)
      .eq('customer_id', customer.id) // Security: user can only see their own bookings
      .single();

    if (bookingError) {
      if (bookingError.code === 'PGRST116') {
        // No rows returned
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
      }
      return NextResponse.json(
        { error: 'Failed to fetch booking', details: bookingError.message },
        { status: 500 }
      );
    }

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ booking });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: 'Internal server error', debug: msg }, { status: 500 });
  }
}
