/**
 * 📧 UnsubscribeModal Component - Simple Version
 * Reusable modal for unsubscribe functionality without external dependencies
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { unsubscribeModalTokens } from './UnsubscribeModal.tokens';
import type { UnsubscribeModalProps, UnsubscribeState } from './UnsubscribeModal.types';

/**
 * UnsubscribeModal - Simple unsubscribe modal
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
  
  const isLoading = externalLoading || internalState === 'loading';
  const isSuccess = externalSuccess || internalState === 'success';
  const error = externalError || internalError;

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

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, isLoading, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0"
            style={{
              backgroundColor: tokens.backdrop.backgroundColor,
              backdropFilter: tokens.backdrop.backdropBlur,
            }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn('relative w-full border', className)}
            style={{
              maxWidth: tokens.modal.maxWidth,
              backgroundColor: tokens.modal.backgroundColor,
              borderColor: tokens.modal.borderColor,
              borderRadius: tokens.modal.borderRadius,
              padding: tokens.modal.padding.mobile,
              backdropFilter: tokens.modal.backdropBlur,
              boxShadow: tokens.modal.shadow,
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-neutral-400" />
                <h2
                  className="font-semibold"
                  style={{
                    fontSize: tokens.typography.title.fontSize,
                    color: tokens.typography.title.color,
                  }}
                >
                  {title}
                </h2>
              </div>
              
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="p-1 rounded-md transition-colors hover:bg-neutral-800/50 disabled:opacity-50"
              >
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            {/* Success State */}
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div 
                  className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: tokens.states.success.backgroundColor }}
                >
                  <Check className="w-6 h-6" style={{ color: tokens.states.success.iconColor }} />
                </div>
                <p className="text-sm" style={{ color: tokens.states.success.textColor }}>
                  You&apos;ve been successfully unsubscribed. We&apos;re sorry to see you go!
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
                <p className="text-sm" style={{ color: tokens.states.error.textColor }}>
                  {error}
                </p>
              </motion.div>
            )}

            {/* Form Content */}
            {!isSuccess && (
              <>
                <p
                  className="mb-6"
                  style={{
                    fontSize: tokens.typography.description.fontSize,
                    color: tokens.typography.description.color,
                  }}
                >
                  {description}
                </p>

                {/* Email Input */}
                {showEmailInput && (
                  <div className="mb-4">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="w-full border focus:outline-none focus:ring-0 transition-all"
                      style={{
                        padding: tokens.form.input.padding,
                        backgroundColor: tokens.form.input.backgroundColor,
                        borderColor: error && !isSuccess ? tokens.states.error.iconColor : tokens.form.input.borderColor,
                        borderRadius: tokens.form.input.borderRadius,
                        fontSize: tokens.form.input.fontSize,
                        color: tokens.form.input.color,
                        boxShadow: 'none',
                      }}
                      onFocus={(e) => {
                        const target = e.target as HTMLInputElement;
                        target.style.borderColor = 'var(--brand-primary)';
                        target.style.boxShadow = '0 0 0 0.5px var(--brand-primary)';
                      }}
                      onBlur={(e) => {
                        const target = e.target as HTMLInputElement;
                        target.style.borderColor = tokens.form.input.borderColor;
                        target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={handleClose}
                    disabled={isLoading}
                    className="px-4 py-2 border rounded-lg transition-colors hover:bg-neutral-800/50 disabled:opacity-50"
                    style={{
                      borderColor: tokens.buttons.cancel.borderColor,
                      color: tokens.buttons.cancel.color,
                    }}
                  >
                    Cancel
                  </button>
                  
                  <PremiumButton
                    variant="primary"
                    size="sm"
                    loading={isLoading}
                    disabled={isLoading}
                    onClick={handleConfirm}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isLoading ? 'Unsubscribing...' : 'Unsubscribe'}
                  </PremiumButton>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
