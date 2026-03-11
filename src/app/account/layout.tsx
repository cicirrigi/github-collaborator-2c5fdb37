/**
 * 🏗️ Account Section Layout
 *
 * Wraps all account pages with AccountLayout (sidebar + main content)
 */

import { AccountLayout } from '@/features/account/components/layout';

interface AccountLayoutPageProps {
  readonly children: React.ReactNode;
}

export default function AccountLayoutPage({ children }: AccountLayoutPageProps) {
  return <AccountLayout>{children}</AccountLayout>;
}
