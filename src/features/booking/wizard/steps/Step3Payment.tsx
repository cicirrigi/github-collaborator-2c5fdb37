'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { BookingSummaryCard, PaymentCard } from '../components/step3';

/**
 * 🎯 STEP 3 - PAYMENT & SUMMARY
 *
 * Modular architecture:
 * - Left column: Trip summary components
 * - Right column: Payment form
 * - Mobile: Stack layout
 * - Desktop: Grid layout
 *
 * All components use design tokens and Zustand store
 */
export function Step3Payment() {
  const { validateStep2Complete } = useBookingState();
  const step2Valid = validateStep2Complete();

  // Redirect if Step 2 is not complete
  if (!step2Valid.isValid) {
    return (
      <div className='vl-card-flex'>
        <div className='text-center py-8'>
          <h3 className='text-lg font-semibold text-white mb-2'>Step 2 Required</h3>
          <p className='text-neutral-400'>Please complete vehicle selection first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='vl-grid-premium'>
      {/* LEFT COLUMN - Unified Summary */}
      <div>
        <BookingSummaryCard readonly={true} />
      </div>

      {/* RIGHT COLUMN - Payment */}
      <div>
        <PaymentCard />
      </div>
    </div>
  );
}
