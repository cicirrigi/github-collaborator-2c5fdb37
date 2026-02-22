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

const supabase = createClient();

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

      // OPTIMIZED: Single query with JOIN to get customer + metadata + preferences
      const { data: combinedData, error: fetchError } = await supabase
        .from('customers')
        .select(
          `
          *,
          customer_metadata(*),
          customer_preferences(*)
        `
        )
        .eq('auth_user_id', authUser.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw new Error(`Failed to fetch profile: ${fetchError.message}`);
      }

      // Extract data from combined result
      const customerData = combinedData;
      const metadataData = combinedData?.customer_metadata?.[0] || null;
      const preferencesData = combinedData?.customer_preferences?.[0] || null;

      // Construct profile form data
      const userData = authUser.user_metadata || authUser.raw_user_meta_data || {};
      const rawPhone =
        ((userData as Record<string, unknown>).phone as string) ||
        authUser.phone ||
        customerData?.phone ||
        '';
      const formData: ProfileFormData = {
        first_name: ((userData as Record<string, unknown>).first_name as string) || '',
        last_name: ((userData as Record<string, unknown>).last_name as string) || '',
        email: authUser.email || '',
        phone: formatPhoneToE164(rawPhone),
        date_of_birth: metadataData?.date_of_birth || '',
        avatar_url: metadataData?.avatar_url || null,
      };

      // Construct full profile data
      const fullData: ProfileData = {
        auth_user: authUser,
        customer: customerData,
        metadata: metadataData,
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

        // Get or create customer record
        const customerResult = await supabase
          .from('customers')
          .select('*')
          .eq('auth_user_id', authUser.id)
          .single();

        let customerData = customerResult.data;
        const customerError = customerResult.error;

        if (customerError && customerError.code === 'PGRST116') {
          // Create customer record if it doesn't exist
          const { data: newCustomer, error: createError } = await supabase
            .from('customers')
            .insert([
              {
                auth_user_id: authUser.id,
                email: authUser.email || '',
                phone: updateData.phone || authUser.phone || '',
                status: 'active',
              },
            ])
            .select()
            .single();

          if (createError) {
            throw new Error(`Failed to create customer: ${createError.message}`);
          }
          customerData = newCustomer;
        } else if (customerError) {
          throw new Error(`Failed to fetch customer: ${customerError.message}`);
        }

        // Update phone in customer table if provided (store E.164 format)
        if (updateData.phone && customerData) {
          const { error: updateCustomerError } = await supabase
            .from('customers')
            .update({ phone: updateData.phone })
            .eq('id', customerData.id);

          if (updateCustomerError) {
            throw new Error(`Failed to update customer phone: ${updateCustomerError.message}`);
          }
        }

        // Update auth.users metadata with first_name, last_name, and phone
        if (updateData.first_name || updateData.last_name || updateData.phone) {
          const currentMetadata = authUser.raw_user_meta_data || {};
          const updatedMetadata = {
            ...currentMetadata,
            ...(updateData.first_name && { first_name: updateData.first_name }),
            ...(updateData.last_name && { last_name: updateData.last_name }),
            ...(updateData.phone && { phone: updateData.phone }),
          };

          const { error: authMetadataError } = await supabase.auth.updateUser({
            data: updatedMetadata,
          });

          if (authMetadataError) {
            throw new Error(`Failed to update auth metadata: ${authMetadataError.message}`);
          }
        }

        // Upsert customer metadata
        if (customerData) {
          const metadataUpdate = {
            customer_id: customerData.id,
            ...(updateData.date_of_birth && { date_of_birth: updateData.date_of_birth }),
            ...(updateData.avatar_url !== undefined && { avatar_url: updateData.avatar_url }),
            updated_at: new Date().toISOString(),
          };

          const { error: metadataError } = await supabase
            .from('customer_metadata')
            .upsert(metadataUpdate, {
              onConflict: 'customer_id',
              ignoreDuplicates: false,
            });

          if (metadataError) {
            throw new Error(`Failed to update metadata: ${metadataError.message}`);
          }
        }

        // Skip auth.users phone update to avoid E.164 format requirement
        // Phone is already stored in customers.phone and raw_user_meta_data.phone

        // Refetch updated data
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
