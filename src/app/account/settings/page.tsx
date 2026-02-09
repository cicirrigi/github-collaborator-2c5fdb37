/**
 * ⚙️ Settings Page - User Preferences & Settings
 *
 * Pagina pentru gestionarea setărilor utilizatorului
 * Clean, fără logic hardcodat, responsive
 */

import { SettingsContent } from '@/features/account/components/settings/SettingsContent';
import { AccountLayout } from '@/features/account/components/shared/AccountLayout';

export default function SettingsPage() {
  return (
    <AccountLayout>
      <SettingsContent />
    </AccountLayout>
  );
}
