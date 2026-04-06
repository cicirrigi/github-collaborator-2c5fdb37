'use client';



/**
 * 📧 Email Verification Page
 *
 * Displayed after successful signup
 * Shows instructions to check email and verify account
 */



import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Mail, RefreshCw } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Redirect if no email provided
    if (!email) {
      router.push('/auth/signup');
    }
  }, [email, router]);

  // Countdown timer for rate limiting
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [countdown]);

  const handleResendEmail = async () => {
    if (!email || countdown > 0) return;

    setIsResending(true);
    setResendError(null);
    setResendSuccess(false);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        // Check for rate limit error
        if (error.message?.includes('can only request this after')) {
          const match = error.message.match(/after (\d+) seconds/);
          const seconds = match ? parseInt(match[1]) : 60;
          setCountdown(seconds);
          setResendError(`Please wait ${seconds} seconds before requesting another email.`);
        } else {
          setResendError('Failed to resend email. Please try again later.');
        }
      } else {
        setResendSuccess(true);
        setCountdown(60); // Set 60 second cooldown after successful send
        setTimeout(() => setResendSuccess(false), 5000);
      }
    } catch {
      setResendError('An error occurred. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className='min-h-screen bg-neutral-900 flex items-center justify-center p-6'>
      <div className='w-full max-w-md'>
        {/* Back to Sign In */}
        <button
          onClick={() => router.push('/auth/signin')}
          className='flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors'
        >
          <ArrowLeft className='w-4 h-4' />
          Back to Sign In
        </button>

        {/* Main Card */}
        <div className='bg-neutral-800 rounded-2xl p-8 border border-neutral-700'>
          {/* Icon */}
          <div className='w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 mx-auto'>
            <Mail className='w-8 h-8 text-emerald-500' />
          </div>

          {/* Title */}
          <h1 className='text-2xl font-semibold text-white text-center mb-3'>Check your email</h1>

          {/* Description */}
          <p className='text-neutral-400 text-center mb-6'>We sent a verification link to</p>

          {/* Email Display */}
          <div className='bg-neutral-900 rounded-lg px-4 py-3 mb-6 text-center'>
            <p className='text-white font-medium break-all'>{email}</p>
          </div>

          {/* Instructions */}
          <div className='space-y-3 mb-8'>
            <div className='flex items-start gap-3'>
              <div className='w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5'>
                <span className='text-emerald-500 text-xs font-bold'>1</span>
              </div>
              <p className='text-neutral-300 text-sm'>Click the verification link in your email</p>
            </div>
            <div className='flex items-start gap-3'>
              <div className='w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5'>
                <span className='text-emerald-500 text-xs font-bold'>2</span>
              </div>
              <p className='text-neutral-300 text-sm'>You&apos;ll be redirected back to sign in</p>
            </div>
            <div className='flex items-start gap-3'>
              <div className='w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5'>
                <span className='text-emerald-500 text-xs font-bold'>3</span>
              </div>
              <p className='text-neutral-300 text-sm'>
                Check your spam folder if you don&apos;t see it
              </p>
            </div>
          </div>

          {/* Resend Section */}
          <div className='pt-6 border-t border-neutral-700'>
            <p className='text-neutral-400 text-sm text-center mb-4'>
              Didn&apos;t receive the email?
            </p>

            {resendSuccess && (
              <div className='bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-2 mb-4'>
                <p className='text-emerald-500 text-sm text-center'>
                  ✓ Email sent! Check your inbox.
                </p>
              </div>
            )}

            {resendError && (
              <div className='bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2 mb-4'>
                <p className='text-red-500 text-sm text-center'>{resendError}</p>
              </div>
            )}

            <button
              onClick={handleResendEmail}
              disabled={isResending || countdown > 0}
              className='w-full bg-neutral-700 hover:bg-neutral-600 disabled:bg-neutral-800 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2'
            >
              <RefreshCw className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />
              {isResending
                ? 'Sending...'
                : countdown > 0
                  ? `Wait ${countdown}s to resend`
                  : 'Resend verification email'}
            </button>
          </div>
        </div>

        {/* Help Text */}
        <p className='text-neutral-500 text-xs text-center mt-6'>
          Having trouble? Contact{' '}
          <a href='mailto:support@vantagelane.com' className='text-emerald-500 hover:underline'>
            support@vantagelane.com
          </a>
        </p>
      </div>
    </div>
  );
}
