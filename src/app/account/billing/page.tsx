'use client';

export const dynamic = 'force-dynamic';

/**
 * 💳 Billing & Payments Page - Payment Methods Management
 */

import { BillingAddressAccordion } from '@/features/booking/components/step3/BillingAddressAccordion';

export default function BillingPage() {
  return (
    <div className='p-6'>
      <BillingAddressAccordion />
    </div>
  );
}
