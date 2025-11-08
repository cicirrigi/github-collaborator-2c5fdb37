'use client';

import type React from 'react';

import { cn } from '@/lib/utils/cn';

import Footer from './footer/Footer';
// import Navbar from './navbar/Navbar'; // 🛡️ Stable version
import { NewsletterSection } from '@/components/sections/NewsletterSection';
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
  /** Main content */
  readonly children: React.ReactNode;
  /** Hide navigation bar */
  readonly hideNavbar?: boolean;
  /** Hide footer */
  readonly hideFooter?: boolean;
  /** Hide newsletter section */
  readonly hideNewsletter?: boolean;
  /** Custom main content styling */
  readonly className?: string;
  /** Main content container styling */
  readonly containerClassName?: string;
  /** Enable full height layout */
  readonly fullHeight?: boolean;
  /** Page title for SEO */
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
  hideNewsletter = false,
  className,
  containerClassName,
  fullHeight = false,
  pageTitle,
}: LayoutProps): React.JSX.Element {
  return (
    <>
      {/* SEO Title */}
      {pageTitle && <title>{pageTitle} | Vantage Lane</title>}

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
            fullHeight && !hideNavbar && !hideFooter && 'flex flex-col',
            containerClassName
          )}
          role='main'
          aria-label='Main content'
        >
          <div
            className={cn(
              fullHeight && !hideNavbar && !hideFooter && 'flex flex-1 flex-col',
              className
            )}
          >
            {children}
          </div>
        </main>

        {/* Newsletter Section - Luxury VIP area above footer */}
        {!hideFooter && !hideNewsletter && <NewsletterSection />}

        {/* Footer */}
        {!hideFooter && <Footer />}
      </div>
    </>
  );
}
