/**
 * 🔐 Profile Account Security - Login Info & Security Status
 *
 * Component pentru afișarea informațiilor de securitate:
 * - Last login, account created, email/phone verification
 * Clean, fără logic hardcodat, responsive
 */

'use client';

import { Shield, Clock, Calendar, Mail, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import type { AuthUser } from '../../types/profile.types';

interface ProfileAccountSecurityProps {
  readonly authUser: AuthUser;
  readonly isLoading?: boolean;
}

export function ProfileAccountSecurity({
  authUser,
  isLoading = false,
}: ProfileAccountSecurityProps) {
  if (isLoading) {
    return (
      <div className='bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6'>
        <div className='animate-pulse space-y-4'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-full' />
            <div className='h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-32' />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='h-20 bg-neutral-200 dark:bg-neutral-700 rounded-lg' />
            <div className='h-20 bg-neutral-200 dark:bg-neutral-700 rounded-lg' />
          </div>
        </div>
      </div>
    );
  }

  const formatRelativeTime = (dateString: string | null): string => {
    if (!dateString) return 'Never';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className='bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6'>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center'>
            <Shield className='w-5 h-5 text-emerald-600' />
          </div>
          <div>
            <h3 className='text-lg font-semibold text-neutral-900 dark:text-white'>
              Account Security
            </h3>
            <p className='text-sm text-neutral-600 dark:text-neutral-400'>
              Login history and verification status
            </p>
          </div>
        </div>
      </div>

      {/* Security Info Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Login Information */}
        <div className='space-y-4'>
          <h4 className='text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-2'>
            <Clock className='w-4 h-4' />
            Login Activity
          </h4>

          <div className='space-y-3'>
            <div className='flex items-center justify-between py-2 px-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg'>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                <span className='text-sm text-neutral-600 dark:text-neutral-400'>Last Login</span>
              </div>
              <span className='text-sm font-medium text-neutral-900 dark:text-white'>
                {formatRelativeTime(authUser.last_sign_in_at)}
              </span>
            </div>

            <div className='flex items-center justify-between py-2 px-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg'>
              <div className='flex items-center gap-2'>
                <Calendar className='w-4 h-4 text-neutral-400' />
                <span className='text-sm text-neutral-600 dark:text-neutral-400'>
                  Account Created
                </span>
              </div>
              <span className='text-sm font-medium text-neutral-900 dark:text-white'>
                {formatRelativeTime(authUser.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Verification Status */}
        <div className='space-y-4'>
          <h4 className='text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-2'>
            <Shield className='w-4 h-4' />
            Verification Status
          </h4>

          <div className='space-y-3'>
            <div className='flex items-center justify-between py-2 px-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg'>
              <div className='flex items-center gap-2'>
                <Mail className='w-4 h-4 text-neutral-400' />
                <span className='text-sm text-neutral-600 dark:text-neutral-400'>Email</span>
              </div>
              <div className='flex items-center gap-1'>
                {authUser.email_confirmed_at ? (
                  <>
                    <CheckCircle className='w-4 h-4 text-green-500' />
                    <span className='text-sm font-medium text-green-600 dark:text-green-400'>
                      Verified
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className='w-4 h-4 text-amber-500' />
                    <span className='text-sm font-medium text-amber-600 dark:text-amber-400'>
                      Unverified
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className='flex items-center justify-between py-2 px-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg'>
              <div className='flex items-center gap-2'>
                <Phone className='w-4 h-4 text-neutral-400' />
                <span className='text-sm text-neutral-600 dark:text-neutral-400'>Phone</span>
              </div>
              <div className='flex items-center gap-1'>
                {authUser.phone_confirmed_at ? (
                  <>
                    <CheckCircle className='w-4 h-4 text-green-500' />
                    <span className='text-sm font-medium text-green-600 dark:text-green-400'>
                      Verified
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className='w-4 h-4 text-amber-500' />
                    <span className='text-sm font-medium text-amber-600 dark:text-amber-400'>
                      Unverified
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Tips */}
      <div className='mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700'>
        <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4'>
          <div className='flex items-start gap-3'>
            <Shield className='w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5' />
            <div>
              <h5 className='text-sm font-medium text-blue-900 dark:text-blue-100 mb-1'>
                Security Tip
              </h5>
              <p className='text-sm text-blue-700 dark:text-blue-200'>
                {!authUser.phone_confirmed_at
                  ? 'Consider verifying your phone number for enhanced account security and faster support.'
                  : 'Your account is well-secured with verified email and phone number.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
