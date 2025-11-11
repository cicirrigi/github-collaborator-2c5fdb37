/**
 * 📝 AuthField Component - Vantage Lane 2.0
 *
 * Reusable form field pentru Auth
 * Integrated cu react-hook-form
 */

'use client';

import type { UseFormRegister, FieldErrors, FieldValues } from 'react-hook-form';
import { cn } from '@/lib/utils/cn';

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
  const error = errors[name]?.message as string | undefined;
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
        className={cn(
          tokens.input.base,
          tokens.input.background,
          tokens.input.border,
          tokens.input.focus,
          tokens.input.placeholder,
          hasError && tokens.input.error,
          disabled && tokens.input.disabled
        )}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...register(name as any)}
      />

      {hasError && <p className={tokens.typography.error.base}>{error}</p>}
    </div>
  );
}
