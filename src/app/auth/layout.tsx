/**
 * 🎨 Auth Layout - Vantage Lane 2.0
 *
 * Minimal layout wrapper pentru auth pages
 * Design-ul e gestionat de AuthContainer component
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Authentication | Vantage Lane',
    template: '%s | Vantage Lane',
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
