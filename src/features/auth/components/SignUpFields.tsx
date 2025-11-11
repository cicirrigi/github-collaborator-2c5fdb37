/**
 * 📝 SignUpFields - Campos específicos para Sign Up
 * firstName, lastName, phone cu acordeon smooth
 */

'use client';

import { cn } from '@/lib/utils/cn';
import type { AuthMode } from '../types/auth.types';
import { AuthField } from './AuthField';
import { authTokens as tokens } from '../tokens/authTokens';

interface SignUpFieldsProps {
  mode: AuthMode;
  register: any;
  errors: any;
  isLoading: boolean;
}

export function SignUpFields({ mode, register, errors, isLoading }: SignUpFieldsProps) {
  return (
    <div
      className={cn(
        `transition-all ${tokens.accordion.durations.signUp} ${tokens.accordion.easing.container}`,
        mode === 'signup'
          ? `${tokens.accordion.maxHeights.signUp} opacity-100 mb-6 overflow-visible`
          : 'max-h-0 opacity-0 mb-0 overflow-hidden'
      )}
    >
      <div
        className={cn(
          `${tokens.spacing.fieldGap} transition-opacity ${tokens.accordion.durations.content} ${tokens.accordion.easing.content}`,
          mode === 'signup' ? 'delay-100 opacity-100' : 'delay-0 opacity-0'
        )}
      >
        <div className={`grid grid-cols-1 md:grid-cols-2 ${tokens.spacing.gridGap}`}>
          <AuthField
            name='firstName'
            label='First Name'
            type='text'
            placeholder='John'
            required
            autoComplete='given-name'
            register={register}
            errors={errors}
            disabled={isLoading}
          />

          <AuthField
            name='lastName'
            label='Last Name'
            type='text'
            placeholder='Doe'
            required
            autoComplete='family-name'
            register={register}
            errors={errors}
            disabled={isLoading}
          />
        </div>

        <AuthField
          name='phone'
          label='Phone Number'
          type='tel'
          placeholder='+44 123 456 7890'
          autoComplete='tel'
          register={register}
          errors={errors}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
