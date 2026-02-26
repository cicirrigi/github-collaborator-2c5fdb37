'use client';

import { DollarSign } from 'lucide-react';

interface PricingBreakdownProps {
  /** Total amount including VAT (in pounds) */
  totalAmount: number;
  /** Additional services/upgrades amount including VAT (in pounds) */
  upgradesAmount?: number;
  /** Currency code */
  currency?: string;
  /** Show loading state */
  isLoading?: boolean;
}

/**
 * 🧾 PRICING BREAKDOWN CARD - REUSABLE VAT COMPONENT
 *
 * Extracts VAT calculation logic from PaymentCard for consistent display
 * across Step 3 (PaymentCard) and Step 4 (Confirmation)
 *
 * Performs reverse VAT calculation from VAT-inclusive totals:
 * - Total £150 (with VAT) → £125 net + £25 VAT
 */
export function PricingBreakdownCard({
  totalAmount,
  upgradesAmount = 0,
  currency = 'GBP',
  isLoading = false,
}: PricingBreakdownProps) {
  // UK VAT rate (20%)
  const VAT_RATE = 0.2;
  const VAT_MULTIPLIER = 1 + VAT_RATE; // 1.20

  // Reverse VAT calculation (prices come VAT-inclusive)
  const calculateVATBreakdown = () => {
    if (totalAmount <= 0) return null;

    // Remove VAT from VAT-inclusive amounts
    const subtotalNet = totalAmount / VAT_MULTIPLIER;
    const vatAmount = totalAmount - subtotalNet;
    const upgradesNetPrice = upgradesAmount / VAT_MULTIPLIER;
    const baseNetPrice = Math.max(0, subtotalNet - upgradesNetPrice);

    return {
      baseNetPrice: Math.round(baseNetPrice * 100) / 100,
      upgradesNetPrice: Math.round(upgradesNetPrice * 100) / 100,
      subtotalNet: Math.round(subtotalNet * 100) / 100,
      vatAmount: Math.round(vatAmount * 100) / 100,
      totalPrice: Math.round(totalAmount * 100) / 100,
    };
  };

  const breakdown = calculateVATBreakdown();
  const formatCurrency = (amount: number) => `£${amount.toFixed(2)}`;

  if (isLoading || !breakdown) {
    return (
      <div className='vl-card'>
        <h4 className='text-sm font-medium text-neutral-300 flex items-center gap-2 mb-4'>
          <DollarSign className='w-4 h-4' />
          Price Breakdown
        </h4>
        <div className='text-center py-4'>
          <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-amber-400 mx-auto mb-2' />
          <div className='text-sm text-neutral-400'>Calculating pricing...</div>
        </div>
      </div>
    );
  }

  return (
    <div className='vl-card'>
      <h4 className='text-sm font-medium text-neutral-300 flex items-center gap-2 mb-4'>
        <DollarSign className='w-4 h-4' />
        Price Breakdown
      </h4>

      <div className='space-y-2'>
        {/* Base trip fare (net) */}
        <div className='flex items-center justify-between text-sm'>
          <span className='text-neutral-400'>Base trip fare</span>
          <span className='text-white'>{formatCurrency(breakdown.baseNetPrice)}</span>
        </div>

        {/* Additional services (net) */}
        {breakdown.upgradesNetPrice > 0 && (
          <div className='flex items-center justify-between text-sm'>
            <span className='text-neutral-400'>Additional services</span>
            <span className='text-amber-300'>{formatCurrency(breakdown.upgradesNetPrice)}</span>
          </div>
        )}

        {/* Subtotal (net) */}
        <div className='flex items-center justify-between text-sm'>
          <span className='text-neutral-400'>Subtotal</span>
          <span className='text-white'>{formatCurrency(breakdown.subtotalNet)}</span>
        </div>

        {/* VAT (20%) */}
        <div className='flex items-center justify-between text-sm'>
          <span className='text-neutral-400'>VAT (20%)</span>
          <span className='text-neutral-400'>{formatCurrency(breakdown.vatAmount)}</span>
        </div>

        {/* Total with VAT */}
        <div className='border-t border-white/10 pt-2'>
          <div className='flex items-center justify-between'>
            <span className='text-white font-semibold'>Total</span>
            <span className='text-amber-400 font-bold text-lg'>
              {formatCurrency(breakdown.totalPrice)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
