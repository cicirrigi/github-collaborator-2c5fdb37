/**
 * 📧 UnsubscribeModal Parts - Modular Components
 * Reusable UI parts following project architecture
 */

'use client';

import { Dialog } from '@headlessui/react';
import { X, Mail } from 'lucide-react';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { unsubscribeModalTokens } from './UnsubscribeModal.tokens';

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
  isLoading: boolean;
}

export function ModalHeader({ title, onClose, isLoading }: ModalHeaderProps) {
  const tokens = unsubscribeModalTokens;

  return (
    <div className='flex items-start justify-between mb-4'>
      <div className='flex items-center gap-3'>
        <Mail className='w-5 h-5' style={{ color: tokens.icon.color }} />
        <Dialog.Title className='text-lg font-semibold' style={{ color: tokens.title.color }}>
          {title}
        </Dialog.Title>
      </div>
      <button
        className='rounded-lg p-2 hover:bg-white/5 transition-colors'
        onClick={onClose}
        disabled={isLoading}
      >
        <X className='w-4 h-4' style={{ color: tokens.closeButton.color }} />
      </button>
    </div>
  );
}

interface EmailFormProps {
  email: string;
  onEmailChange: (email: string) => void;
  isLoading: boolean;
  showEmailInput: boolean;
}

export function EmailForm({ email, onEmailChange, isLoading, showEmailInput }: EmailFormProps) {
  const tokens = unsubscribeModalTokens;

  if (!showEmailInput) return null;

  return (
    <div className='mb-6'>
      <label
        className='block mb-2'
        style={{
          color: tokens.form.label.color,
          fontSize: tokens.form.label.fontSize,
          fontWeight: tokens.form.label.fontWeight,
          marginBottom: tokens.form.label.marginBottom,
        }}
      >
        Email Address
      </label>
      <input
        type='email'
        value={email}
        onChange={e => onEmailChange(e.target.value)}
        onFocus={e => {
          (e.target as HTMLInputElement).style.borderColor = tokens.form.input.focusBorderColor;
          (e.target as HTMLInputElement).style.boxShadow = tokens.form.input.focusBoxShadow;
        }}
        onBlur={e => {
          (e.target as HTMLInputElement).style.border = tokens.form.input.border;
          (e.target as HTMLInputElement).style.boxShadow = 'none';
        }}
        placeholder='Enter your email address'
        disabled={isLoading}
        style={
          {
            padding: tokens.form.input.padding,
            backgroundColor: tokens.form.input.backgroundColor,
            border: tokens.form.input.border,
            borderRadius: tokens.form.input.borderRadius,
            fontSize: tokens.form.input.fontSize,
            color: tokens.form.input.color,
            transition: tokens.form.input.transition,
            width: '100%',
            // Explicit placeholder styling for theme awareness
            '--placeholder-color': tokens.form.input.placeholderColor,
          } as React.CSSProperties & { '--placeholder-color': string }
        }
        // Ensure placeholder uses theme-aware color
      />
    </div>
  );
}

interface ActionButtonsProps {
  onCancel: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function ActionButtons({ onCancel, onConfirm, isLoading }: ActionButtonsProps) {
  const tokens = unsubscribeModalTokens;

  return (
    <div className='flex justify-end' style={{ gap: tokens.buttons.spacing }}>
      <button
        onClick={onCancel}
        disabled={isLoading}
        onMouseEnter={e => {
          (e.target as HTMLButtonElement).style.backgroundColor =
            tokens.buttons.cancel.hoverBackgroundColor;
          (e.target as HTMLButtonElement).style.borderColor =
            tokens.buttons.cancel.hoverBorderColor;
          (e.target as HTMLButtonElement).style.color = tokens.buttons.cancel.hoverTextColor;
        }}
        onMouseLeave={e => {
          (e.target as HTMLButtonElement).style.backgroundColor =
            tokens.buttons.cancel.backgroundColor;
          (e.target as HTMLButtonElement).style.borderColor = tokens.buttons.cancel.borderColor;
          (e.target as HTMLButtonElement).style.color = tokens.buttons.cancel.color;
        }}
        style={{
          ...tokens.buttons.cancel,
          cursor: isLoading ? 'not-allowed' : tokens.buttons.cancel.cursor,
          opacity: isLoading ? 0.6 : 1,
        }}
      >
        Cancel
      </button>

      <PremiumButton
        variant='primary'
        size='sm'
        loading={isLoading}
        disabled={isLoading}
        onClick={onConfirm}
      >
        {isLoading ? 'Unsubscribing...' : 'Unsubscribe'}
      </PremiumButton>
    </div>
  );
}
