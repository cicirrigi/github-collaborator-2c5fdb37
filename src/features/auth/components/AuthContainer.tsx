/**
 * 🔐 AuthContainer - REBUILD DE LA ZERO
 *
 * Pagină de autentificare simplă, modulară
 * - Fără header/footer
 * - Background ca în site
 * - Split layout clar (40/60)
 * - Form minimal funcțional
 */

'use client';

import Image from 'next/image';
import { useState } from 'react';

import { BackgroundOrchestrator } from '@/design-system/backgrounds/BackgroundOrchestrator';

import type { AuthMode } from '../types/auth.types';
import { AuthTabs } from './AuthTabs';
import { AuthForm } from './AuthForm';

interface AuthContainerProps {
  defaultMode?: AuthMode;
  redirectTo?: string;
}

export function AuthContainer({ defaultMode = 'signin' }: AuthContainerProps) {
  const [activeMode, setActiveMode] = useState<AuthMode>(defaultMode);

  return (
    <>
      {/* Background fixed */}
      <BackgroundOrchestrator preset='luxury' />

      {/* Content */}
      <div className='flex flex-col lg:flex-row min-h-screen'>
        {/* LEFT: Form Container - 50% */}
        <div className='w-full lg:w-1/2 min-h-screen flex flex-col justify-center items-center px-6 py-12 lg:px-12 relative'>
          {/* Logo + Vantage Lane - Top Left */}
          <div className='absolute top-8 left-8 flex items-center gap-2'>
            <div className='relative w-10 h-10 scale-[1.6]'>
              <Image
                src='/LOGO/logo transparent.png'
                alt='Vantage Lane Logo'
                fill
                className='object-contain drop-shadow-lg'
                priority
              />
            </div>
            <div className='text-xl font-light tracking-wide uppercase select-none'>
              <span className='bg-gradient-to-r from-[#d4b870] to-[#bfa156] bg-clip-text text-transparent'>
                Vantage
              </span>
              <span className='ml-1 text-white'>Lane</span>
            </div>
          </div>

          <div className='w-full max-w-md'>
            {/* Auth Tabs - Sign In / Sign Up */}
            <AuthTabs activeMode={activeMode} onChange={setActiveMode} />

            {/* Auth Form */}
            <AuthForm mode={activeMode} />
          </div>
        </div>

        {/* RIGHT: Image Container - 50% - LAYERED IMAGES */}
        <div className='w-full lg:w-1/2 min-h-[40vh] lg:min-h-screen relative overflow-visible'>
          {/* Background Image - New BG 2 */}
          <Image
            src='/images/vehicles-webp/NEW BG 2.webp'
            alt='Vantage Lane Background'
            fill
            priority
            className='object-cover'
            style={{ objectPosition: 'center 70%' }}
            quality={100}
          />

          {/* Welcome Text - Elegant cu decorație */}
          <div className='absolute top-12 left-1/2 -translate-x-1/2 z-20'>
            <div className='text-center'>
              {/* Decorative line top */}
              <div className='w-20 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent mx-auto mb-6'></div>

              {/* Welcome Text */}
              <h1
                className='text-5xl md:text-6xl lg:text-7xl tracking-wider text-center bg-gradient-to-br from-white via-amber-100 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(251,191,36,0.3)] mb-3'
                style={{
                  fontFamily: 'var(--font-display)',
                  lineHeight: '1.1',
                  WebkitTextStroke: '1px rgba(255,255,255,0.1)',
                }}
              >
                Welcome
              </h1>

              {/* Subtitle - Slogan */}
              <p className='text-sm md:text-base text-gray-300 tracking-[0.2em]'>
                The Art of Refined Motion
              </p>

              {/* Decorative line bottom */}
              <div className='w-20 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent mx-auto mt-6'></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
