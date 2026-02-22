import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const bookingId: string | undefined = body?.bookingId;

    if (!bookingId) {
      return NextResponse.json({ error: 'Missing required field: bookingId' }, { status: 400 });
    }

    // 1) Auth check (normal session-aware client)
    const supabase = await createSupabaseServerClient();
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();

    if (authError || !session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const userId = session.user.id;
    const receiptEmail = session.user.email ?? null;

    // 2) Admin client
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    // 3) Fetch booking (1) – keep it simple + robust
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select('id, customer_id, currency, reference, status')
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // 4) Ownership check (2)
    const { data: customer, error: customerError } = await supabaseAdmin
      .from('customers')
      .select('id')
      .eq('id', booking.customer_id)
      .eq('auth_user_id', userId)
      .single();

    if (customerError || !customer) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Get amount from frontend (booking doesn't store amount in current schema)
    const amount = body?.amount || body?.amount_total_pence || 10000; // fallback to £100
    if (!Number.isInteger(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Invalid booking amount' }, { status: 400 });
    }

    // Stripe expects lowercase ISO currency
    const currency = String(booking.currency || 'GBP').toLowerCase();

    // 5) Stable idempotency key
    const headerKey = request.headers.get('Idempotency-Key');
    const idempotencyKey = headerKey || `pi_${bookingId}`;

    // 6) Create PI (idempotent)
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount,
        currency,
        ...(receiptEmail ? { receipt_email: receiptEmail } : {}),
        metadata: {
          bookingId,
          reference: booking.reference ?? '',
          userId,
        },
        automatic_payment_methods: { enabled: true },
      },
      { idempotencyKey }
    );

    // 7) Upsert booking_payments (SAFE on retries)
    const { error: paymentUpsertError } = await supabaseAdmin.from('booking_payments').upsert(
      {
        booking_id: bookingId,
        stripe_payment_intent_id: paymentIntent.id,
        amount_pence: amount,
        currency,
        status: 'pending',
        receipt_email: receiptEmail,
        metadata: {
          paymentIntentId: paymentIntent.id,
          reference: booking.reference,
          idempotencyKey,
        },
      },
      { onConflict: 'stripe_payment_intent_id' }
    );

    if (paymentUpsertError) {
      console.error('❌ Failed to upsert booking_payments:', paymentUpsertError);
      return NextResponse.json({ error: 'Failed to save payment record' }, { status: 500 });
    }

    // 8) Update booking status from 'NEW' to 'PENDING_PAYMENT' (ACTUAL DB SCHEMA)
    if (booking.status === 'NEW') {
      const { error: statusUpdateError } = await supabaseAdmin
        .from('bookings')
        .update({ status: 'PENDING_PAYMENT' })
        .eq('id', bookingId);

      if (statusUpdateError) {
        console.error('❌ Failed to update booking status:', statusUpdateError);
      }
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      currency,
      amount,
    });
  } catch (error) {
    console.error('Stripe Payment Intent Error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to create payment intent', details: msg },
      { status: 500 }
    );
  }
}
