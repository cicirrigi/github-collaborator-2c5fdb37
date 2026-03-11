/**
 * 🎯 Dashboard Hero Section
 *
 * Luxury hero section with Mercedes background, welcome message,
 * membership info, and loyalty tier card
 */

'use client';

import Image from 'next/image';
import { useDashboard, type DashboardData } from '../../hooks/useDashboard';

interface HeroSectionProps {
  dashboardData?: DashboardData | null;
}

export function HeroSection({ dashboardData: serverData }: HeroSectionProps) {
  const { dashboard: clientDashboard, loading, error } = useDashboard();

  // Use server data if available, otherwise fall back to client fetch
  const dashboard = serverData ?? clientDashboard;
  const isLoading = !serverData && loading;

  if (isLoading) {
    return (
      <div className='relative h-[600px] bg-neutral-900 animate-pulse'>
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='text-white/50'>Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <section className='relative h-[600px] overflow-hidden bg-neutral-900'>
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='text-center'>
            <p className='text-red-400 text-lg mb-4'>{error || 'Failed to load dashboard'}</p>
            <button
              onClick={() => window.location.reload()}
              className='px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600'
            >
              Reload Page
            </button>
          </div>
        </div>
      </section>
    );
  }

  const fullName =
    `${dashboard.first_name || ''} ${dashboard.last_name || ''}`.trim() || dashboard.email;
  const firstName = dashboard.first_name || 'Guest';

  return (
    <section className='relative h-[600px] overflow-hidden'>
      {/* Background Image */}
      <div className='absolute inset-0'>
        <Image
          src='/images/account/hero-background.webp'
          alt='Luxury vehicle'
          fill
          className='object-cover object-[50%_80%]'
          priority
        />
        {/* Dark overlay for better text readability */}
        <div className='absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent' />
      </div>

      {/* Content */}
      <div className='relative h-full flex flex-col px-6 md:px-12 pt-8'>
        <div className='max-w-7xl w-full'>
          <div className='flex items-start justify-between'>
            {/* Left: Welcome Message */}
            <div className='flex-1'>
              <h1 className='text-3xl md:text-4xl font-bold text-white mb-2'>
                Welcome back, {firstName}
              </h1>
              <p className='text-white/80 text-sm md:text-base'>
                <span className='capitalize'>{dashboard.loyalty_tier}</span> Member • Member since{' '}
                {new Date(dashboard.member_since || Date.now()).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </p>
            </div>

            {/* Right: Profile Photo */}
            {dashboard.profile_photo_url && (
              <div className='ml-4'>
                <div className='w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white/20 shadow-xl'>
                  <Image
                    src={dashboard.profile_photo_url}
                    alt={fullName}
                    width={96}
                    height={96}
                    className='object-cover w-full h-full'
                  />
                </div>
              </div>
            )}
          </div>

          {/* Loyalty Tier Card */}
          <div className='mt-8'>
            <div className='bg-white/10 backdrop-blur-lg rounded-xl px-6 py-4 border border-white/20 shadow-2xl inline-block min-w-[320px]'>
              <div className='flex items-center gap-3 mb-2'>
                <div className='w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center'>
                  <span className='text-amber-400 text-lg'>💎</span>
                </div>
                <h3 className='text-white font-semibold text-lg capitalize'>
                  {dashboard.loyalty_tier}
                </h3>
              </div>

              <div className='flex items-baseline justify-between'>
                <p className='text-white/70 text-sm'>Progress to Black Tier</p>
                <p className='text-white font-bold text-xl'>
                  £{dashboard.total_spent_pounds?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
