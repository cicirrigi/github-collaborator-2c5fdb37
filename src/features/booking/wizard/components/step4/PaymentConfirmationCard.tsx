'use client';

import { CheckCircle, CreditCard, Receipt } from 'lucide-react';

/**
 * 🎯 PAYMENT CONFIRMATION CARD
 * Show payment details, transaction info, receipt access
 * Clean, secure, informative
 */

interface PaymentConfirmationCardProps {
  amount: number;
  currency?: string;
  paymentMethod?: string;
  transactionId?: string;
  stripeReceiptUrl?: string;
  completedAt?: Date;
}

export function PaymentConfirmationCard({
  amount,
  currency = 'GBP',
  paymentMethod = 'Card Payment',
  transactionId = 'txn_processing',
  stripeReceiptUrl,
  completedAt = new Date(),
}: PaymentConfirmationCardProps) {
  const formatCurrency = (value: number, curr: string) => {
    const symbol = curr === 'GBP' ? '£' : curr === 'USD' ? '$' : '€';
    return `${symbol}${value.toFixed(2)}`;
  };

  const formatDateTime = (date: Date) =>
    date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className='vl-card'>
      {/* Header */}
      <div className='flex items-center gap-2 text-green-400 font-medium mb-4'>
        <CheckCircle className='w-5 h-5' />
        Payment Completed
      </div>

      {/* Payment Summary */}
      <div className='space-y-4'>
        {/* Amount */}
        <div className='flex justify-between items-center p-4 bg-green-400/10 rounded-lg border border-green-400/20'>
          <span className='text-neutral-300'>Total Amount</span>
          <span className='text-2xl font-bold text-green-400'>
            {formatCurrency(amount, currency)}
          </span>
        </div>

        {/* Payment Details */}
        <div className='space-y-3'>
          <div className='flex items-center justify-between p-3 bg-white/5 rounded-lg'>
            <div className='flex items-center gap-2'>
              <CreditCard className='w-4 h-4 text-neutral-400' />
              <span className='text-neutral-300'>Payment Method</span>
            </div>
            <span className='text-white font-medium'>{paymentMethod}</span>
          </div>

          <div className='flex items-center justify-between p-3 bg-white/5 rounded-lg'>
            <span className='text-neutral-300'>Transaction ID</span>
            <code className='text-xs text-amber-400 bg-black/30 px-2 py-1 rounded'>
              {transactionId}
            </code>
          </div>

          <div className='flex items-center justify-between p-3 bg-white/5 rounded-lg'>
            <span className='text-neutral-300'>Payment Date</span>
            <span className='text-white'>{formatDateTime(completedAt)}</span>
          </div>
        </div>

        {/* Receipt Access */}
        <div className='pt-2'>
          {stripeReceiptUrl ? (
            <a
              href={stripeReceiptUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center justify-center gap-2 w-full p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg border border-blue-500/40 text-blue-300 hover:text-blue-200 transition-colors'
            >
              <Receipt className='w-4 h-4' />
              View Stripe Receipt
            </a>
          ) : (
            <div className='text-center p-3 bg-neutral-500/10 rounded-lg border border-neutral-500/20'>
              <div className='flex items-center justify-center gap-2 text-neutral-400 text-sm'>
                <Receipt className='w-4 h-4' />
                Receipt will be available shortly
              </div>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className='text-xs text-neutral-400 text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20'>
          🔒 Payment processed securely via Stripe. Your card details are never stored on our
          servers.
        </div>
      </div>
    </div>
  );
}
