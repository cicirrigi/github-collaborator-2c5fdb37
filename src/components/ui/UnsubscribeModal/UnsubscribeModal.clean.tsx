/**
 * 📧 UnsubscribeModal - Clean & Modular Implementation
 * Premium unsubscribe modal following project architecture
 */

'use client';

import { useState, useEffect, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { X, Mail, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { unsubscribeModalTokens } from './UnsubscribeModal.tokens';
import type { UnsubscribeModalProps, UnsubscribeState } from './UnsubscribeModal.types';

/**
 * UnsubscribeModal - Premium unsubscribe modal with Portal
 * - Clean modular architecture
 * - Design tokens orchestration
 * - Portal rendering to escape container constraints
 * - Body scroll lock
 * - Accessibility compliant
 */
export function UnsubscribeModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Unsubscribe from Newsletter',
  description = "We're sorry to see you go. Please confirm your email address to unsubscribe.",
  showEmailInput = true,
  isLoading: externalLoading = false,
  isSuccess: externalSuccess = false,
  error: externalError,
  className,
}: UnsubscribeModalProps) {
  const tokens = unsubscribeModalTokens;

  const [email, setEmail] = useState('');
  const [internalState, setInternalState] = useState<UnsubscribeState>('idle');
  const [internalError, setInternalError] = useState('');

  // Use external state if provided, otherwise use internal
  const isLoading = externalLoading || internalState === 'loading';
  const isSuccess = externalSuccess || internalState === 'success';
  const error = externalError || internalError;

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setInternalState('idle');
      setInternalError('');
    }
  }, [isOpen]);

  // Body scroll lock when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
    };
  }, [isOpen]);

  const handleConfirm = async () => {
    if (showEmailInput && !email.trim()) {
      setInternalError('Please enter your email address.');
      return;
    }

    // Email validation if input is shown
    if (showEmailInput) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setInternalError('Please enter a valid email address.');
        return;
      }
    }

    setInternalError('');
    setInternalState('loading');

    try {
      await onConfirm?.(showEmailInput ? email : undefined);
      setInternalState('success');
    } catch (err) {
      setInternalError(err instanceof Error ? err.message : 'Failed to unsubscribe');
      setInternalState('error');
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  // Render modal in document.body using Portal to escape parent containers
  if (typeof window === 'undefined') return null;

  return createPortal(
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-[9999]' onClose={handleClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter={tokens.animations.backdrop.enter}
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave={tokens.animations.backdrop.leave}
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div
            className='fixed inset-0'
            style={{
              backgroundColor: tokens.backdrop.backgroundColor,
              backdropFilter: tokens.backdrop.backdropBlur,
              zIndex: 9998,
            }}
          />
        </Transition.Child>

        {/* Modal container */}
        <div className='fixed inset-0 overflow-y-auto' style={{ zIndex: 9999 }}>
          <div className='flex min-h-full items-center justify-center p-4'>
            <Transition.Child
              as={Fragment}
              enter={tokens.animations.modal.enter}
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave={tokens.animations.modal.leave}
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel
                className={cn(
                  'w-full transform overflow-hidden text-left transition-all',
                  className
                )}
                style={{
                  backgroundColor: tokens.modal.backgroundColor,
                  border: `1px solid ${tokens.modal.borderColor}`,
                  borderRadius: tokens.modal.borderRadius,
                  padding: tokens.modal.padding,
                  maxWidth: tokens.modal.maxWidth,
                  boxShadow: tokens.modal.boxShadow,
                  backdropFilter: tokens.modal.backdropBlur,
                }}
              >
                {/* Header */}
                <div className='flex items-start justify-between mb-4'>
                  <div className='flex items-center gap-3'>
                    <Mail className='w-5 h-5' style={{ color: tokens.icon.color }} />
                    <Dialog.Title
                      className='text-lg font-semibold'
                      style={{ color: tokens.title.color }}
                    >
                      {title}
                    </Dialog.Title>
                  </div>
                  <button
                    className='rounded-lg p-2 hover:bg-white/5 transition-colors'
                    onClick={handleClose}
                    disabled={isLoading}
                  >
                    <X className='w-4 h-4' style={{ color: tokens.closeButton.color }} />
                  </button>
                </div>

                {/* Success State */}
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className='text-center py-4'
                  >
                    <div
                      className='mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4'
                      style={{ backgroundColor: tokens.states.success.backgroundColor }}
                    >
                      <Check
                        className='w-6 h-6'
                        style={{ color: tokens.states.success.iconColor }}
                      />
                    </div>
                    <p style={{ color: tokens.states.success.textColor, fontSize: '0.875rem' }}>
                      You&rsquo;ve been successfully unsubscribed. We&rsquo;re sorry to see you go!
                    </p>
                  </motion.div>
                )}

                {/* Error State */}
                {error && !isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className='flex items-center gap-2 p-3 rounded-lg mb-4'
                    style={{ backgroundColor: tokens.states.error.backgroundColor }}
                  >
                    <AlertCircle
                      className='w-5 h-5'
                      style={{ color: tokens.states.error.iconColor }}
                    />
                    <p
                      style={{
                        color: tokens.states.error.textColor,
                        fontSize: '0.875rem',
                        margin: 0,
                      }}
                    >
                      {error}
                    </p>
                  </motion.div>
                )}

                {/* Form Content */}
                {!isSuccess && (
                  <>
                    <p
                      className='mb-6'
                      style={{
                        color: tokens.description.color,
                        fontSize: tokens.description.fontSize,
                      }}
                    >
                      {description}
                    </p>

                    {showEmailInput && (
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
                          onChange={e => setEmail(e.target.value)}
                          onFocus={e => {
                            (e.target as HTMLInputElement).style.borderColor =
                              tokens.form.input.focusBorderColor;
                            (e.target as HTMLInputElement).style.boxShadow =
                              tokens.form.input.focusBoxShadow;
                          }}
                          onBlur={e => {
                            (e.target as HTMLInputElement).style.border = tokens.form.input.border;
                            (e.target as HTMLInputElement).style.boxShadow = 'none';
                          }}
                          placeholder='Enter your email address'
                          disabled={isLoading}
                          style={{
                            padding: tokens.form.input.padding,
                            backgroundColor: tokens.form.input.backgroundColor,
                            border: tokens.form.input.border,
                            borderRadius: tokens.form.input.borderRadius,
                            fontSize: tokens.form.input.fontSize,
                            color: tokens.form.input.color,
                            transition: tokens.form.input.transition,
                            width: '100%',
                          }}
                        />
                      </div>
                    )}

                    {/* Actions */}
                    <div className='flex justify-end' style={{ gap: tokens.buttons.spacing }}>
                      <button
                        onClick={handleClose}
                        disabled={isLoading}
                        onMouseEnter={e => {
                          (e.target as HTMLButtonElement).style.backgroundColor =
                            tokens.buttons.cancel.hoverBackgroundColor;
                          (e.target as HTMLButtonElement).style.borderColor =
                            tokens.buttons.cancel.hoverBorderColor;
                          (e.target as HTMLButtonElement).style.color =
                            tokens.buttons.cancel.hoverTextColor;
                        }}
                        onMouseLeave={e => {
                          (e.target as HTMLButtonElement).style.backgroundColor =
                            tokens.buttons.cancel.backgroundColor;
                          (e.target as HTMLButtonElement).style.borderColor =
                            tokens.buttons.cancel.borderColor;
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
                        onClick={handleConfirm}
                      >
                        {isLoading ? 'Unsubscribing...' : 'Unsubscribe'}
                      </PremiumButton>
                    </div>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>,
    document.body
  );
}
