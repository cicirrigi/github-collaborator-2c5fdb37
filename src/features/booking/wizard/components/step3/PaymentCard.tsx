'use client';

import { StripePaymentForm } from '@/features/booking/components/step3/StripePaymentForm';
import { useBookingPayment } from '@/hooks/useBookingPayment';
import { useBookingState } from '@/hooks/useBookingState';
import { stripePromise } from '@/lib/stripe/stripe';
import { Elements } from '@stripe/react-stripe-js';
import { AlertCircle, CreditCard, DollarSign } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface PaymentData {
  paymentIntentId: string;
  transactionId: string;
  amount: number;
  currency: string;
}

export function PaymentCard() {
  const {
    nextStep,
    tripConfiguration,
    bookingType,
    pricingState,
    getPriceForVehicle,
    getFleetTotalPrice,
  } = useBookingState();

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'applepay'>('card');
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  const [bookingData, setBookingData] = useState<{
    bookingId: string;
    reference: string;
    amount_total_pence: number;
    currency: string;
  } | null>(null);
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);
  const isCheckingStatusRef = useRef(false);

  // Anti-duplicate guards (important in React strict mode)
  const bookingCreateStartedRef = useRef(false);
  const paymentInitStartedRef = useRef(false);

  const {
    clientSecret,
    isCreating: isCreatingPayment,
    error: paymentError,
    initializePayment,
    markAsSucceeded,
    abandonPayment,
  } = useBookingPayment();

  const createBooking = async () => {
    if (bookingCreateStartedRef.current) return;
    if (isCreatingBooking || bookingData) return;

    try {
      setIsCreatingBooking(true);
      bookingCreateStartedRef.current = true;

      // 🔍 DEBUG: Log fleet booking payload structure
      console.log('🚛 FLEET BOOKING PAYLOAD DEBUG:', {
        bookingType,
        tripConfiguration: JSON.stringify(tripConfiguration, null, 2),
        fleetSelection: tripConfiguration.fleetSelection,
        selectedVehicle: tripConfiguration.selectedVehicle,
      });

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripConfiguration,
          bookingType,
          pricingSnapshot: {
            finalPricePence: (() => {
              // Fleet bookings use different pricing logic
              if (bookingType === 'fleet') {
                const fleetPriceGBP = getFleetTotalPrice();
                return fleetPriceGBP ? Math.round(fleetPriceGBP * 100) : 0;
              }

              // Single vehicle bookings use selectedVehicle
              const categoryId = tripConfiguration?.selectedVehicle?.category?.id;
              if (!categoryId) return 0;

              const priceGBP = getPriceForVehicle(categoryId);
              return priceGBP ? Math.round(priceGBP * 100) : 0;
            })(),
            currency: 'GBP',
            routeData: pricingState?.routeData
              ? {
                  distance: pricingState.routeData.distance ?? null,
                  duration: pricingState.routeData.duration ?? null,
                  isCalculated: !!pricingState.routeData.isCalculated,
                }
              : undefined,
          },
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      const rawText = await response.text();

      let data: any = null;
      try {
        data = contentType.includes('application/json') ? JSON.parse(rawText) : rawText;
      } catch {
        data = { parseError: true, rawText };
      }

      console.log('🧾 BOOKING RESPONSE', {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        data,
      });

      if (!response.ok) {
        bookingCreateStartedRef.current = false; // allow retry
        throw new Error(typeof data === 'string' ? data : JSON.stringify(data));
      }

      if (data.success) {
        setBookingData({
          bookingId: data.bookingId,
          reference: data.reference,
          amount_total_pence: data.amount_total_pence,
          currency: data.currency || 'GBP',
        });
      } else {
        bookingCreateStartedRef.current = false; // allow retry
        console.error('Booking create failed:', data);
      }
    } catch (e) {
      bookingCreateStartedRef.current = false; // allow retry
      console.error('Booking create failed FULL:', e);
    } finally {
      setIsCreatingBooking(false);
    }
  };

  // Create booking + payment intent when user clicks "Continue to Payment"
  const handleContinueToPayment = async () => {
    if (isCreatingBooking || bookingData) return;

    // First create booking
    await createBooking();

    // Payment intent creation will be handled after booking is created
  };

  // Create payment intent AFTER booking is created (automatic)
  useEffect(() => {
    if (!bookingData) return;
    if (clientSecret) return;
    if (isCreatingPayment) return;
    if (paymentInitStartedRef.current) return;

    paymentInitStartedRef.current = true;

    initializePayment({
      bookingId: bookingData.bookingId,
      amount: bookingData.amount_total_pence, // Pass amount to Stripe endpoint
    }).catch(() => {
      paymentInitStartedRef.current = false; // allow retry
    });
  }, [bookingData, clientSecret, isCreatingPayment, initializePayment]);

  // Fetch booking status after booking is created
  const fetchBookingStatus = useCallback(async (bookingId: string) => {
    if (isCheckingStatusRef.current) return null;

    isCheckingStatusRef.current = true;
    try {
      const response = await fetch(`/api/bookings/${bookingId}`);
      if (!response.ok) return null;

      const data = await response.json();
      const status = data.booking?.status ?? null;
      setBookingStatus(status);
      return status; // Return fresh status for polling
    } catch (error) {
      console.error('Failed to fetch booking status:', error);
      return null;
    } finally {
      isCheckingStatusRef.current = false;
    }
  }, []);

  // Check booking status when bookingData is available
  useEffect(() => {
    if (bookingData?.bookingId && !bookingStatus) {
      fetchBookingStatus(bookingData.bookingId);
    }
  }, [bookingData?.bookingId, bookingStatus, fetchBookingStatus]);

  // Handle payment success - refresh booking status from webhook
  const handlePaymentSuccess = async (_paymentData: PaymentData) => {
    if (!bookingData) return;

    // Mark payment as succeeded in session
    markAsSucceeded();

    // Poll booking status to catch webhook update (max 10 seconds)
    let pollAttempts = 0;
    const maxPollAttempts = 5;

    const pollStatus = async (): Promise<void> => {
      pollAttempts++;
      const status = await fetchBookingStatus(bookingData.bookingId);

      if (status === 'CONFIRMED') {
        // Payment confirmed - proceed to receipt
        nextStep();
        return;
      }

      if (pollAttempts < maxPollAttempts) {
        // Use shorter delay for null responses (network issues) vs real attempts
        const delay = status === null ? 500 : 2000;
        setTimeout(pollStatus, delay);
      } else {
        // Timeout - stop polling, don't advance
        console.log('⏰ Payment processing timeout - webhook may be delayed or network issues');
        // Could show UI message: "Processing payment, please wait or refresh..."
        // Don't call nextStep() - safer to keep user on payment page
      }
    };

    // Start polling for webhook updates
    setTimeout(pollStatus, 1000); // Initial 1 second delay for webhook processing
  };

  // Handle retry payment for failed payments
  const handleRetryPayment = async () => {
    if (!bookingData) return;

    // Reset payment state completely to allow clean retry
    abandonPayment();
    paymentInitStartedRef.current = false;
    setBookingStatus(null); // Clear failed status for fresh UI state

    // Initialize new payment attempt
    await initializePayment({
      bookingId: bookingData.bookingId,
      amount: bookingData.amount_total_pence,
    });
  };

  const totalPounds = bookingData ? bookingData.amount_total_pence / 100 : 0;

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
          {/* Price breakdown */}
          <div className='space-y-3'>
            <h4 className='text-sm font-medium text-neutral-300 flex items-center gap-2'>
              <DollarSign className='w-4 h-4' />
              Price Breakdown
            </h4>

            <div className='space-y-2'>
              {bookingData ? (
                <>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-neutral-400'>Journey fare</span>
                    <span className='text-white'>£{totalPounds.toFixed(2)}</span>
                  </div>
                  <div className='border-t border-white/10 pt-2'>
                    <div className='flex items-center justify-between'>
                      <span className='text-white font-semibold'>Total</span>
                      <span className='text-amber-400 font-bold text-lg'>
                        £{totalPounds.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className='text-center py-4'>
                  <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-amber-400 mx-auto mb-2' />
                  <p className='text-neutral-400 text-sm'>
                    {isCreatingBooking ? 'Creating booking...' : 'Calculating fare...'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Payment method */}
          <div className='space-y-3'>
            <h4 className='text-sm font-medium text-neutral-300'>Payment Method</h4>
            <div className='grid grid-cols-3 gap-2'>
              {[
                { id: 'card' as const, name: 'Card', icon: CreditCard },
                { id: 'paypal' as const, name: 'PayPal', icon: DollarSign },
                { id: 'applepay' as const, name: 'Apple Pay', icon: CreditCard },
              ].map(method => {
                const IconComponent = method.icon;
                const active = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={[
                      'flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200',
                      active
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10',
                    ].join(' ')}
                  >
                    <IconComponent className='w-5 h-5' />
                    <span className='text-xs font-medium'>{method.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Booking Status-Based UI */}
          {bookingData && bookingStatus === 'CONFIRMED' && (
            <div className='text-center py-8 space-y-4'>
              <div className='w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto'>
                <CreditCard className='w-8 h-8 text-green-400' />
              </div>
              <h4 className='text-lg font-semibold text-white'>Booking Confirmed & Paid</h4>
              <p className='text-neutral-400 text-sm'>
                Your booking is confirmed. You&apos;ll receive a confirmation email shortly.
              </p>
              <button
                onClick={() => nextStep()}
                className='px-8 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors'
              >
                Continue to Receipt
              </button>
            </div>
          )}

          {bookingData && bookingStatus === 'PAYMENT_FAILED' && (
            <div className='text-center py-8 space-y-4'>
              <div className='w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto'>
                <AlertCircle className='w-8 h-8 text-red-400' />
              </div>
              <h4 className='text-lg font-semibold text-white'>Payment Failed</h4>
              <p className='text-neutral-400 text-sm'>
                Your payment could not be processed. Please try again with a different card or
                payment method.
              </p>
              <button
                onClick={handleRetryPayment}
                className='px-8 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors'
              >
                Retry Payment
              </button>
            </div>
          )}

          {/* Card payment - only show if not confirmed or failed */}
          {paymentMethod === 'card' &&
            bookingStatus !== 'CONFIRMED' &&
            bookingStatus !== 'PAYMENT_FAILED' && (
              <div className='space-y-4'>
                {!bookingData && !isCreatingBooking && (
                  <div className='text-center py-6'>
                    <button
                      onClick={handleContinueToPayment}
                      className='px-8 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors'
                    >
                      Continue to Payment
                    </button>
                    <p className='text-neutral-400 text-xs mt-2'>
                      Click to create your booking and initialize secure payment
                    </p>
                  </div>
                )}

                {isCreatingBooking && (
                  <div className='text-center py-8'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400 mx-auto mb-4' />
                    <p className='text-neutral-400 text-sm'>Creating your booking...</p>
                  </div>
                )}

                {isCreatingPayment && (
                  <div className='text-center py-8'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400 mx-auto mb-4' />
                    <p className='text-neutral-400 text-sm'>Initializing secure payment...</p>
                  </div>
                )}

                {paymentError && (
                  <div className='flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20'>
                    <AlertCircle className='w-5 h-5 text-red-400 flex-shrink-0' />
                    <span className='text-red-300 text-sm'>{paymentError}</span>
                  </div>
                )}

                {clientSecret && bookingData && !isCreatingPayment && !paymentError && (
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
                      totalAmount={totalPounds}
                      _bookingId={bookingData.bookingId}
                      _clientSecret={clientSecret}
                      onSuccess={handlePaymentSuccess}
                      onError={() => {
                        console.error('Payment failed for booking:', bookingData.bookingId);
                      }}
                    />
                  </Elements>
                )}
              </div>
            )}

          {/* placeholders */}
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
