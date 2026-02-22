/**
 * ❓ Help & Support Page - User Support Center
 *
 * Pagina pentru suport și ajutor utilizatori
 * Clean, fără logic hardcodat, responsive
 */

import { AccountLayout } from '@/features/account/components/shared/AccountLayout';

function SupportContent() {
  return (
    <div className='space-y-6'>
      <div className='p-6'>
        <h1 className='text-2xl font-bold text-neutral-900 dark:text-white'>Help & Support</h1>
      </div>
      <div className='bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700'>
        <p className='text-neutral-600 dark:text-neutral-400'>
          Support center, FAQs, and contact information will be available here.
        </p>
      </div>
    </div>
  );
}

export default function SupportPage() {
  return (
    <AccountLayout>
      <SupportContent />
    </AccountLayout>
  );
}
