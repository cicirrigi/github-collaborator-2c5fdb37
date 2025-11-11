/**
 * ConditionalLayout - Smart Layout Wrapper
 *
 * Aplică Layout (Header + Footer) DOAR pe paginile normale
 * Exclude paginile speciale: /auth, /login, etc.
 *
 * @module ConditionalLayout
 */

'use client';

import { usePathname } from 'next/navigation';
import Layout from './Layout';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

/**
 * Pagini care NU trebuie să aibă Header/Footer
 */
const PAGES_WITHOUT_LAYOUT = ['/auth', '/login', '/register', '/signup'];

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Verifică dacă suntem pe o pagină fără layout
  const shouldSkipLayout = PAGES_WITHOUT_LAYOUT.some(path => pathname.startsWith(path));

  // Dacă e pagină specială → children direct (fără Header/Footer)
  if (shouldSkipLayout) {
    return <>{children}</>;
  }

  // Altfel → Layout normal (cu Header/Footer)
  return <Layout>{children}</Layout>;
}
