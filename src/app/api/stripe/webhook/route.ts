import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('❌ Missing Stripe signature');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Create service role client for database operations (bypasses RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    // Idempotency: Insert event into stripe_events (prevents double processing)
    const { error: eventInsertError } = await supabase.from('stripe_events').insert({
      stripe_event_id: event.id,
      event_type: event.type,
      livemode: event.livemode,
      api_version: event.api_version,
      payload: JSON.parse(JSON.stringify(event)),
      booking_id: (event.data?.object as any)?.metadata?.bookingId || null,
      booking_payment_id: null,
      organization_id: null,
    });

    // If event already exists, we've processed it before
    if (eventInsertError?.code === '23505') {
      console.log('🔄 Event already processed:', event.id);
      return NextResponse.json({ received: true });
    }

    if (eventInsertError) {
      console.error('❌ Failed to insert stripe_event:', eventInsertError);
      return NextResponse.json({ error: 'Failed to log event' }, { status: 500 });
    }

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('💰 Payment succeeded:', paymentIntent.id);

        // Extract booking info from metadata
        const bookingId = paymentIntent.metadata.bookingId;
        if (!bookingId) {
          console.error('❌ Missing bookingId in payment metadata');
          break;
        }

        // Update booking status to CONFIRMED
        const { error: bookingUpdateError } = await supabase
          .from('bookings')
          .update({
            status: 'CONFIRMED',
          })
          .eq('id', bookingId);

        if (bookingUpdateError) {
          console.error('❌ Failed to update booking status:', bookingUpdateError);
        } else {
          console.log('✅ Booking confirmed:', bookingId);
        }

        // Extract charge ID for audit trail
        const chargeId =
          typeof paymentIntent.latest_charge === 'string' ? paymentIntent.latest_charge : null;

        // Update booking_payments table with success details
        const { error: paymentUpdateError } = await supabase
          .from('booking_payments')
          .update({
            status: 'succeeded',
            captured_at: new Date().toISOString(),
            livemode: paymentIntent.livemode,
            stripe_charge_id: chargeId,
          })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        if (paymentUpdateError) {
          console.error('❌ Failed to update booking_payments:', paymentUpdateError);
        }

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('💥 Payment failed:', paymentIntent.id);

        const bookingId = paymentIntent.metadata.bookingId;
        if (!bookingId) {
          console.error('❌ Missing bookingId in payment metadata');
          break;
        }

        // Update booking status to PAYMENT_FAILED
        const { error: bookingUpdateError } = await supabase
          .from('bookings')
          .update({
            status: 'PAYMENT_FAILED',
          })
          .eq('id', bookingId);

        if (bookingUpdateError) {
          console.error('❌ Failed to update booking status:', bookingUpdateError);
        } else {
          console.log('✅ Booking marked as payment failed:', bookingId);
        }

        // Update booking_payments table with failure details
        const { error: paymentUpdateError } = await supabase
          .from('booking_payments')
          .update({
            status: 'failed',
            failed_at: new Date().toISOString(),
            last_error: paymentIntent.last_payment_error?.message ?? null,
            livemode: paymentIntent.livemode,
          })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        if (paymentUpdateError) {
          console.error('❌ Failed to update booking_payments:', paymentUpdateError);
        }

        break;
      }

      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('❌ Payment canceled:', paymentIntent.id);

        const bookingId = paymentIntent.metadata.bookingId;
        if (!bookingId) {
          console.error('❌ Missing bookingId in payment metadata');
          break;
        }

        // Update booking status to PAYMENT_FAILED (user can retry payment)
        const { error: bookingUpdateError } = await supabase
          .from('bookings')
          .update({
            status: 'PAYMENT_FAILED',
          })
          .eq('id', bookingId);

        if (bookingUpdateError) {
          console.error('❌ Failed to update booking status:', bookingUpdateError);
        } else {
          console.log('✅ Booking marked as payment canceled:', bookingId);
        }

        // Update booking_payments table with cancellation details
        const { error: paymentUpdateError } = await supabase
          .from('booking_payments')
          .update({
            status: 'canceled',
            canceled_at: new Date().toISOString(),
            livemode: paymentIntent.livemode,
          })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        if (paymentUpdateError) {
          console.error('❌ Failed to update booking_payments:', paymentUpdateError);
        }

        break;
      }

      case 'charge.updated': {
        const charge = event.data.object as Stripe.Charge;
        console.log('💳 Charge updated:', charge.id);

        // Extract balance_transaction ID
        const balanceTransactionId =
          typeof charge.balance_transaction === 'string' ? charge.balance_transaction : null;

        if (!balanceTransactionId) {
          console.log('⚠️ No balance_transaction found in charge');
          break;
        }

        // Get payment intent ID to find booking_payment
        const paymentIntentId =
          typeof charge.payment_intent === 'string' ? charge.payment_intent : null;

        if (!paymentIntentId) {
          console.log('⚠️ No payment_intent found in charge');
          break;
        }

        // Check if fee already exists (idempotency)
        const { data: existingPayment } = await supabase
          .from('booking_payments')
          .select('metadata')
          .eq('stripe_payment_intent_id', paymentIntentId)
          .single();

        if (existingPayment?.metadata?.stripe_fee_pence) {
          console.log('✓ Stripe fee already captured for payment:', paymentIntentId);
          break;
        }

        try {
          // Retrieve balance transaction from Stripe
          const balanceTransaction =
            await stripe.balanceTransactions.retrieve(balanceTransactionId);

          const stripeFee = balanceTransaction.fee; // Already in pence for GBP

          // Get current metadata and merge with fee
          const currentMetadata = existingPayment?.metadata || {};
          const updatedMetadata = {
            ...currentMetadata,
            stripe_fee_pence: stripeFee,
            stripe_fee_source: 'stripe_api',
            stripe_fee_retrieved_at: new Date().toISOString(),
          };

          // Update booking_payments with Stripe fee
          const { error: feeUpdateError } = await supabase
            .from('booking_payments')
            .update({
              metadata: updatedMetadata,
            })
            .eq('stripe_payment_intent_id', paymentIntentId);

          if (feeUpdateError) {
            console.error('❌ Failed to update Stripe fee:', feeUpdateError);
          } else {
            console.log(`✅ Stripe fee captured: ${stripeFee} pence for ${paymentIntentId}`);
          }
        } catch (error) {
          console.error('❌ Failed to retrieve balance transaction:', error);
        }

        break;
      }

      default:
        console.log('ℹ️ Unhandled event type:', event.type);
    }

    // Mark event as processed
    await supabase
      .from('stripe_events')
      .update({ processed_at: new Date().toISOString() })
      .eq('stripe_event_id', event.id);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('🚨 Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
