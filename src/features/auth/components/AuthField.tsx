/**
 * 📝 AuthField Component - Vantage Lane 2.0
 *
 * Reusable form field pentru Auth
 * Integrated cu react-hook-form + password visibility toggle
 */

'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import type { FieldValues, UseFormRegister, FieldErrors, Path } from 'react-hook-form';

import { authTokens as tokens } from '../tokens/authTokens';

interface AuthFieldProps<T extends FieldValues = FieldValues> {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'tel';
  placeholder?: string | undefined;
  required?: boolean | undefined;
  autoComplete?: string | undefined;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  disabled?: boolean | undefined;
}

export function AuthField<T extends FieldValues = FieldValues>({
  name,
  label,
  type,
  placeholder,
  required = false,
  autoComplete,
  register,
  errors,
  disabled = false,
}: AuthFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const fieldError = errors?.[name as keyof T];
  const error = typeof fieldError?.message === 'string' ? fieldError.message : undefined;
  const hasError = !!error;

  // Determine actual input type (toggle password visibility)
  const inputType = type === 'password' && showPassword ? 'text' : type;
  const isPasswordField = type === 'password';

  return (
    <div>
      <label
        htmlFor={name}
        className={cn(tokens.typography.label.base, required && tokens.typography.label.required)}
      >
        {label}
      </label>

      {/* Input Container with optional password toggle */}
      <div className='relative'>
        <input
          id={name}
          type={inputType}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          className={cn(
            tokens.input.base,
            tokens.input.default,
            tokens.input.focus,
            hasError && tokens.input.error,
            disabled && tokens.input.disabled,
            isPasswordField && 'pr-10', // Add padding for password toggle button
            'focus:outline-none appearance-none'
          )}
          aria-invalid={hasError}
          aria-required={required}
          aria-describedby={hasError ? `${name}-error` : undefined}
          {...register(name as Path<T>)}
        />

        {/* Password Visibility Toggle */}
        {isPasswordField && (
          <button
            type='button'
            className={cn(
              // Fixed positioning - no transform that can cause movement
              'absolute right-2 top-2 bottom-2 w-8',
              'flex items-center justify-center',
              // Stable hover area and colors
              'text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300',
              'transition-colors duration-150 focus:outline-none focus:text-neutral-600 dark:focus:text-neutral-300',
              // Prevent cursor changes during hover
              'select-none touch-manipulation',
              disabled && 'cursor-not-allowed opacity-50'
            )}
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? (
              // Eye Slash (hide) Icon
              <svg
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24' />
                <line x1='1' y1='1' x2='23' y2='23' />
              </svg>
            ) : (
              // Eye (show) Icon
              <svg
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
                <circle cx='12' cy='12' r='3' />
              </svg>
            )}
          </button>
        )}
      </div>

      {hasError && (
        <p id={`${name}-error`} className={tokens.typography.error.base}>
          {error}
        </p>
      )}
    </div>
  );
}
