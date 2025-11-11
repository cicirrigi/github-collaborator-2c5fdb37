/**
 * 📝 AuthField Component - Vantage Lane 2.0
 *
 * Reusable form field pentru Auth
 * Integrated cu react-hook-form
 */

'use client';

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
  const fieldError = errors?.[name as keyof T];
  const error = typeof fieldError?.message === 'string' ? fieldError.message : undefined;
  const hasError = !!error;

  return (
    <div>
      <label
        htmlFor={name}
        className={cn(tokens.typography.label.base, required && tokens.typography.label.required)}
      >
        {label}
      </label>

      <input
        id={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        style={{
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          appearance: 'none',
          outline: 'none',
        }}
        className='w-full text-left py-2.5 px-5 text-sm rounded-lg bg-gradient-to-br from-white/95 via-neutral-50/90 to-white/95 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 border-2 border-t-neutral-700/40 border-l-neutral-700/40 border-b-neutral-800 border-r-neutral-800 dark:border-t-white/5 dark:border-l-white/5 dark:border-b-black dark:border-r-black shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)] text-neutral-900 dark:text-white transition-all duration-200 hover:scale-[1.02]'
        aria-invalid={hasError}
        aria-describedby={hasError ? `${name}-error` : undefined}
        {...register(name as Path<T>)}
      />

      {hasError && (
        <p id={`${name}-error`} className={tokens.typography.error.base}>
          {error}
        </p>
      )}
    </div>
  );
}
