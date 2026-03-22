'use client';

import { usePathname } from 'next/navigation';
import type React from 'react';

import { BackgroundOrchestrator } from '@/design-system/backgrounds';
import { cn } from '@/lib/utils/cn';

import Footer from './footer/Footer';
// import Navbar from './navbar/Navbar'; // 🛡️ Stable version
import { NavbarLuxury as Navbar } from './navbar'; // ✨ Testing luxury version
import { NavbarPortal } from './NavbarPortal';

/**
 * 🏗️ Main Layout component for Vantage Lane 2.0
 *
 * Features:
 * - Navbar + Footer integration
 * - Flexible main content area
 * - SEO-friendly structure
 * - Accessible landmarks
 * - Theme-aware styling
 * - Zero layout shift
 * - TypeScript strict
 *
 * @example
 * <Layout>
 *   <HomePage />
 * </Layout>
 *
 * @example
 * <Layout hideNavbar hideFooter className="min-h-screen bg-black">
 *   <AuthPage />
 * </Layout>
 */

export interface LayoutProps {
  /** Page content */
  readonly children: React.ReactNode;
  /** Hide navbar */
  readonly hideNavbar?: boolean;
  /** Hide footer */
  readonly hideFooter?: boolean;
  /** Custom styling */
  readonly className?: string;
  /** Custom container styling */
  readonly containerClassName?: string;
  /** Enable full-height layout (for single page apps) */
  readonly fullHeight?: boolean;
  /** Page-specific title for SEO */
  readonly pageTitle?: string;
}

/**
 * 🎨 Main application layout wrapper
 * Provides consistent structure with navbar, main, and footer
 */
export default function Layout({
  children,
  hideNavbar = false,
  hideFooter = false,
  className,
  containerClassName,
  fullHeight = false,
  pageTitle,
}: LayoutProps): React.JSX.Element {
  const pathname = usePathname();

  // Hide footer on account pages but keep navbar
  const isAccountPage = pathname?.startsWith('/account');
  const shouldHideFooter = hideFooter || isAccountPage;

  return (
    <>
      {/* SEO Title */}
      {pageTitle && <title>{pageTitle} | Vantage Lane</title>}

      {/* 🎨 Premium Background - Theme-aware, performance-optimized */}
      <BackgroundOrchestrator preset='luxury' />

      {/* 🛡️ Portal-based Navbar (always fixed to viewport) */}
      {!hideNavbar && (
        <NavbarPortal>
          <Navbar />
        </NavbarPortal>
      )}

      <div
        className={cn(
          'flex flex-col',
          fullHeight && 'min-h-screen',
          'transition-colors duration-300 ease-in-out'
        )}
      >
        {/* Main Content Area */}
        <main
          className={cn(
            'flex-1',
            fullHeight && !hideNavbar && !shouldHideFooter && 'flex flex-col',
            containerClassName
          )}
          role='main'
          aria-label='Main content'
        >
          <div
            className={cn(
              fullHeight && !hideNavbar && !shouldHideFooter && 'flex flex-1 flex-col',
              className
            )}
          >
            {children}
          </div>
        </main>

        {/* Footer */}
        {!shouldHideFooter && <Footer />}
      </div>
    </>
  );
}
