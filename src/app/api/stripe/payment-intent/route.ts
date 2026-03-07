/* eslint-disable no-console */
// Console logging intentional for payment intent creation debugging
import { createPaymentIntentRecord } from '@/lib/supabase/rpc/payment.rpc';
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
      .select('id, customer_id, organization_id, currency, reference, status')
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

    // 5) Booking status guardrail - prevent double-pay
    if (booking.status === 'CONFIRMED') {
      return NextResponse.json({ error: 'Booking already confirmed and paid' }, { status: 409 });
    }
    if (booking.status === 'CANCELLED' || booking.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Cannot create payment for cancelled/completed booking' },
        { status: 409 }
      );
    }
    if (booking.status === 'IN_PROGRESS') {
      return NextResponse.json(
        { error: 'Booking is in progress, payment not allowed' },
        { status: 409 }
      );
    }

    // Get amount from frontend (booking doesn't store amount in current schema)
    const rawAmount = body?.amount ?? body?.amount_total_pence;
    const amount = Number(rawAmount);

    if (!Number.isInteger(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Invalid booking amount' }, { status: 400 });
    }

    // Separate currency handling: DB uppercase, Stripe lowercase
    const dbCurrency = (booking.currency || 'GBP').toUpperCase();

    // Validate currency format (3-letter uppercase)
    if (!/^[A-Z]{3}$/.test(dbCurrency)) {
      return NextResponse.json({ error: 'Invalid booking currency' }, { status: 400 });
    }

    const stripeCurrency = dbCurrency.toLowerCase();

    // 6) Calculate next attempt number for retry logic
    const { data: existingAttempts } = await supabaseAdmin
      .from('booking_payments')
      .select('attempt_no')
      .eq('booking_id', bookingId)
      .order('attempt_no', { ascending: false })
      .limit(1);

    const nextAttemptNo = existingAttempts?.[0]?.attempt_no
      ? existingAttempts[0].attempt_no + 1
      : 1;

    // 7) Generate attempt-based idempotency key
    const idempotencyKey = `pi_${bookingId}_${amount}_${nextAttemptNo}`;

    // 8) Create PI (idempotent)
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount,
        currency: stripeCurrency, // Use lowercase for Stripe
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

    // 9) Insert booking_payments - Wave 1A: RPC vs Direct
    const useRpc = process.env.USE_PAYMENT_INTENT_RPC === 'true';

    if (useRpc) {
      // ============================================
      // NEW: Wave 1A RPC Flow (feature flagged)
      // ============================================
      const rpcResult = await createPaymentIntentRecord(supabaseAdmin, {
        booking_id: bookingId,
        stripe_payment_intent_id: paymentIntent.id,
        amount_pence: amount,
        currency: dbCurrency,
        receipt_email: receiptEmail,
        idempotency_key: idempotencyKey,
        attempt_no: nextAttemptNo,
        organization_id: booking.organization_id,
        livemode: paymentIntent.livemode,
        metadata: {
          paymentIntentId: paymentIntent.id,
          reference: booking.reference,
          idempotencyKey,
          attemptNo: nextAttemptNo,
        },
      });

      if (!rpcResult.success) {
        console.error('❌ RPC create_payment_intent_record failed:', rpcResult.error_message);
        return NextResponse.json(
          { error: 'Failed to save payment record', details: rpcResult.error_message },
          { status: 500 }
        );
      }

      // RPC handles both payment record creation AND booking status update
      // No additional status update needed
    } else {
      // ============================================
      // OLD: Direct DB operations (default)
      // ============================================
      const { error: paymentUpsertError } = await supabaseAdmin.from('booking_payments').upsert(
        {
          booking_id: bookingId,
          stripe_payment_intent_id: paymentIntent.id,
          organization_id: booking.organization_id,
          amount_pence: amount,
          currency: dbCurrency,
          status: 'pending',
          receipt_email: receiptEmail,
          idempotency_key: idempotencyKey,
          attempt_no: nextAttemptNo,
          livemode: paymentIntent.livemode,
          metadata: {
            paymentIntentId: paymentIntent.id,
            reference: booking.reference,
            idempotencyKey,
            attemptNo: nextAttemptNo,
          },
        },
        { onConflict: 'idempotency_key' }
      );

      if (paymentUpsertError) {
        console.error('❌ Failed to upsert booking_payments:', paymentUpsertError);
        return NextResponse.json({ error: 'Failed to save payment record' }, { status: 500 });
      }

      // Update booking status to PENDING_PAYMENT (for NEW or PAYMENT_FAILED bookings)
      if (booking.status === 'NEW' || booking.status === 'PAYMENT_FAILED') {
        const { error: statusUpdateError } = await supabaseAdmin
          .from('bookings')
          .update({ status: 'PENDING_PAYMENT' })
          .eq('id', bookingId);

        if (statusUpdateError) {
          console.error('❌ Failed to update booking status:', statusUpdateError);
        }
      }
    }

    // Safety check: Stripe should always provide client_secret
    if (!paymentIntent.client_secret) {
      return NextResponse.json({ error: 'Missing payment intent client secret' }, { status: 500 });
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      currency: dbCurrency, // Return uppercase currency to match DB
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
