/**
 * 📊 Account Overview - Dashboard Summary
 *
 * Overview component pentru dashboard-ul principal
 * Mock data momentan, va fi conectat la API-uri
 */

'use client';

import {
  Calendar,
  Car,
  PoundSterling,
  Star,
  User as UserIcon,
  type LucideIcon,
} from 'lucide-react';
import { LOYALTY_TIERS } from '../../constants/account.constants';
import { useDashboard } from '../../hooks/useDashboard';
import type { LoyaltyTier } from '../../types/account.types';

export function AccountOverview() {
  const { dashboard, loading, error } = useDashboard();

  if (loading) {
    return (
      <div className='p-6'>
        <div className='bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-8 text-center'>
          <p className='text-neutral-600 dark:text-neutral-400'>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className='p-6'>
        <div className='bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800'>
          <p className='text-red-600 dark:text-red-400'>{error || 'Failed to load dashboard'}</p>
        </div>
      </div>
    );
  }

  const profile = {
    fullName:
      `${dashboard.first_name || ''} ${dashboard.last_name || ''}`.trim() || dashboard.email,
    email: dashboard.email,
    loyaltyTier: dashboard.loyalty_tier,
    totalRides: dashboard.total_bookings,
    totalSpent: dashboard.total_spent_pounds,
    memberSince: dashboard.member_since,
    profilePhotoUrl: dashboard.profile_photo_url,
  };

  return (
    <div className='p-6 space-y-8'>
      {/* Welcome Section */}
      <WelcomeSection profile={profile} />

      {/* Quick Stats */}
      <QuickStats profile={profile} />

      {/* Recent Activity Placeholder */}
      <RecentActivity />
    </div>
  );
}

interface ProfileData {
  readonly fullName: string;
  readonly email: string;
  readonly loyaltyTier: LoyaltyTier;
  readonly totalRides: number;
  readonly totalSpent: number;
  readonly memberSince: string;
  readonly profilePhotoUrl: string | null;
}

interface WelcomeSectionProps {
  readonly profile: ProfileData;
}

function WelcomeSection({ profile }: WelcomeSectionProps) {
  const loyaltyConfig = LOYALTY_TIERS[profile.loyaltyTier];
  const memberDate = new Date(profile.memberSince).toLocaleDateString();

  return (
    <div className='bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800'>
      <div className='flex items-start justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-neutral-900 dark:text-white mb-2'>
            Welcome back, {profile.fullName}
          </h2>
          <p className='text-neutral-600 dark:text-neutral-400 mb-4'>Member since {memberDate}</p>

          <div className='flex items-center gap-3'>
            <div
              className='px-3 py-1 rounded-full text-sm font-medium'
              style={{
                backgroundColor: `${loyaltyConfig.color}20`,
                color: loyaltyConfig.color,
                border: `1px solid ${loyaltyConfig.color}40`,
              }}
            >
              {loyaltyConfig.name} Member
            </div>
            <span className='text-sm text-neutral-500 dark:text-neutral-400'>
              {profile.totalRides} trips completed
            </span>
          </div>
        </div>

        <div className='text-right'>
          <div className='w-16 h-16 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center overflow-hidden'>
            {profile.profilePhotoUrl ? (
              <img
                src={profile.profilePhotoUrl}
                alt={profile.fullName}
                className='w-full h-full object-cover'
              />
            ) : (
              <UserIcon className='w-8 h-8 text-amber-600' />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface QuickStatsProps {
  readonly profile: ProfileData;
}

function QuickStats({ profile }: QuickStatsProps) {
  const stats = [
    {
      label: 'Total Rides',
      value: profile.totalRides.toString(),
      icon: Car,
      description: 'Completed trips',
    },
    {
      label: 'Total Spent',
      value: `£${profile.totalSpent.toFixed(2)}`,
      icon: PoundSterling,
      description: 'Lifetime spending',
    },
    {
      label: 'Loyalty Tier',
      value: LOYALTY_TIERS[profile.loyaltyTier].name,
      icon: Star,
      description: 'Current membership level',
    },
  ];

  return (
    <div>
      <h3 className='text-lg font-semibold text-neutral-900 dark:text-white mb-4'>Quick Stats</h3>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {stats.map(stat => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>
    </div>
  );
}

interface StatCardProps {
  readonly stat: {
    readonly label: string;
    readonly value: string;
    readonly icon: LucideIcon;
    readonly description: string;
  };
}

function StatCard({ stat }: StatCardProps) {
  return (
    <div className='bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700'>
      <div className='flex items-center gap-3'>
        <stat.icon className='w-6 h-6 text-amber-500' />
        <div>
          <div className='text-2xl font-bold text-neutral-900 dark:text-white'>{stat.value}</div>
          <div className='text-sm font-medium text-neutral-700 dark:text-neutral-300'>
            {stat.label}
          </div>
          <div className='text-xs text-neutral-500 dark:text-neutral-400'>{stat.description}</div>
        </div>
      </div>
    </div>
  );
}

function RecentActivity() {
  return (
    <div>
      <h3 className='text-lg font-semibold text-neutral-900 dark:text-white mb-4'>
        Recent Activity
      </h3>

      <div className='bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700 text-center'>
        <div className='mb-3'>
          <Calendar className='w-12 h-12 text-amber-500 mx-auto' />
        </div>
        <h4 className='font-medium text-neutral-900 dark:text-white mb-2'>No recent activity</h4>
        <p className='text-sm text-neutral-500 dark:text-neutral-400 mb-4'>
          Your booking history will appear here once you make your first trip.
        </p>
        <a
          href='/'
          className='inline-flex items-center justify-center px-4 py-2 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition-colors text-sm'
        >
          Book Your First Trip
        </a>
      </div>
    </div>
  );
}
