/**
 * 📧 UnsubscribeModal Component
 * Reusable modal for unsubscribe functionality
 */

'use client';

import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { X, Mail, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { unsubscribeModalTokens } from './UnsubscribeModal.tokens';
import type { UnsubscribeModalProps, UnsubscribeState } from './UnsubscribeModal.types';

/**
 * UnsubscribeModal - Premium unsubscribe modal
 * 
 * @example
 * <UnsubscribeModal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   onConfirm={handleUnsubscribe}
 * />
 */
export function UnsubscribeModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Unsubscribe from Newsletter",
  description = "We're sorry to see you go. Please confirm your email address to unsubscribe from our newsletter.",
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
      if (onConfirm) {
        await onConfirm(showEmailInput ? email : undefined);
      }
      setInternalState('success');
      // Auto-close after success
      setTimeout(() => {
        onClose();
      }, 2000);
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

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter={`ease-out duration-150`}
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave={`ease-in duration-150`}
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div 
            className="fixed inset-0"
            style={{
              backgroundColor: tokens.backdrop.backgroundColor,
              backdropFilter: tokens.backdrop.backdropBlur,
            }}
          />
        </Transition.Child>

        {/* Modal container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter={`ease-out duration-200`}
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave={`ease-in duration-200`}
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={cn(
                  'w-full transform overflow-hidden border text-left align-middle transition-all',
                  className
                )}
                style={{
                  maxWidth: tokens.modal.maxWidth,
                  backgroundColor: tokens.modal.backgroundColor,
                  borderColor: tokens.modal.borderColor,
                  borderRadius: tokens.modal.borderRadius,
                  padding: `${tokens.modal.padding.mobile}`,
                  backdropFilter: tokens.modal.backdropBlur,
                  boxShadow: tokens.modal.shadow,
                }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <Mail className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                    </div>
                    <Dialog.Title
                      style={{
                        fontSize: tokens.typography.title.fontSize,
                        lineHeight: tokens.typography.title.lineHeight,
                        fontWeight: tokens.typography.title.fontWeight,
                        color: tokens.typography.title.color,
                        margin: 0,
                      }}
                    >
                      {title}
                    </Dialog.Title>
                  </div>
                  
                  <button
                    onClick={handleClose}
                    disabled={isLoading}
                    className="flex-shrink-0 p-1 rounded-md transition-colors hover:bg-neutral-800/50"
                  >
                    <X className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                  </button>
                </div>

                {/* Success State */}
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4"
                  >
                    <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4"
                         style={{ backgroundColor: tokens.states.success.backgroundColor }}>
                      <Check className="w-6 h-6" style={{ color: tokens.states.success.iconColor }} />
                    </div>
                    <p style={{ color: tokens.states.success.textColor, fontSize: '0.875rem' }}>
                      You've been successfully unsubscribed. We're sorry to see you go!
                    </p>
                  </motion.div>
                )}

                {/* Error State */}
                {error && !isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 p-3 rounded-lg mb-4"
                    style={{ 
                      backgroundColor: tokens.states.error.backgroundColor,
                      border: `1px solid ${tokens.states.error.iconColor}`,
                    }}
                  >
                    <AlertCircle className="w-4 h-4" style={{ color: tokens.states.error.iconColor }} />
                    <p style={{ color: tokens.states.error.textColor, fontSize: '0.875rem', margin: 0 }}>
                      {error}
                    </p>
                  </motion.div>
                )}

                {/* Form Content */}
                {!isSuccess && (
                  <>
                    <p
                      style={{
                        fontSize: tokens.typography.description.fontSize,
                        lineHeight: tokens.typography.description.lineHeight,
                        color: tokens.typography.description.color,
                        marginBottom: tokens.typography.description.marginBottom,
                      }}
                    >
                      {description}
                    </p>

                    {/* Email Input */}
                    {showEmailInput && (
                      <div style={{ marginBottom: tokens.form.input.marginBottom }}>
                        <input
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isLoading}
                          className="w-full border focus:outline-none focus:ring-2 transition-all"
                          style={{
                            padding: tokens.form.input.padding,
                            backgroundColor: tokens.form.input.backgroundColor,
                            borderColor: error && !isSuccess ? tokens.states.error.iconColor : tokens.form.input.borderColor,
                            borderRadius: tokens.form.input.borderRadius,
                            fontSize: tokens.form.input.fontSize,
                            color: tokens.form.input.color,
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = tokens.form.input.focusBorderColor;
                            e.target.style.boxShadow = `0 0 0 2px ${tokens.form.input.focusRingColor}`;
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = tokens.form.input.borderColor;
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end" style={{ gap: tokens.buttons.spacing }}>
                      <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="border transition-colors"
                        style={{
                          padding: tokens.buttons.cancel.padding,
                          backgroundColor: tokens.buttons.cancel.backgroundColor,
                          borderColor: tokens.buttons.cancel.borderColor,
                          color: tokens.buttons.cancel.color,
                          borderRadius: tokens.buttons.cancel.borderRadius,
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = tokens.buttons.cancel.hoverBackgroundColor;
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = tokens.buttons.cancel.backgroundColor;
                        }}
                      >
                        Cancel
                      </button>
                      
                      <PremiumButton
                        variant="destructive"
                        size="sm"
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
    </Transition>
  );
}

export type { UnsubscribeModalProps, UnsubscribeState } from './UnsubscribeModal.types';
