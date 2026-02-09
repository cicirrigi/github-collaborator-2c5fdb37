/**
 * 📞 Emergency Contacts Page - Emergency Contact Management
 *
 * Pagina pentru gestionarea contactelor de urgență
 * Clean, fără logic hardcodat, responsive
 */

import { AccountLayout } from '@/features/account/components/shared/AccountLayout';

function EmergencyContactsContent() {
  return (
    <div className='space-y-6'>
      <div className='p-6'>
        <h1 className='text-2xl font-bold text-neutral-900 dark:text-white'>Emergency Contacts</h1>
      </div>
      <div className='bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700'>
        <p className='text-neutral-600 dark:text-neutral-400'>
          Emergency contact information management will be implemented here.
        </p>
      </div>
    </div>
  );
}

export default function EmergencyContactsPage() {
  return (
    <AccountLayout>
      <EmergencyContactsContent />
    </AccountLayout>
  );
}
