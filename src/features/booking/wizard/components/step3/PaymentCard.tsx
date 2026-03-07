/* eslint-disable no-console */
// Console logging intentional for payment debugging and status polling
'use client';

import { StripePaymentForm } from '@/features/booking/components/step3/StripePaymentForm';
import { useBookingPayment } from '@/hooks/useBookingPayment';
import { useBookingState } from '@/hooks/useBookingState';
import { stripePromise } from '@/lib/stripe/stripe';
import { Elements } from '@stripe/react-stripe-js';
import { AlertCircle, CreditCard, DollarSign } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

type BookingApiResponse = {
  success: boolean;
  bookingId?: string;
  reference?: string;
  amount_total_pence?: number;
  currency?: string;
  error?: string;
};

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
    calculateUpgradesCost,
  } = useBookingState();

  const [paymentMethod, setPaymentMethod] = useState<'card'>('card');
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
                const fleetBasePrice = fleetPriceGBP ? fleetPriceGBP : 0;
                const upgradesPrice = calculateUpgradesCost();
                const totalPrice = fleetBasePrice + upgradesPrice;
                return Math.round(totalPrice * 100);
              }

              // Single vehicle bookings use selectedVehicle
              const categoryId = tripConfiguration?.selectedVehicle?.category?.id;
              if (!categoryId) {
                // Even without vehicle, include upgrades cost
                const upgradesPrice = calculateUpgradesCost();
                return Math.round(upgradesPrice * 100);
              }

              const basePriceGBP = getPriceForVehicle(categoryId);
              const basePrice = basePriceGBP ? basePriceGBP : 0;
              const upgradesPrice = calculateUpgradesCost();
              const totalPrice = basePrice + upgradesPrice;
              return Math.round(totalPrice * 100);
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

      let data: BookingApiResponse;
      try {
        data = contentType.includes('application/json')
          ? (JSON.parse(rawText) as BookingApiResponse)
          : ({ error: rawText, success: false } as BookingApiResponse);
      } catch {
        data = { success: false, error: rawText };
      }

      console.log('🧾 BOOKING RESPONSE', {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        data,
      });

      if (!response.ok) {
        bookingCreateStartedRef.current = false; // allow retry
        throw new Error(data.error || JSON.stringify(data));
      }

      if (data.success && data.bookingId && data.reference && data.amount_total_pence) {
        const bookingData = {
          bookingId: data.bookingId,
          reference: data.reference,
          amount_total_pence: data.amount_total_pence,
          currency: data.currency || 'GBP',
        };

        setBookingData(bookingData);

        // Save booking data for Step 4 confirmation
        sessionStorage.setItem('vl-booking-data', JSON.stringify(bookingData));
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
      const response = await fetch(`/api/bookings_v1/${bookingId}`);
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
  const handlePaymentSuccess = async (paymentData: PaymentData) => {
    if (!bookingData) return;

    // Save payment data for Step 4 confirmation
    const paymentInfo = {
      payment_method_summary: 'Card Payment', // Will be enhanced with real card details
      transaction_id: paymentData.transactionId,
      payment_intent_id: paymentData.paymentIntentId,
      amount: paymentData.amount,
      currency: paymentData.currency,
      completed_at: new Date().toISOString(),
    };
    sessionStorage.setItem('vl-payment-data', JSON.stringify(paymentInfo));

    // Mark payment as succeeded in session
    markAsSucceeded();

    // Poll booking status to catch webhook update (max 30 seconds)
    let pollAttempts = 0;
    const maxPollAttempts = 15;

    const pollStatus = async (): Promise<void> => {
      pollAttempts++;

      // Skip polling if tab is hidden (user switched tabs)
      if (document.visibilityState === 'hidden') {
        console.log(`⏸️ [POLL ${pollAttempts}/${maxPollAttempts}] Tab hidden, skipping request`);
        if (pollAttempts < maxPollAttempts) {
          setTimeout(pollStatus, 2000);
        }
        return;
      }

      console.log(
        `🔍 [POLL ${pollAttempts}/${maxPollAttempts}] Starting status check for booking:`,
        bookingData.bookingId
      );

      const status = await fetchBookingStatus(bookingData.bookingId);
      console.log(`🔍 [POLL ${pollAttempts}/${maxPollAttempts}] Status received:`, {
        status,
        statusType: typeof status,
        isConfirmed: status === 'CONFIRMED',
        rawStatus: JSON.stringify(status),
      });

      if (status === 'CONFIRMED') {
        console.log('✅ [POLL] Payment CONFIRMED - calling nextStep()');
        try {
          nextStep();
          console.log('✅ [POLL] nextStep() called successfully');
          return;
        } catch (error) {
          console.error('❌ [POLL] nextStep() failed:', error);
          return;
        }
      }

      if (pollAttempts < maxPollAttempts) {
        // Use shorter delay for null responses (network issues) vs real attempts
        const delay = status === null ? 500 : 2000;
        console.log(
          `🔄 [POLL ${pollAttempts}/${maxPollAttempts}] Continuing polling in ${delay}ms, status was:`,
          status
        );
        setTimeout(pollStatus, delay);
      } else {
        // Timeout - show success UI with manual next option
        console.log(
          '⏰ [POLL] Payment processing timeout - webhook may be delayed, showing manual next'
        );
        console.log('⏰ [POLL] Final status received:', status);
        setBookingStatus('PAYMENT_PROCESSING'); // New status for manual next
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

  // Calculate pricing breakdown with VAT reverse calculation (prices come VAT-inclusive)
  const calculatePricingBreakdown = (): {
    baseNetPrice: number;
    upgradesNetPrice: number;
    subtotalNet: number;
    vatAmount: number;
    totalPrice: number;
  } => {
    if (bookingData) {
      // If booking already created, reverse calculate from VAT-inclusive total
      const totalWithVat = bookingData.amount_total_pence / 100;
      const currentUpgrades = calculateUpgradesCost();

      // Reverse VAT calculation (UK VAT = 20%)
      const subtotalNet = totalWithVat / 1.2; // Remove VAT to get net amount
      const vatAmount = totalWithVat - subtotalNet;
      const upgradesNetPrice = currentUpgrades / 1.2; // Upgrades are also VAT-inclusive
      const baseNetPrice = Math.max(0, subtotalNet - upgradesNetPrice);

      return {
        baseNetPrice,
        upgradesNetPrice,
        subtotalNet,
        vatAmount,
        totalPrice: totalWithVat,
      };
    }

    // Calculate from available pricing data (VAT-inclusive from calculator)
    let basePriceWithVat = 0;

    if (bookingType === 'fleet') {
      basePriceWithVat = getFleetTotalPrice() || 0;
    } else {
      const categoryId = tripConfiguration?.selectedVehicle?.category?.id;
      if (categoryId) {
        basePriceWithVat = getPriceForVehicle(categoryId) || 0;
      }
    }

    const upgradesPriceWithVat = calculateUpgradesCost();
    const totalWithVat = basePriceWithVat + upgradesPriceWithVat;

    // Reverse VAT calculation (UK VAT = 20%)
    const subtotalNet = totalWithVat / 1.2; // Remove VAT to get net amount
    const vatAmount = totalWithVat - subtotalNet;
    const baseNetPrice = basePriceWithVat / 1.2;
    const upgradesNetPrice = upgradesPriceWithVat / 1.2;

    return {
      baseNetPrice,
      upgradesNetPrice,
      subtotalNet,
      vatAmount,
      totalPrice: totalWithVat,
    };
  };

  const pricingBreakdown = calculatePricingBreakdown();
  const { baseNetPrice, upgradesNetPrice, subtotalNet, vatAmount, totalPrice } = pricingBreakdown;
  const hasValidPrice = totalPrice > 0;

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
              {hasValidPrice ? (
                <>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-neutral-400'>Base trip fare</span>
                    <span className='text-white'>£{baseNetPrice.toFixed(2)}</span>
                  </div>
                  {upgradesNetPrice > 0 && (
                    <div className='flex items-center justify-between text-sm'>
                      <span className='text-neutral-400'>Additional services</span>
                      <span className='text-amber-300'>£{upgradesNetPrice.toFixed(2)}</span>
                    </div>
                  )}
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-neutral-400'>Subtotal</span>
                    <span className='text-white'>£{subtotalNet.toFixed(2)}</span>
                  </div>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-neutral-400'>VAT (20%)</span>
                    <span className='text-neutral-400'>£{vatAmount.toFixed(2)}</span>
                  </div>
                  <div className='border-t border-white/10 pt-2'>
                    <div className='flex items-center justify-between'>
                      <span className='text-white font-semibold'>Total</span>
                      <span className='text-amber-400 font-bold text-lg'>
                        £{totalPrice.toFixed(2)}
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
            <div className='grid grid-cols-1 gap-2'>
              {[{ id: 'card' as const, name: 'Card', icon: CreditCard }].map(method => {
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

          {bookingData && bookingStatus === 'PAYMENT_PROCESSING' && (
            <div className='text-center py-8 space-y-4'>
              <div className='w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto'>
                <CreditCard className='w-8 h-8 text-amber-400' />
              </div>
              <h4 className='text-lg font-semibold text-white'>Payment Successful!</h4>
              <p className='text-neutral-400 text-sm'>
                Your payment has been processed. The confirmation is being finalized.
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
                      totalAmount={totalPrice}
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
        </div>
      </div>
    </div>
  );
}
