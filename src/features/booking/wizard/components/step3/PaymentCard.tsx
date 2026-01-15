'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { CreditCard, DollarSign, Lock } from 'lucide-react';
import { useState } from 'react';

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
  const { calculateUpgradesCost } = useBookingState();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'applepay'>('card');

  const upgradesCost = calculateUpgradesCost();
  const baseFare = 245; // TODO: Calculate from distance/time
  const totalCost = baseFare + upgradesCost;

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

          {/* Card Form */}
          {paymentMethod === 'card' && (
            <div className='space-y-4'>
              <h4 className='text-sm font-medium text-neutral-300'>Card Details</h4>
              <div className='space-y-3'>
                <div>
                  <label className='block text-xs text-neutral-400 mb-2'>Card Number</label>
                  <input
                    type='text'
                    placeholder='1234 5678 9012 3456'
                    className='w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-500 focus:border-amber-500/30 focus:bg-white/10 transition-colors'
                  />
                </div>
                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <label className='block text-xs text-neutral-400 mb-2'>Expiry</label>
                    <input
                      type='text'
                      placeholder='MM/YY'
                      className='w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-500 focus:border-amber-500/30 focus:bg-white/10 transition-colors'
                    />
                  </div>
                  <div>
                    <label className='block text-xs text-neutral-400 mb-2'>CVV</label>
                    <input
                      type='text'
                      placeholder='123'
                      className='w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-500 focus:border-amber-500/30 focus:bg-white/10 transition-colors'
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Button */}
          <button className='w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold text-base transition-all duration-300 hover:from-amber-400 hover:to-yellow-400 hover:shadow-lg hover:shadow-amber-500/25'>
            <Lock className='w-5 h-5' />
            Confirm & Pay £{totalCost}
          </button>

          {/* Security Notice */}
          <div className='flex items-center justify-center gap-2 text-xs text-neutral-500'>
            <Lock className='w-3 h-3' />
            <span>Secured by 256-bit SSL encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}
