/**
 * 💳 Billing & Payments Page - Payment Methods Management
 *
 * Pagina pentru gestionarea metodelor de plată și facturare
 * Clean, fără logic hardcodat, responsive
 */

'use client';

import { BillingAddressAccordion } from '@/features/booking/components/step3/BillingAddressAccordion';

export default function BillingPage() {
  return (
    <div className='p-6'>
      <BillingAddressAccordion />
    </div>
  );
}
