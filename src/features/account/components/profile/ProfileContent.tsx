/**
 * 👤 Profile Content - Main Profile Page Layout
 *
 * Container pentru toate componentele profile
 * Clean, fără logic hardcodat, responsive
 */

'use client';

import { useProfile } from '../../hooks/useProfile';
import type { ProfileFormData } from '../../types/profile.types';
import { AvatarUpload } from './AvatarUpload';
import { ProfileBasicInfo } from './ProfileBasicInfo';

export function ProfileContent() {
  const { profileData, isLoading, error, updateProfile, uploadAvatar, removeAvatar } = useProfile();

  const handleProfileSave = async (formData: ProfileFormData): Promise<void> => {
    await updateProfile({
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone: formData.phone,
      date_of_birth: formData.date_of_birth,
    });
  };

  const handleAvatarUpload = async (file: File): Promise<string> => {
    return await uploadAvatar(file);
  };

  const handleAvatarRemove = async (): Promise<void> => {
    await removeAvatar();
  };

  if (isLoading) {
    return (
      <div className='space-y-6'>
        {/* Loading skeleton */}
        <div className='bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6'>
          <div className='animate-pulse space-y-6'>
            <div className='flex items-center gap-6'>
              <div className='w-24 h-24 bg-neutral-200 dark:bg-neutral-700 rounded-full' />
              <div className='flex-1 space-y-3'>
                <div className='h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3' />
                <div className='h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3' />
                <div className='h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-32' />
              </div>
            </div>
            <div className='space-y-4'>
              {[...Array(4)].map((_, i) => (
                <div key={i} className='space-y-2'>
                  <div className='h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-24' />
                  <div className='h-10 bg-neutral-200 dark:bg-neutral-700 rounded' />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='space-y-6'>
        <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6'>
          <h3 className='text-red-800 dark:text-red-200 font-medium mb-2'>Error Loading Profile</h3>
          <p className='text-red-600 dark:text-red-400 text-sm'>{error}</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className='space-y-6'>
        <div className='bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700 p-8 text-center'>
          <p className='text-neutral-500 dark:text-neutral-400'>No profile data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Page Header */}
      <div>
        <h1 className='text-2xl font-bold text-neutral-900 dark:text-white mb-2'>Profile</h1>
        <p className='text-neutral-600 dark:text-neutral-400'>
          Manage your personal information and account settings
        </p>
      </div>

      {/* Avatar Upload Section */}
      <div className='bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6'>
        <AvatarUpload
          currentAvatarUrl={profileData.avatar_url}
          onUpload={handleAvatarUpload}
          onRemove={handleAvatarRemove}
          isLoading={false}
        />
      </div>

      {/* Basic Information Form */}
      <ProfileBasicInfo initialData={profileData} onSave={handleProfileSave} isLoading={false} />

      {/* Additional sections placeholder */}
      <div className='bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700 p-8 text-center'>
        <p className='text-neutral-500 dark:text-neutral-400'>
          Additional profile sections (emergency contacts, preferences) will be implemented next.
          Account security settings are now available in the Settings page.
        </p>
      </div>
    </div>
  );
}
