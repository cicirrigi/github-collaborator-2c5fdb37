import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: NextRequest) {
  try {
    const { amount, bookingId, customerEmail } = await request.json();

    // Validate required fields
    if (!amount || !bookingId) {
      return NextResponse.json(
        { error: 'Missing required fields: amount and bookingId' },
        { status: 400 }
      );
    }

    // Get idempotency key from headers to prevent duplicate payment intents
    const idempotencyKey = request.headers.get('Idempotency-Key');

    // Create payment intent with explicit idempotency key
    const paymentIntentOptions = {
      amount: Math.round(amount * 100), // Convert to pence/cents
      currency: 'gbp',
      metadata: {
        bookingId,
        customerEmail: customerEmail || '',
      },
      automatic_payment_methods: {
        enabled: true,
      },
    };

    // Only pass idempotency key if we have one to prevent Stripe SDK auto-retry duplicates
    const requestOptions = idempotencyKey ? { idempotencyKey } : {};
    const paymentIntent = await stripe.paymentIntents.create(paymentIntentOptions, requestOptions);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Stripe Payment Intent Error:', error);

    // Return more detailed error information for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        error: 'Failed to create payment intent',
        details: errorMessage,
        debug: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 }
    );
  }
}
