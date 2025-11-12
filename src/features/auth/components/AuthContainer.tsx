/**
 * 🔐 AuthContainer - Layout Simplu Centrat
 *
 * Pagină de autentificare simplă, modulară
 * - Fără header/footer
 * - Background ca în site
 * - Formular centrat pe toată pagina
 * - Design minimal și curat
 */

'use client';

import Image from 'next/image';
import { useState } from 'react';

import { CompactThemeToggle } from '@/components/ui/theme-toggle';
import { BackgroundOrchestrator } from '@/design-system/backgrounds/BackgroundOrchestrator';
import { authTokens as tokens } from '../tokens/authTokens';

import type { AuthMode } from '../types/auth.types';
import { AuthForm } from './AuthForm';
import { AuthTabs } from './AuthTabs';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { ResetPasswordForm } from './ResetPasswordForm';

interface AuthContainerProps {
  defaultMode?: AuthMode;
  redirectTo?: string;
}

export function AuthContainer({ defaultMode = 'signin', redirectTo }: AuthContainerProps) {
  const [activeMode, setActiveMode] = useState<AuthMode>(defaultMode);

  /**
   * Component mapping pentru fiecare auth mode
   * Modular și ușor de extins cu noi moduri
   */
  const getFormComponent = () => {
    switch (activeMode) {
      case 'signin':
      case 'signup':
        return <AuthForm key={activeMode} mode={activeMode} {...(redirectTo && { redirectTo })} />;
      case 'forgot-password':
        return <ForgotPasswordForm />;
      case 'reset-password':
        return <ResetPasswordForm {...(redirectTo && { redirectTo })} />;
      default:
        return <AuthForm key={activeMode} mode='signin' {...(redirectTo && { redirectTo })} />;
    }
  };

  /**
   * Determină dacă să afișeze tabs-urile (doar pentru signin/signup)
   */
  const showTabs = activeMode === 'signin' || activeMode === 'signup';

  return (
    <>
      {/* Background fixed */}
      <BackgroundOrchestrator preset='luxury' />

      {/* Content - Centrat pe toată pagina */}
      <div
        className={`min-h-screen flex items-start justify-center ${tokens.spacing.containerPadding}`}
        style={{ scrollbarGutter: 'stable' }}
      >
        <div className={`${tokens.layout.container} relative ${tokens.layout.card}`}>
          {/* Theme Toggle - Top Right of Card */}
          <div className='absolute top-4 right-4 z-10'>
            <CompactThemeToggle />
          </div>

          {/* Logo + Vantage Lane - Centered Above Form */}
          <div
            className={`flex items-center justify-center ${tokens.spacing.gridGap} ${tokens.spacing.logoMargin}`}
          >
            <div className={`relative ${tokens.sizes.logo}`}>
              <Image
                src='/LOGO/logo transparent.png'
                alt='Vantage Lane Logo'
                fill
                className='object-contain drop-shadow-lg'
                priority
              />
            </div>
            <div className='text-2xl font-light tracking-wide uppercase select-none text-neutral-900 dark:text-white'>
              Vantage Lane
            </div>
          </div>

          {/* Auth Tabs - doar pentru Sign In / Sign Up */}
          {showTabs && <AuthTabs activeMode={activeMode} onChange={setActiveMode} />}

          {/* Dynamic Form Component */}
          <div className={`relative ${showTabs ? 'mt-6' : 'mt-8'}`}>{getFormComponent()}</div>
        </div>
      </div>
    </>
  );
}
