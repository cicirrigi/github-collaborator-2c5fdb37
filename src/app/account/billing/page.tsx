/**
 * 💳 Billing & Payments Page - Payment Methods Management
 *
 * Pagina pentru gestionarea metodelor de plată și facturare
 * Clean, fără logic hardcodat, responsive
 */

'use client';

import { AccountLayout } from '@/features/account/components/shared/AccountLayout';
import { BillingAddressAccordion } from '@/features/booking/components/step3/BillingAddressAccordion';

function BillingContent() {
  return (
    <div className='space-y-6'>
      <div className='p-6'>
        <h1 className='text-2xl font-bold text-neutral-900 dark:text-white'>Billing & Payments</h1>
        <p className='text-neutral-500 dark:text-neutral-400 mt-2'>
          Manage your billing information for invoices and receipts
        </p>
      </div>

      {/* Billing Address Form - Always Expanded */}
      <div className='px-6'>
        <BillingAddressAccordion alwaysExpanded={true} />
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <AccountLayout>
      <BillingContent />
    </AccountLayout>
  );
}
