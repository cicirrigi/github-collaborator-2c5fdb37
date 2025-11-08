/**
 * 📧 UnsubscribeModal - Modular Architecture
 * Premium unsubscribe modal following project patterns
 */

'use client';

import { useState, useEffect, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { Dialog, Transition } from '@headlessui/react';
import { cn } from '@/lib/utils/cn';
import { unsubscribeModalTokens } from './UnsubscribeModal.tokens';
import type { UnsubscribeModalProps, UnsubscribeState } from './UnsubscribeModal.types';
import { ModalHeader, EmailForm, ActionButtons } from './UnsubscribeModal.parts';
import { SuccessContent, FormContent } from './UnsubscribeModal.content';

/**
 * UnsubscribeModal - Clean modular implementation
 * - Modular parts architecture ✅
 * - Design tokens orchestration ✅
 * - Portal rendering to escape constraints ✅
 * - Body scroll lock ✅
 * - ~100 lines main component ✅
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
                <ModalHeader title={title} onClose={handleClose} isLoading={isLoading} />

                {isSuccess ? (
                  <SuccessContent />
                ) : (
                  <FormContent description={description} error={error}>
                    <EmailForm
                      email={email}
                      onEmailChange={setEmail}
                      isLoading={isLoading}
                      showEmailInput={showEmailInput}
                    />
                    <ActionButtons
                      onCancel={handleClose}
                      onConfirm={handleConfirm}
                      isLoading={isLoading}
                    />
                  </FormContent>
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
