import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

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
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

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

        // Update booking status to CONFIRMED and payment_status to succeeded
        const { error: bookingUpdateError } = await supabase
          .from('bookings')
          .update({
            payment_status: 'succeeded',
            status: 'CONFIRMED',
          })
          .eq('id', bookingId);

        if (bookingUpdateError) {
          console.error('❌ Failed to update booking status:', bookingUpdateError);
        } else {
          console.log('✅ Booking confirmed:', bookingId);
        }

        // Update booking_payments table if it exists
        const { error: paymentUpdateError } = await supabase
          .from('booking_payments')
          .update({
            status: 'succeeded',
          })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        if (
          paymentUpdateError &&
          !paymentUpdateError.message.includes('relation "booking_payments" does not exist')
        ) {
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

        // Update booking payment_status to failed
        const { error: bookingUpdateError } = await supabase
          .from('bookings')
          .update({
            payment_status: 'failed',
          })
          .eq('id', bookingId);

        if (bookingUpdateError) {
          console.error('❌ Failed to update booking status:', bookingUpdateError);
        } else {
          console.log('✅ Booking marked as payment failed:', bookingId);
        }

        // Update booking_payments table if it exists
        const { error: paymentUpdateError } = await supabase
          .from('booking_payments')
          .update({
            status: 'failed',
          })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        if (
          paymentUpdateError &&
          !paymentUpdateError.message.includes('relation "booking_payments" does not exist')
        ) {
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

        // Update booking payment_status to canceled
        const { error: bookingUpdateError } = await supabase
          .from('bookings')
          .update({
            payment_status: 'canceled',
          })
          .eq('id', bookingId);

        if (bookingUpdateError) {
          console.error('❌ Failed to update booking status:', bookingUpdateError);
        } else {
          console.log('✅ Booking marked as payment canceled:', bookingId);
        }

        // Update booking_payments table if it exists
        const { error: paymentUpdateError } = await supabase
          .from('booking_payments')
          .update({
            status: 'canceled',
          })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        if (
          paymentUpdateError &&
          !paymentUpdateError.message.includes('relation "booking_payments" does not exist')
        ) {
          console.error('❌ Failed to update booking_payments:', paymentUpdateError);
        }

        break;
      }

      default:
        console.log('ℹ️ Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('🚨 Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
