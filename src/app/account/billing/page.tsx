/**
 * 💳 Billing & Payments Page - Payment Methods Management
 *
 * Pagina pentru gestionarea metodelor de plată și facturare
 * Clean, fără logic hardcodat, responsive
 */

import { AccountLayout } from '@/features/account/components/shared/AccountLayout';

function BillingContent() {
  return (
    <div className='space-y-6'>
      <div className='p-6'>
        <h1 className='text-2xl font-bold text-neutral-900 dark:text-white'>Billing & Payments</h1>
      </div>
      <div className='bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700'>
        <p className='text-neutral-600 dark:text-neutral-400'>
          Payment methods and billing history will be managed here.
        </p>
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
