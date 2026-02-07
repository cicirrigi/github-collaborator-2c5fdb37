/**
 * 👤 Profile Basic Info - Personal Information Form
 *
 * Component pentru editarea informațiilor de bază ale profilului
 * Clean, fără logic hardcodat, responsive
 */

'use client';

import { Calendar, Mail, Save, User, X } from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';
import type { ProfileFormData } from '../../types/profile.types';
import { PhoneInputField } from '../shared/PhoneInputField';

interface ProfileBasicInfoProps {
  readonly initialData: ProfileFormData;
  readonly onSave: (data: ProfileFormData) => Promise<void>;
  readonly isLoading?: boolean;
}

const ProfileBasicInfoComponent = ({
  initialData,
  onSave,
  isLoading = false,
}: ProfileBasicInfoProps) => {
  const [formData, setFormData] = useState<ProfileFormData>(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync formData with updated initialData when profile refetches
  // Only sync if not in editing mode to preserve user changes
  useEffect(() => {
    if (!isEditing) {
      setFormData(initialData);
    }
  }, [initialData, isEditing]);

  const handleSave = async () => {
    if (isSaving) return;

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      await onSave(formData);
      setIsEditing(false);
      setSaveSuccess(true);

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout with ref
      timeoutRef.current = setTimeout(() => {
        setSaveSuccess(false);
        timeoutRef.current = null;
      }, 5000);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialData);
    setIsEditing(false);
  };

  const updateField = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className='bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6'>
      {/* Success/Error Messages */}
      {saveSuccess ? (
        <div className='mb-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-4 animate-pulse'>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 bg-green-500 rounded-full flex items-center justify-center'>
              <span className='text-white font-bold text-lg'>✓</span>
            </div>
            <p className='text-green-800 dark:text-green-200 font-semibold'>
              Profile updated successfully! 🎉
            </p>
          </div>
        </div>
      ) : null}

      {saveError && (
        <div className='mb-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4'>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 bg-red-500 rounded-full flex items-center justify-center'>
              <span className='text-white font-bold text-lg'>✕</span>
            </div>
            <p className='text-red-800 dark:text-red-200 font-semibold'>❌ {saveError}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center'>
            <User className='w-5 h-5 text-amber-600' />
          </div>
          <div>
            <h3 className='text-lg font-semibold text-neutral-900 dark:text-white'>
              Personal Information
            </h3>
            <p className='text-sm text-neutral-500 dark:text-neutral-400'>
              Update your basic profile details
            </p>
          </div>
        </div>

        {!isEditing && !isLoading && (
          <button
            onClick={() => setIsEditing(true)}
            className='px-4 py-2 text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors'
          >
            Edit
          </button>
        )}
      </div>

      {/* Form Fields */}
      <div className='space-y-6'>
        {/* Name Fields - 2 Columns on Desktop */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* First Name */}
          <FormField
            icon={User}
            label='First Name'
            value={formData.first_name}
            placeholder='Enter your first name'
            isEditing={isEditing}
            onChange={value => updateField('first_name', value)}
          />

          {/* Last Name */}
          <FormField
            icon={User}
            label='Last Name'
            value={formData.last_name}
            placeholder='Enter your last name'
            isEditing={isEditing}
            onChange={value => updateField('last_name', value)}
          />
        </div>

        {/* Email - Full Width (readonly with helper text) */}
        <FormField
          icon={Mail}
          label='Email Address'
          value={formData.email}
          placeholder='Enter your email'
          type='email'
          isEditing={false} // Email is readonly - changed via separate flow
          readOnly
          helperText='To change your email, use the security settings'
        />

        {/* Contact Fields - 2 Columns on Desktop */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Phone */}
          <PhoneInputField
            label='Phone Number'
            value={formData.phone}
            placeholder='Enter your phone number'
            isEditing={isEditing}
            onChange={(value: string) => updateField('phone', value)}
          />

          {/* Date of Birth */}
          <FormField
            icon={Calendar}
            label='Date of Birth'
            value={formData.date_of_birth}
            placeholder='Select your date of birth'
            type='date'
            isEditing={isEditing}
            onChange={value => updateField('date_of_birth', value)}
          />
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className='flex items-center gap-3 mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800'>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className='inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-400 text-black font-medium rounded-lg transition-colors text-sm'
          >
            <Save className='w-4 h-4' />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>

          <button
            onClick={handleCancel}
            disabled={isSaving}
            className='inline-flex items-center gap-2 px-4 py-2 text-neutral-600 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 disabled:opacity-50 transition-colors text-sm'
          >
            <X className='w-4 h-4' />
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

// Memoized export to prevent excessive re-renders
export const ProfileBasicInfo = memo(ProfileBasicInfoComponent);

interface FormFieldProps {
  readonly icon: React.ComponentType<{ className?: string }>;
  readonly label: string;
  readonly value: string;
  readonly placeholder: string;
  readonly type?: string;
  readonly isEditing: boolean;
  readonly readOnly?: boolean;
  readonly helperText?: string;
  readonly onChange?: (value: string) => void;
}

function FormField({
  icon: Icon,
  label,
  value,
  placeholder,
  type = 'text',
  isEditing,
  readOnly = false,
  helperText,
  onChange,
}: FormFieldProps) {
  return (
    <div>
      <label className='block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2'>
        {label}
      </label>

      <div className='relative'>
        <div className='absolute left-3 top-1/2 transform -translate-y-1/2'>
          <Icon className='w-4 h-4 text-neutral-400' />
        </div>

        {isEditing && !readOnly ? (
          <input
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={e => onChange?.(e.target.value)}
            className='w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-1 focus:ring-amber-500 dark:focus:ring-amber-400 transition-colors'
          />
        ) : (
          <div className='w-full pl-10 pr-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 text-neutral-900 dark:text-white'>
            {value || <span className='text-neutral-400'>Not provided</span>}
          </div>
        )}
      </div>

      {helperText && (
        <p className='mt-1 text-xs text-neutral-500 dark:text-neutral-400'>{helperText}</p>
      )}
    </div>
  );
}
