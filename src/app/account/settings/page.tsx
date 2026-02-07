/**
 * ⚙️ Settings Page - User Preferences & Settings
 *
 * Pagina pentru gestionarea setărilor utilizatorului
 * Clean, fără logic hardcodat, responsive
 */

import { AccountLayout } from '@/features/account/components/shared/AccountLayout';

function SettingsContent() {
  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold text-neutral-900 dark:text-white'>Settings</h1>
      <div className='bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700'>
        <p className='text-neutral-600 dark:text-neutral-400'>
          Settings and preferences management will be implemented here.
        </p>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AccountLayout title='Settings' description='Manage your preferences and notifications'>
      <SettingsContent />
    </AccountLayout>
  );
}
