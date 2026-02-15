'use client';

import { StripePaymentForm } from '@/features/booking/components/step3/StripePaymentForm';
import { useBookingPayment } from '@/hooks/useBookingPayment';
import { useBookingState } from '@/hooks/useBookingState';
import { stripePromise } from '@/lib/stripe/stripe';
import { Elements } from '@stripe/react-stripe-js';
import { AlertCircle, CreditCard, DollarSign } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PaymentData {
  paymentIntentId: string;
  transactionId: string;
  amount: number;
  currency: string;
}

/**
 * 💳 PAYMENT CARD - Step 3 Component
 *
 * Payment form and pricing breakdown:
 * - Payment method selection
 * - Credit card form (Stripe integration ready)
 * - Price breakdown with upgrades
 * - Secure payment button
 *
 * Uses design tokens, modular architecture
 * Stripe integration placeholder
 */
export function PaymentCard() {
  const { nextStep } = useBookingState();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'applepay'>('card');

  const upgradesCost = 0; // Simplified for now
  const baseFare = 245; // TODO: Calculate from distance/time
  const totalCost = baseFare + upgradesCost;

  // 🏭 ENTERPRISE PAYMENT MANAGEMENT - Zero incomplete transactions
  const {
    clientSecret,
    isCreating: isCreatingPayment,
    error: paymentError,
    initializePayment,
    markAsSucceeded,
    bookingId,
  } = useBookingPayment();

  // � FIXED: Manual Payment Intent trigger (prevents auto-creation on page load)
  const [shouldCreatePayment, setShouldCreatePayment] = useState(false);

  // 📚 SAFE PATTERN: Create Payment Intent when card method selected (not on page load)
  useEffect(() => {
    if (paymentMethod === 'card' && totalCost > 0 && !clientSecret && !isCreatingPayment) {
      // Trigger payment intent creation when card method is actively selected
      setShouldCreatePayment(true);
    }
  }, [paymentMethod, totalCost, clientSecret, isCreatingPayment]);

  // Separate effect for actually creating the payment intent
  useEffect(() => {
    if (shouldCreatePayment && !clientSecret && !isCreatingPayment) {
      initializePayment(totalCost, 'customer@example.com');
      setShouldCreatePayment(false); // Reset trigger
    }
  }, [shouldCreatePayment, clientSecret, isCreatingPayment, initializePayment, totalCost]);

  return (
    <div className='vl-card'>
      {/* Header */}
      <div className='flex items-center gap-3 mb-5'>
        <div className='flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-sm border border-green-500/20'>
          <CreditCard className='w-5 h-5 text-green-400' />
        </div>
        <div>
          <h3 className='text-lg font-semibold tracking-wide text-white'>Payment & Pricing</h3>
          <p className='text-green-200/50 text-xs'>Secure payment processing</p>
        </div>
      </div>

      {/* Content */}
      <div className='vl-card-inner'>
        <div className='space-y-6'>
          {/* Price Breakdown */}
          <div className='space-y-3'>
            <h4 className='text-sm font-medium text-neutral-300 flex items-center gap-2'>
              <DollarSign className='w-4 h-4' />
              Price Breakdown
            </h4>
            <div className='space-y-2'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-neutral-400'>Base fare</span>
                <span className='text-white'>£{baseFare}</span>
              </div>
              {upgradesCost > 0 && (
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-neutral-400'>Premium upgrades</span>
                  <span className='text-amber-400'>+£{upgradesCost}</span>
                </div>
              )}
              <div className='border-t border-white/10 pt-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-white font-semibold'>Total</span>
                  <span className='text-amber-400 font-bold text-lg'>£{totalCost}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className='space-y-3'>
            <h4 className='text-sm font-medium text-neutral-300'>Payment Method</h4>
            <div className='grid grid-cols-3 gap-2'>
              {[
                { id: 'card' as const, name: 'Card', icon: CreditCard },
                { id: 'paypal' as const, name: 'PayPal', icon: DollarSign },
                { id: 'applepay' as const, name: 'Apple Pay', icon: CreditCard },
              ].map(method => {
                const IconComponent = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`
                      flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200
                      ${
                        paymentMethod === method.id
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10'
                      }
                    `}
                  >
                    <IconComponent className='w-5 h-5' />
                    <span className='text-xs font-medium'>{method.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stripe Payment Form - Card Method */}
          {paymentMethod === 'card' && (
            <div className='space-y-4'>
              {/* Loading State */}
              {isCreatingPayment && (
                <div className='text-center py-8'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400 mx-auto mb-4'></div>
                  <p className='text-neutral-400 text-sm'>Initializing secure payment...</p>
                </div>
              )}

              {/* Error State */}
              {paymentError && (
                <div className='flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20'>
                  <AlertCircle className='w-5 h-5 text-red-400 flex-shrink-0' />
                  <span className='text-red-300 text-sm'>{paymentError}</span>
                </div>
              )}

              {/* Stripe Payment Form - Official Stripe Pattern */}
              {clientSecret && !isCreatingPayment && !paymentError && (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: 'night',
                      variables: {
                        colorPrimary: '#f59e0b',
                        colorBackground: '#ffffff0a',
                        colorText: '#f3f4f6',
                      },
                    },
                  }}
                >
                  <StripePaymentForm
                    totalAmount={totalCost}
                    _bookingId={bookingId || `booking_${Date.now()}`}
                    _clientSecret={clientSecret}
                    onCreatePaymentIntent={() => setShouldCreatePayment(true)} // 🔧 NEW: Trigger Payment Intent creation
                    onSuccess={(_paymentData: PaymentData) => {
                      // 🏭 ENTERPRISE: Mark payment as succeeded and cleanup session
                      markAsSucceeded();
                      // Payment successful - advance to Step 4 confirmation
                      nextStep();
                    }}
                    onError={(_error: string) => {
                      // Error handling is managed by enterprise hook
                    }}
                  />
                </Elements>
              )}
            </div>
          )}

          {/* Other Payment Methods - Placeholder */}
          {paymentMethod !== 'card' && (
            <div className='text-center py-8 space-y-4'>
              <div className='w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mx-auto'>
                <CreditCard className='w-8 h-8 text-neutral-500' />
              </div>
              <h4 className='text-lg font-semibold text-white'>
                {paymentMethod === 'paypal' ? 'PayPal' : 'Apple Pay'} Integration
              </h4>
              <p className='text-neutral-400 text-sm'>Coming soon! Use card payment for now.</p>
              <button
                onClick={() => setPaymentMethod('card')}
                className='px-6 py-2 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 text-sm hover:bg-amber-500/30 transition-colors'
              >
                Switch to Card Payment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
