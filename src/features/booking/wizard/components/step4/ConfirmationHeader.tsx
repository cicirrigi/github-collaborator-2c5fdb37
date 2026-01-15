'use client';

import { CheckCircle, Mail } from 'lucide-react';

/**
 * 🎯 STEP 4 CONFIRMATION HEADER
 * Success message, booking reference, email confirmation
 * Clean, simple, no logic
 */

interface ConfirmationHeaderProps {
  referenceNumber?: string;
  emailAddress?: string;
  confirmedAt?: Date;
}

export function ConfirmationHeader({
  referenceNumber = 'VL-2026-001234',
  emailAddress = 'user@example.com',
  confirmedAt = new Date(),
}: ConfirmationHeaderProps) {
  const formatTime = (date: Date) =>
    date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className='vl-card-flex text-center space-y-4'>
      {/* Success Icon */}
      <div className='flex justify-center'>
        <CheckCircle className='w-16 h-16 text-green-400' />
      </div>

      {/* Main Message */}
      <div>
        <h1 className='text-2xl font-bold text-white mb-2'>Booking Confirmed!</h1>
        <p className='text-neutral-300'>Your luxury transfer has been successfully booked</p>
      </div>

      {/* Reference & Details */}
      <div className='bg-white/5 rounded-lg p-4 space-y-2'>
        <div className='flex items-center justify-center gap-2 text-amber-400 font-semibold'>
          📋 Reference: {referenceNumber}
        </div>

        <div className='text-sm text-neutral-400'>Booked on {formatTime(confirmedAt)}</div>

        {/* Email Confirmation */}
        <div className='flex items-center justify-center gap-2 text-sm text-neutral-300'>
          <Mail className='w-4 h-4' />
          Confirmation sent to: {emailAddress}
        </div>
      </div>
    </div>
  );
}
