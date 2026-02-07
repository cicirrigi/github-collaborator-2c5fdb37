/**
 * 👤 Profile Page - User Profile Management
 *
 * Pagina pentru gestionarea profilului utilizatorului
 * Clean, fără logic hardcodat, responsive
 */

import { ProfileContent } from '@/features/account/components/profile/ProfileContent';
import { AccountLayout } from '@/features/account/components/shared/AccountLayout';

export default function ProfilePage() {
  return (
    <AccountLayout title='Profile' description='Manage your personal information'>
      <ProfileContent />
    </AccountLayout>
  );
}
