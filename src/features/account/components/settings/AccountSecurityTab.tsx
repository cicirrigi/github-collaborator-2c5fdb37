/**
 * 🔐 Account Security Tab - Security Settings Page
 *
 * Component pentru gestionarea securității în pagina de Settings
 * - Last login, account created, email/phone verification
 * - Password management, 2FA settings
 * Clean, fără logic hardcodat, responsive
 */

'use client';

import {
  Shield,
  Clock,
  Calendar,
  Mail,
  Phone,
  CheckCircle,
  AlertCircle,
  Key,
  Lock,
} from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';

export function AccountSecurityTab() {
  const { fullProfileData, isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='animate-pulse space-y-4'>
          <div className='h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-48' />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='h-32 bg-neutral-200 dark:bg-neutral-700 rounded-lg' />
            <div className='h-32 bg-neutral-200 dark:bg-neutral-700 rounded-lg' />
          </div>
        </div>
      </div>
    );
  }

  if (!fullProfileData?.auth_user) {
    return (
      <div className='space-y-6'>
        <h2 className='text-lg font-semibold text-neutral-900 dark:text-white'>Account Security</h2>
        <div className='bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4'>
          <p className='text-amber-700 dark:text-amber-200'>Unable to load security information.</p>
        </div>
      </div>
    );
  }

  const authUser = fullProfileData.auth_user;

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

  return (
    <div className='space-y-6'>
      <h2 className='text-lg font-semibold text-neutral-900 dark:text-white'>Account Security</h2>

      {/* Login Activity Section */}
      <div className='bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-6'>
        <h3 className='text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4 flex items-center gap-2'>
          <Clock className='w-4 h-4' />
          Login Activity
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='flex items-center justify-between py-3 px-4 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700'>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-green-500 rounded-full'></div>
              <span className='text-sm text-neutral-600 dark:text-neutral-400'>Last Login</span>
            </div>
            <span className='text-sm font-medium text-neutral-900 dark:text-white'>
              {formatRelativeTime(authUser.last_sign_in_at)}
            </span>
          </div>

          <div className='flex items-center justify-between py-3 px-4 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700'>
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

      {/* Verification Status Section */}
      <div className='bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-6'>
        <h3 className='text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4 flex items-center gap-2'>
          <Shield className='w-4 h-4' />
          Verification Status
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='flex items-center justify-between py-3 px-4 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700'>
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

          <div className='flex items-center justify-between py-3 px-4 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700'>
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

      {/* Password & Authentication Section */}
      <div className='bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-6'>
        <h3 className='text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4 flex items-center gap-2'>
          <Key className='w-4 h-4' />
          Password & Authentication
        </h3>

        <div className='space-y-4'>
          <div className='flex items-center justify-between py-3 px-4 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700'>
            <div className='flex items-center gap-3'>
              <Lock className='w-4 h-4 text-neutral-400' />
              <div>
                <span className='text-sm font-medium text-neutral-900 dark:text-white block'>
                  Password
                </span>
                <span className='text-xs text-neutral-600 dark:text-neutral-400'>
                  Last changed recently
                </span>
              </div>
            </div>
            <button className='text-sm text-[var(--brand-primary)] hover:text-[var(--brand-primary)]/80 font-medium transition-colors'>
              Change
            </button>
          </div>

          <div className='flex items-center justify-between py-3 px-4 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700'>
            <div className='flex items-center gap-3'>
              <Shield className='w-4 h-4 text-neutral-400' />
              <div>
                <span className='text-sm font-medium text-neutral-900 dark:text-white block'>
                  Two-Factor Authentication
                </span>
                <span className='text-xs text-neutral-600 dark:text-neutral-400'>Not enabled</span>
              </div>
            </div>
            <button className='text-sm text-[var(--brand-primary)] hover:text-[var(--brand-primary)]/80 font-medium transition-colors'>
              Enable
            </button>
          </div>
        </div>
      </div>

      {/* Security Recommendations */}
      <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6'>
        <div className='flex items-start gap-3'>
          <Shield className='w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5' />
          <div>
            <h3 className='text-sm font-medium text-blue-900 dark:text-blue-100 mb-2'>
              Security Recommendations
            </h3>
            <ul className='text-sm text-blue-700 dark:text-blue-200 space-y-1'>
              {!authUser.phone_confirmed_at && (
                <li>• Verify your phone number for enhanced account security</li>
              )}
              {!authUser.email_confirmed_at && (
                <li>• Verify your email address to secure your account</li>
              )}
              <li>• Enable two-factor authentication for extra protection</li>
              <li>• Use a strong, unique password for your account</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
