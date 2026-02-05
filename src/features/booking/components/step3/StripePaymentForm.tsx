'use client';

import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { AlertCircle, CheckCircle, Lock } from 'lucide-react';
import { FormEvent, useState } from 'react';

interface PaymentData {
  paymentIntentId: string;
  transactionId: string;
  amount: number;
  currency: string;
}

interface StripePaymentFormProps {
  totalAmount: number;
  _bookingId: string;
  _clientSecret: string;
  onSuccess?: (paymentData: PaymentData) => void;
  onError?: (error: string) => void;
}

export function StripePaymentForm({
  totalAmount,
  _bookingId,
  _clientSecret,
  onSuccess,
  onError,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setPaymentError(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking/confirmation`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setPaymentError(error.message || 'Payment failed');
        onError?.(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setPaymentSuccess(true);

        // Call success callback with payment data after brief success display
        setTimeout(() => {
          onSuccess?.({
            paymentIntentId: paymentIntent.id,
            transactionId: paymentIntent.id,
            amount: paymentIntent.amount / 100, // Convert from cents
            currency: paymentIntent.currency,
          });
        }, 2000);
      }
    } catch (_err) {
      setPaymentError('An unexpected error occurred');
      onError?.('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className='text-center py-8 space-y-4'>
        <CheckCircle className='w-16 h-16 text-green-400 mx-auto' />
        <h3 className='text-lg font-semibold text-white'>Payment Successful!</h3>
        <p className='text-neutral-400'>Redirecting to confirmation page...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Payment Element */}
      <div className='space-y-4'>
        <h4 className='text-sm font-medium text-neutral-300'>Card Details</h4>
        <div className='p-4 rounded-xl bg-white/5 border border-amber-300/30'>
          <PaymentElement
            options={{
              layout: 'tabs',
            }}
          />
        </div>
      </div>

      {/* Error Display */}
      {paymentError && (
        <div className='flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20'>
          <AlertCircle className='w-5 h-5 text-red-400 flex-shrink-0' />
          <span className='text-red-300 text-sm'>{paymentError}</span>
        </div>
      )}

      {/* Payment Button */}
      <button
        type='submit'
        disabled={!stripe || isLoading}
        className='w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold text-base transition-all duration-300 hover:from-amber-400 hover:to-yellow-400 hover:shadow-lg hover:shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed'
      >
        <Lock className='w-5 h-5' />
        {isLoading ? 'Processing...' : `Confirm & Pay £${totalAmount}`}
      </button>

      {/* Security Notice */}
      <div className='flex items-center justify-center gap-2 text-xs text-neutral-500'>
        <Lock className='w-3 h-3' />
        <span>Secured by Stripe & 256-bit SSL encryption</span>
      </div>
    </form>
  );
}
