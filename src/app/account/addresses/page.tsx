/**
 * 📍 Saved Addresses Page - User Address Management
 *
 * Pagina pentru gestionarea adreselor salvate
 * Clean, fără logic hardcodat, responsive
 */

import { ProfileAddresses } from '@/features/account/components/profile/ProfileAddresses';
import { AccountLayout } from '@/features/account/components/shared/AccountLayout';

function AddressesContent() {
  return (
    <div className='p-6'>
      <ProfileAddresses />
    </div>
  );
}

export default function AddressesPage() {
  return (
    <AccountLayout title='Saved Addresses' description='Manage your favorite locations'>
      <AddressesContent />
    </AccountLayout>
  );
}
