/**
 * 🖼️ Avatar Upload - Profile Picture Management
 *
 * Component pentru upload și preview avatar
 * Clean, fără logic hardcodat, responsive
 */

'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, X, User } from 'lucide-react';

interface AvatarUploadProps {
  readonly currentAvatarUrl: string | null;
  readonly onUpload: (file: File) => Promise<string>;
  readonly onRemove: () => Promise<void>;
  readonly isLoading?: boolean;
}

export function AvatarUpload({
  currentAvatarUrl,
  onUpload,
  onRemove,
  isLoading = false,
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return; // Invalid file type - error handling by parent
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return; // File too large - error handling by parent
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setIsUploading(true);
    try {
      await onUpload(file);
      setPreviewUrl(null);
    } catch {
      setPreviewUrl(null);
      // Error handling by parent component
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    if (isUploading) return;

    setIsUploading(true);
    try {
      await onRemove();
    } catch {
      // Error handling by parent component
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const displayUrl = previewUrl || currentAvatarUrl;

  return (
    <div className='flex items-center gap-6'>
      {/* Avatar Preview */}
      <div className='relative'>
        <div className='w-24 h-24 rounded-full overflow-hidden border-4 border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center'>
          {displayUrl ? (
            <img src={displayUrl} alt='Profile avatar' className='w-full h-full object-cover' />
          ) : (
            <User className='w-8 h-8 text-neutral-400' />
          )}
        </div>

        {/* Loading Overlay */}
        {(isUploading || isLoading) && (
          <div className='absolute inset-0 bg-black/50 rounded-full flex items-center justify-center'>
            <div className='w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin' />
          </div>
        )}

        {/* Camera Icon Overlay */}
        {!isUploading && !isLoading && (
          <button
            onClick={triggerFileSelect}
            className='absolute bottom-0 right-0 w-8 h-8 bg-amber-500 hover:bg-amber-600 text-black rounded-full flex items-center justify-center transition-colors shadow-lg'
          >
            <Camera className='w-4 h-4' />
          </button>
        )}
      </div>

      {/* Upload Controls */}
      <div className='flex-1'>
        <h4 className='font-medium text-neutral-900 dark:text-white mb-2'>Profile Picture</h4>

        <p className='text-sm text-neutral-500 dark:text-neutral-400 mb-4'>
          Upload a photo to personalize your profile. Max 5MB, JPG or PNG.
        </p>

        <div className='flex items-center gap-3'>
          <button
            onClick={triggerFileSelect}
            disabled={isUploading || isLoading}
            className='inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-400 text-black font-medium rounded-lg transition-colors text-sm'
          >
            <Upload className='w-4 h-4' />
            {displayUrl ? 'Change Photo' : 'Upload Photo'}
          </button>

          {displayUrl && !isUploading && !isLoading && (
            <button
              onClick={handleRemove}
              className='inline-flex items-center gap-2 px-4 py-2 text-neutral-600 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400 transition-colors text-sm'
            >
              <X className='w-4 h-4' />
              Remove
            </button>
          )}
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type='file'
        accept='image/jpeg,image/jpg,image/png,image/webp'
        onChange={handleFileSelect}
        className='hidden'
      />
    </div>
  );
}
