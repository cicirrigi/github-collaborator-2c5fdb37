/**
 * 🏠 Account Dashboard Page - Main Account Overview
 *
 * Dashboard principal cu overview pentru utilizator
 * Clean, fără logic hardcodat, responsive
 */

import { AccountLayout } from '@/features/account/components/shared/AccountLayout';
import { AccountOverview } from '@/features/account/components/shared/AccountOverview';

export default function AccountPage() {
  return (
    <AccountLayout title='Dashboard' description='Overview of your account and recent activity'>
      <AccountOverview />
    </AccountLayout>
  );
}
