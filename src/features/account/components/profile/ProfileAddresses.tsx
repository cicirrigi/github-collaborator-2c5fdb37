/**
 * 📍 Profile Addresses - Address Management
 *
 * Component pentru managementul adreselor favorite
 * CRUD operations, consistent styling, React icons
 * Clean UI fără business logic
 */

'use client';

import { Building2, Edit3, Home, MapPin, Plus, Star, StarOff, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAddresses } from '../../hooks/useAddresses';
import type { CreateAddressData, FavoriteAddress } from '../../types/profile.types';

interface ProfileAddressesProps {
  readonly isLoading?: boolean;
}

const ADDRESS_LABELS = [
  { value: 'Home', icon: Home, color: 'text-emerald-600' },
  { value: 'Work', icon: Building2, color: 'text-blue-600' },
  { value: 'Other', icon: MapPin, color: 'text-neutral-600' },
] as const;

export function ProfileAddresses({ isLoading = false }: ProfileAddressesProps) {
  const {
    addresses,
    isLoading: addressesLoading,
    error,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAddresses();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateAddressData>({
    label: 'Home',
    full_address: '',
    street_name: '',
    street_number: '',
    county: '',
    country: 'Romania',
    additional_info: '',
  });

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateAddress(editingId, formData);
        setEditingId(null);
      } else {
        await createAddress(formData);
        setIsAddingNew(false);
      }
      resetForm();
    } catch (err) {
      console.error('Failed to save address:', err);
    }
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingId(null);
    resetForm();
  };

  const handleEdit = (address: FavoriteAddress) => {
    setFormData({
      label: address.label,
      full_address: address.full_address,
      street_name: address.street_name || '',
      street_number: address.street_number || '',
      county: address.county || '',
      country: address.country || 'Romania',
      additional_info: address.additional_info || '',
    });
    setEditingId(address.id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddress(id);
      } catch (err) {
        console.error('Failed to delete address:', err);
      }
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id);
    } catch (err) {
      console.error('Failed to set default address:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      label: 'Home',
      full_address: '',
      street_name: '',
      street_number: '',
      county: '',
      country: 'Romania',
      additional_info: '',
    });
  };

  const getLabelIcon = (label: string) => {
    const labelConfig = ADDRESS_LABELS.find(l => l.value === label) || ADDRESS_LABELS[2];
    const IconComponent = labelConfig.icon;
    return <IconComponent className={`w-4 h-4 ${labelConfig.color}`} />;
  };

  if (isLoading || addressesLoading) {
    return (
      <div className='bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6'>
        <div className='animate-pulse space-y-4'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-full' />
            <div className='h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-32' />
          </div>
          <div className='space-y-3'>
            <div className='h-16 bg-neutral-200 dark:bg-neutral-700 rounded-lg' />
            <div className='h-16 bg-neutral-200 dark:bg-neutral-700 rounded-lg' />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6'>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center'>
            <MapPin className='w-5 h-5 text-blue-600' />
          </div>
          <div>
            <h3 className='text-lg font-semibold text-neutral-900 dark:text-white'>
              Favorite Addresses
            </h3>
            <p className='text-sm text-neutral-600 dark:text-neutral-400'>
              Manage your saved locations
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsAddingNew(true)}
          className='inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium'
        >
          <Plus className='w-4 h-4' />
          Add Address
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className='mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3'>
          <p className='text-red-600 dark:text-red-400 text-sm'>{error}</p>
        </div>
      )}

      {/* Address List */}
      {addresses.length === 0 && !isAddingNew ? (
        <div className='text-center py-8'>
          <MapPin className='w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3' />
          <p className='text-neutral-500 dark:text-neutral-400 mb-4'>No addresses saved yet</p>
          <button
            onClick={() => setIsAddingNew(true)}
            className='inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm'
          >
            <Plus className='w-4 h-4' />
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className='space-y-4'>
          {addresses.map(address => (
            <div
              key={address.id}
              className='flex items-start gap-4 p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors'
            >
              <div className='flex-shrink-0 mt-1'>{getLabelIcon(address.label)}</div>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2 mb-1'>
                  <h4 className='font-medium text-neutral-900 dark:text-white'>{address.label}</h4>
                  {address.is_default && (
                    <span className='inline-flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-full text-xs font-medium'>
                      <Star className='w-3 h-3' />
                      Default
                    </span>
                  )}
                </div>
                <p className='text-sm text-neutral-600 dark:text-neutral-400 mb-1'>
                  {address.full_address}
                </p>
                {address.additional_info && (
                  <p className='text-xs text-neutral-500 dark:text-neutral-500'>
                    {address.additional_info}
                  </p>
                )}
              </div>
              <div className='flex items-center gap-1'>
                {!address.is_default && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className='p-2 text-neutral-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors'
                    title='Set as default'
                  >
                    <StarOff className='w-4 h-4' />
                  </button>
                )}
                <button
                  onClick={() => handleEdit(address)}
                  className='p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors'
                  title='Edit address'
                >
                  <Edit3 className='w-4 h-4' />
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  className='p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors'
                  title='Delete address'
                >
                  <Trash2 className='w-4 h-4' />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Form */}
      {(isAddingNew || editingId) && (
        <div className='mt-6 p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800/50'>
          <h4 className='font-medium text-neutral-900 dark:text-white mb-4'>
            {editingId ? 'Edit Address' : 'Add New Address'}
          </h4>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2'>
                Label
              </label>
              <select
                value={formData.label}
                onChange={e => setFormData(prev => ({ ...prev, label: e.target.value }))}
                className='w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                {ADDRESS_LABELS.map(label => (
                  <option key={label.value} value={label.value}>
                    {label.value}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2'>
                County
              </label>
              <input
                type='text'
                value={formData.county}
                onChange={e => setFormData(prev => ({ ...prev, county: e.target.value }))}
                placeholder='County'
                className='w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2'>
                Country
              </label>
              <input
                type='text'
                value={formData.country}
                onChange={e => setFormData(prev => ({ ...prev, country: e.target.value }))}
                placeholder='Country'
                className='w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2'>
                Street Name *
              </label>
              <input
                type='text'
                value={formData.street_name}
                onChange={e => setFormData(prev => ({ ...prev, street_name: e.target.value }))}
                placeholder='Street name'
                className='w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2'>
                Street Number *
              </label>
              <input
                type='text'
                value={formData.street_number}
                onChange={e => setFormData(prev => ({ ...prev, street_number: e.target.value }))}
                placeholder='Number'
                className='w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                required
              />
            </div>
            <div className='md:col-span-2'>
              <label className='block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2'>
                Additional Info
              </label>
              <input
                type='text'
                value={formData.additional_info}
                onChange={e => setFormData(prev => ({ ...prev, additional_info: e.target.value }))}
                placeholder='Apartment, floor, etc.'
                className='w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>
          </div>
          <div className='flex gap-3 mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700'>
            <button
              onClick={handleSave}
              disabled={!formData.street_name?.trim() || !formData.street_number?.trim()}
              className='px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium'
            >
              {editingId ? 'Update Address' : 'Save Address'}
            </button>
            <button
              onClick={handleCancel}
              className='px-4 py-2 text-neutral-600 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 border border-neutral-300 dark:border-neutral-600 rounded-lg transition-colors text-sm'
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
