export const dynamic = 'force-dynamic';

/**
 * 📍 Saved Addresses Page - User Address Management
 *
 * Pagina pentru gestionarea adreselor salvate
 * Clean, fără logic hardcodat, responsive
 */

import { ProfileAddresses } from '@/features/account/components/profile/ProfileAddresses';

export default function AddressesPage() {
  return (
    <div className='p-6'>
      <ProfileAddresses />
    </div>
  );
}
