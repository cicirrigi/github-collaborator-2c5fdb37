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
        required={required}
        disabled={disabled}
        className={cn(
          tokens.input.base,
          tokens.input.default,
          tokens.input.focus,
          hasError && tokens.input.error,
          disabled && tokens.input.disabled,
          'focus:outline-none appearance-none'
        )}
        aria-invalid={hasError}
        aria-required={required}
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
