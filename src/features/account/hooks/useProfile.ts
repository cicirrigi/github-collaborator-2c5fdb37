/**
 * 👤 useProfile Hook - Profile Data Management
 *
 * Hook pentru gestionarea datelor de profil din Supabase
 * Queries: auth.users + customers + customer_metadata + customer_preferences
 */

'use client';

import { getCurrentUser } from '@/features/auth/services/supabaseAuth';
import { createClient } from '@/lib/supabase/client';
import { useCallback, useEffect, useState } from 'react';
import type { ProfileData, ProfileFormData, ProfileUpdateData } from '../types/profile.types';
import { formatPhoneToE164 } from '../utils/phoneUtils';

interface UseProfileReturn {
  readonly profileData: ProfileFormData | null;
  readonly fullProfileData: ProfileData | null;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly updateProfile: (data: ProfileUpdateData) => Promise<void>;
  readonly uploadAvatar: (file: File) => Promise<string>;
  readonly removeAvatar: () => Promise<void>;
  readonly refetchProfile: () => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const [profileData, setProfileData] = useState<ProfileFormData | null>(null);
  const [fullProfileData, setFullProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get current auth user
      const { user: authUser, error: authError } = await getCurrentUser();
      if (authError || !authUser) {
        throw new Error('User not authenticated');
      }

      const supabase = createClient();

      // Fetch from customer_profiles_v1 view (consistent with bookings_v1 architecture)
      const { data: profileView, error: fetchError } = await supabase
        .from('customer_profiles_v1')
        .select('*')
        .eq('auth_user_id', authUser.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw new Error(`Failed to fetch profile: ${fetchError.message}`);
      }

      // Extract data from view result (matches real schema structure)
      const customerData = profileView
        ? {
            id: profileView.customer_id,
            auth_user_id: profileView.auth_user_id,
            email: profileView.email,
            first_name: profileView.first_name,
            last_name: profileView.last_name,
            phone: profileView.phone,
            date_of_birth: profileView.date_of_birth,
            profile_photo_url: profileView.profile_photo_url,
            saved_address: profileView.saved_address,
            is_active: profileView.is_active,
            organization_id: profileView.organization_id,
            created_at: profileView.customer_created_at,
            updated_at: profileView.customer_updated_at,
            deleted_at: profileView.customer_deleted_at,
          }
        : null;

      const preferencesData = profileView
        ? {
            temperature_preference: profileView.temperature_preference,
            music_preference: profileView.music_preference,
            communication_style: profileView.communication_style,
            pet_friendly_default: profileView.pet_friendly_default,
            created_at: profileView.preferences_created_at,
            updated_at: profileView.preferences_updated_at,
          }
        : null;

      // Construct profile form data
      const formData: ProfileFormData = {
        first_name: customerData?.first_name || '',
        last_name: customerData?.last_name || '',
        email: customerData?.email || authUser.email || '',
        phone: formatPhoneToE164(customerData?.phone || ''),
        date_of_birth: customerData?.date_of_birth || '',
        avatar_url: customerData?.profile_photo_url || null,
      };

      // Construct full profile data
      const fullData: ProfileData = {
        auth_user: authUser,
        customer: customerData,
        preferences: preferencesData,
      };

      setProfileData(formData);
      setFullProfileData(fullData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch profile';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (updateData: ProfileUpdateData) => {
      try {
        setError(null);

        const { user: authUser, error: authError } = await getCurrentUser();
        if (authError || !authUser) {
          throw new Error('User not authenticated');
        }

        const supabase = createClient();

        // Build update payload for customers table (real schema columns)
        const customerPayload: Record<string, unknown> = {
          updated_at: new Date().toISOString(),
        };

        if (updateData.first_name !== undefined) {
          customerPayload.first_name = updateData.first_name;
        }
        if (updateData.last_name !== undefined) {
          customerPayload.last_name = updateData.last_name;
        }
        if (updateData.phone !== undefined) {
          customerPayload.phone = updateData.phone;
        }
        if (updateData.date_of_birth !== undefined) {
          customerPayload.date_of_birth = updateData.date_of_birth || null;
        }
        if (updateData.avatar_url !== undefined) {
          // Map avatar_url from form to profile_photo_url in DB
          customerPayload.profile_photo_url = updateData.avatar_url;
        }

        // Update directly in customers table - no SELECT to avoid triggering complex SELECT policies
        // Relies on simple customers_update_own policy: auth_user_id = auth.uid()
        const { error: updateError } = await supabase
          .from('customers')
          .update(customerPayload)
          .eq('auth_user_id', authUser.id);

        if (updateError) {
          // If customer doesn't exist, create it
          if (updateError.code === 'PGRST116') {
            const { error: createError } = await supabase.from('customers').insert([
              {
                auth_user_id: authUser.id,
                email: authUser.email || '',
                first_name: updateData.first_name || '',
                last_name: updateData.last_name || '',
                phone: updateData.phone || '',
                profile_photo_url: updateData.avatar_url || null,
              },
            ]);

            if (createError) {
              throw new Error(`Failed to create customer: ${createError.message}`);
            }
          } else {
            throw new Error(`Failed to update customer: ${updateError.message}`);
          }
        }

        // Update auth.users metadata for consistency
        if (updateData.first_name || updateData.last_name || updateData.phone) {
          const currentMetadata = authUser.raw_user_meta_data || {};
          const updatedMetadata = {
            ...currentMetadata,
            ...(updateData.first_name !== undefined && { first_name: updateData.first_name }),
            ...(updateData.last_name !== undefined && { last_name: updateData.last_name }),
            ...(updateData.phone !== undefined && { phone: updateData.phone }),
          };

          const supabaseAuth = createClient();
          const { error: authMetadataError } = await supabaseAuth.auth.updateUser({
            data: updatedMetadata,
          });

          if (authMetadataError) {
            throw new Error(`Failed to update auth metadata: ${authMetadataError.message}`);
          }
        }

        // Refetch updated data from view
        await fetchProfile();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [fetchProfile]
  );

  const uploadAvatar = useCallback(
    async (file: File): Promise<string> => {
      try {
        const { user: authUser } = await getCurrentUser();
        if (!authUser) {
          throw new Error('User not authenticated');
        }

        const supabase = createClient();

        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `avatar-${authUser.id}-${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('profile-images')
          .upload(filePath, file);

        if (uploadError) {
          throw new Error(`Upload failed: ${uploadError.message}`);
        }

        // Get public URL
        const { data: urlData } = supabase.storage.from('profile-images').getPublicUrl(filePath);

        const publicUrl = urlData.publicUrl;

        // Update avatar_url in customer_metadata
        await updateProfile({ avatar_url: publicUrl });

        return publicUrl;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to upload avatar';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [updateProfile]
  );

  const removeAvatar = useCallback(async (): Promise<void> => {
    try {
      // Remove avatar_url from customer_metadata
      await updateProfile({ avatar_url: null });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove avatar';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [updateProfile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profileData,
    fullProfileData,
    isLoading,
    error,
    updateProfile,
    uploadAvatar,
    removeAvatar,
    refetchProfile: fetchProfile,
  };
}
