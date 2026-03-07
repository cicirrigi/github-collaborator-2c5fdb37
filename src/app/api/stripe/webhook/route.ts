/* eslint-disable no-console */
// Console logging is intentional for webhook debugging and production monitoring
import { applyStripePaymentEvent } from '@/lib/supabase/rpc/payment.rpc';
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

    // Determine processing mode
    console.log('🔍 USE_WEBHOOK_RPC runtime =', process.env.USE_WEBHOOK_RPC);
    const useWebhookRpc = process.env.USE_WEBHOOK_RPC === 'true';
    console.log('🔍 Webhook RPC enabled?', useWebhookRpc);

    // OLD FLOW: Track processing errors to avoid marking processed_at on failure
    let oldFlowProcessingError: string | null = null;

    // OLD FLOW ONLY: Manual idempotency check
    // In RPC mode, the RPC handles idempotency internally
    if (!useWebhookRpc) {
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
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('💰 Payment succeeded:', paymentIntent.id);

        // Extract booking info from metadata
        const bookingId = paymentIntent.metadata.bookingId;
        if (!bookingId) {
          console.error('❌ Missing bookingId in payment metadata');
          return NextResponse.json(
            { error: 'Missing bookingId in payment metadata' },
            { status: 500 }
          );
        }

        // Extract charge ID for audit trail
        const chargeId =
          typeof paymentIntent.latest_charge === 'string' ? paymentIntent.latest_charge : null;

        if (useWebhookRpc) {
          // ============================================
          // NEW: Wave 1B RPC Flow (feature flagged)
          // RPC handles: idempotency, DB operations, processed_at
          // ============================================
          console.log('✅ Running NEW webhook RPC flow for payment_intent.succeeded');
          const rpcResult = await applyStripePaymentEvent(supabase, {
            stripe_event_id: event.id,
            event_type: 'payment_intent.succeeded',
            stripe_payment_intent_id: paymentIntent.id,
            livemode: event.livemode,
            event_created_at: new Date(event.created * 1000).toISOString(),
            payload: JSON.parse(JSON.stringify(event)),
            api_version: event.api_version || null,
            booking_id: bookingId,
            charge_id: chargeId,
            last_error: null,
          });

          // Handle RPC result explicitly
          if (!rpcResult.success) {
            console.error('❌ RPC failed:', rpcResult.error_message);
            return NextResponse.json(
              { error: 'Payment processing failed', details: rpcResult.error_message },
              { status: 500 }
            );
          }

          // Interpret result field
          if (rpcResult.result === 'processed') {
            console.log('✅ Payment processed successfully via RPC:', bookingId);
          } else if (rpcResult.result === 'already_processed') {
            console.log('🔄 Event already processed (idempotent):', event.id);
          } else if (rpcResult.result === 'ignored') {
            // NOTE: 'ignored' treated as benign (e.g., unsupported event type, harmless duplicate)
            // If 'ignored' can indicate real failures (booking not found, etc), this should return 500
            console.log(
              '⚠️ Event ignored by RPC:',
              rpcResult.warning_message || 'No reason provided'
            );
          }

          if (rpcResult.warning_message) {
            console.log('⚠️ RPC Warning:', rpcResult.warning_message);
          }

          // RPC mode: return immediately, RPC handled everything
          return NextResponse.json({ received: true });
        } else {
          // ============================================
          // OLD: Direct DB operations (default)
          // ============================================
          console.log('⚠️ Running OLD webhook flow (direct DB operations)');
          // Update booking status to CONFIRMED
          const { error: bookingUpdateError } = await supabase
            .from('bookings')
            .update({
              status: 'CONFIRMED',
            })
            .eq('id', bookingId);

          if (bookingUpdateError) {
            console.error('❌ Failed to update booking status:', bookingUpdateError);
            oldFlowProcessingError = `Failed to update booking: ${bookingUpdateError.message}`;
          } else {
            console.log('✅ Booking confirmed:', bookingId);
          }

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
            oldFlowProcessingError = oldFlowProcessingError
              ? `${oldFlowProcessingError}; Failed to update payment: ${paymentUpdateError.message}`
              : `Failed to update payment: ${paymentUpdateError.message}`;
          }
        }

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('💥 Payment failed:', paymentIntent.id);

        const bookingId = paymentIntent.metadata.bookingId;
        if (!bookingId) {
          console.error('❌ Missing bookingId in payment metadata');
          return NextResponse.json(
            { error: 'Missing bookingId in payment metadata' },
            { status: 500 }
          );
        }

        if (useWebhookRpc) {
          // ============================================
          // NEW: Wave 1B RPC Flow (feature flagged)
          // ============================================
          const rpcResult = await applyStripePaymentEvent(supabase, {
            stripe_event_id: event.id,
            event_type: 'payment_intent.payment_failed',
            stripe_payment_intent_id: paymentIntent.id,
            livemode: event.livemode,
            event_created_at: new Date(event.created * 1000).toISOString(),
            payload: JSON.parse(JSON.stringify(event)),
            api_version: event.api_version || null,
            booking_id: bookingId,
            charge_id: null,
            last_error: paymentIntent.last_payment_error?.message ?? null,
          });

          if (!rpcResult.success) {
            console.error('❌ RPC failed:', rpcResult.error_message);
            return NextResponse.json(
              { error: 'Payment failure processing failed', details: rpcResult.error_message },
              { status: 500 }
            );
          }

          if (rpcResult.result === 'processed') {
            console.log('✅ Payment failure processed via RPC:', bookingId);
          } else if (rpcResult.result === 'already_processed') {
            console.log('🔄 Event already processed:', event.id);
          } else if (rpcResult.result === 'ignored') {
            console.log('⚠️ Event ignored by RPC:', rpcResult.warning_message);
          }

          if (rpcResult.warning_message) {
            console.log('⚠️ RPC Warning:', rpcResult.warning_message);
          }

          return NextResponse.json({ received: true });
        } else {
          // ============================================
          // OLD: Direct DB operations (default)
          // ============================================
          // Update booking status to PAYMENT_FAILED
          const { error: bookingUpdateError } = await supabase
            .from('bookings')
            .update({
              status: 'PAYMENT_FAILED',
            })
            .eq('id', bookingId);

          if (bookingUpdateError) {
            console.error('❌ Failed to update booking status:', bookingUpdateError);
            oldFlowProcessingError = `Failed to update booking: ${bookingUpdateError.message}`;
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
            oldFlowProcessingError = oldFlowProcessingError
              ? `${oldFlowProcessingError}; Failed to update payment: ${paymentUpdateError.message}`
              : `Failed to update payment: ${paymentUpdateError.message}`;
          }
        }

        break;
      }

      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('❌ Payment canceled:', paymentIntent.id);

        const bookingId = paymentIntent.metadata.bookingId;
        if (!bookingId) {
          console.error('❌ Missing bookingId in payment metadata');
          return NextResponse.json(
            { error: 'Missing bookingId in payment metadata' },
            { status: 500 }
          );
        }

        if (useWebhookRpc) {
          // ============================================
          // NEW: Wave 1B RPC Flow (feature flagged)
          // ============================================
          const rpcResult = await applyStripePaymentEvent(supabase, {
            stripe_event_id: event.id,
            event_type: 'payment_intent.canceled',
            stripe_payment_intent_id: paymentIntent.id,
            livemode: event.livemode,
            event_created_at: new Date(event.created * 1000).toISOString(),
            payload: JSON.parse(JSON.stringify(event)),
            api_version: event.api_version || null,
            booking_id: bookingId,
            charge_id: null,
            last_error: null,
          });

          if (!rpcResult.success) {
            console.error('❌ RPC failed:', rpcResult.error_message);
            return NextResponse.json(
              { error: 'Payment cancellation processing failed', details: rpcResult.error_message },
              { status: 500 }
            );
          }

          if (rpcResult.result === 'processed') {
            console.log('✅ Payment cancellation processed via RPC:', bookingId);
          } else if (rpcResult.result === 'already_processed') {
            console.log('🔄 Event already processed:', event.id);
          } else if (rpcResult.result === 'ignored') {
            console.log('⚠️ Event ignored by RPC:', rpcResult.warning_message);
          }

          if (rpcResult.warning_message) {
            console.log('⚠️ RPC Warning:', rpcResult.warning_message);
          }

          return NextResponse.json({ received: true });
        } else {
          // ============================================
          // OLD: Direct DB operations (default)
          // ============================================
          // Update booking status to PAYMENT_FAILED (user can retry payment)
          const { error: bookingUpdateError } = await supabase
            .from('bookings')
            .update({
              status: 'PAYMENT_FAILED',
            })
            .eq('id', bookingId);

          if (bookingUpdateError) {
            console.error('❌ Failed to update booking status:', bookingUpdateError);
            oldFlowProcessingError = `Failed to update booking: ${bookingUpdateError.message}`;
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
            oldFlowProcessingError = oldFlowProcessingError
              ? `${oldFlowProcessingError}; Failed to update payment: ${paymentUpdateError.message}`
              : `Failed to update payment: ${paymentUpdateError.message}`;
          }
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

    // OLD FLOW ONLY: Mark event as processed or failed
    // In RPC mode, this is handled by the RPC itself and we've already returned
    if (!useWebhookRpc) {
      if (oldFlowProcessingError) {
        // Processing failed, record error and return 500 to trigger Stripe retry
        await supabase
          .from('stripe_events')
          .update({ processing_error: oldFlowProcessingError })
          .eq('stripe_event_id', event.id);

        return NextResponse.json(
          { error: 'Event processing failed', details: oldFlowProcessingError },
          { status: 500 }
        );
      }

      // Processing succeeded, mark as processed
      await supabase
        .from('stripe_events')
        .update({
          processed_at: new Date().toISOString(),
          processing_error: null,
        })
        .eq('stripe_event_id', event.id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('🚨 Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
