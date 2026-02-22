/**
 * 📍 useAddresses Hook - Address CRUD Operations
 *
 * Hook pentru managementul adreselor favorite
 * Operații: fetch, create, update, delete, setDefault
 * Clean, fără UI logic, proper error handling
 */

import { useAuth } from '@/features/auth/context/AuthProvider';
import { useCallback, useState } from 'react';
import type { CreateAddressData, FavoriteAddress, UpdateAddressData } from '../types/profile.types';

interface UseAddressesReturn {
  readonly addresses: FavoriteAddress[];
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly fetchAddresses: () => Promise<void>;
  readonly createAddress: (data: CreateAddressData) => Promise<void>;
  readonly updateAddress: (id: string, data: UpdateAddressData) => Promise<void>;
  readonly deleteAddress: (id: string) => Promise<void>;
  readonly setDefaultAddress: (id: string) => Promise<void>;
}

export function useAddresses(): UseAddressesReturn {
  const [addresses, setAddresses] = useState<FavoriteAddress[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user, supabase } = useAuth(); // Get both user and authenticated supabase client from context

  if (!supabase) {
    throw new Error('Supabase client not available from AuthProvider');
  }

  const fetchAddresses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error: fetchError } = await supabase
        .from('favorite_addresses')
        .select(
          'id,label,full_address,street_name,street_number,county,country,additional_info,is_default,created_at,updated_at'
        )
        .eq('auth_user_id', user.id)
        .order('is_default', { ascending: false })
        .order('label');

      if (fetchError) {
        throw new Error(`Failed to fetch addresses: ${fetchError.message}`);
      }

      setAddresses(data || []);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch addresses';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [supabase, user]);

  const createAddress = useCallback(
    async (data: CreateAddressData) => {
      try {
        setIsLoading(true);
        setError(null);

        if (!user) {
          throw new Error('User not authenticated');
        }

        // If setting as default, clear other defaults first
        if (data.is_default) {
          await supabase
            .from('favorite_addresses')
            .update({ is_default: false })
            .eq('auth_user_id', user.id);
        }

        const { error: createError } = await supabase.from('favorite_addresses').insert([
          {
            auth_user_id: user.id,
            ...data,
          },
        ]);

        if (createError) {
          throw new Error(`Failed to create address: ${createError.message}`);
        }

        await fetchAddresses();
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to create address';
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [supabase, fetchAddresses, user]
  );

  const updateAddress = useCallback(
    async (id: string, data: UpdateAddressData) => {
      try {
        setIsLoading(true);
        setError(null);

        if (!user) {
          throw new Error('User not authenticated');
        }

        // If setting as default, clear other defaults first
        if (data.is_default) {
          await supabase
            .from('favorite_addresses')
            .update({ is_default: false })
            .eq('auth_user_id', user.id)
            .neq('id', id);
        }

        const { error: updateError } = await supabase
          .from('favorite_addresses')
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .eq('auth_user_id', user.id);

        if (updateError) {
          throw new Error(`Failed to update address: ${updateError.message}`);
        }

        await fetchAddresses();
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to update address';
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [supabase, fetchAddresses, user]
  );

  const deleteAddress = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true);
        setError(null);

        if (!user) {
          throw new Error('User not authenticated');
        }

        const { error: deleteError } = await supabase
          .from('favorite_addresses')
          .delete()
          .eq('id', id)
          .eq('auth_user_id', user.id);

        if (deleteError) {
          throw new Error(`Failed to delete address: ${deleteError.message}`);
        }

        await fetchAddresses();
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to delete address';
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [supabase, fetchAddresses, user]
  );

  const setDefaultAddress = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true);
        setError(null);

        if (!user) {
          throw new Error('User not authenticated');
        }

        // Clear all defaults first
        await supabase
          .from('favorite_addresses')
          .update({ is_default: false })
          .eq('auth_user_id', user.id);

        // Set new default
        const { error: setDefaultError } = await supabase
          .from('favorite_addresses')
          .update({
            is_default: true,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .eq('auth_user_id', user.id);

        if (setDefaultError) {
          throw new Error(`Failed to set default address: ${setDefaultError.message}`);
        }

        await fetchAddresses();
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to set default address';
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [supabase, fetchAddresses, user]
  );

  return {
    addresses,
    isLoading,
    error,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  };
}
