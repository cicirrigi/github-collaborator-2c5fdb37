/**
 * 💬 Auth Messages Tokens - Vantage Lane 2.0
 *
 * Text content centralizat pentru toate mesajele Auth
 * User-friendly și i18n ready
 */

export const authMessageTokens = {
  /**
   * Forgot Password Messages
   */
  forgotPassword: {
    instructions: "Enter your email address and we'll send you a link to reset your password.",
    success: 'Password reset email sent successfully! Check your inbox.',
    userNotFound: 'No account found for this email address.',
    generic: 'Failed to send reset email. Please try again.',
  },

  /**
   * Reset Password Messages
   */
  resetPassword: {
    instructions: 'Enter your new password below.',
    success: 'Password updated successfully! Redirecting to sign in...',
    tokenMissing: 'Reset token is missing. Please use the link from your email.',
    tokenInvalid: 'Reset link has expired or is invalid. Please request a new one.',
    generic: 'Failed to update password. Please try again.',
  },

  /**
   * Common Auth Messages
   */
  common: {
    loading: 'Loading...',
    tryAgain: 'Please try again.',
    backToSignIn: '← Back to Sign In',
    signInNow: 'Sign in now →',
    requestNewLink: 'Request new reset link →',
  },

  /**
   * Validation Messages (for enhanced error handling)
   */
  validation: {
    emailRequired: 'Email is required',
    emailInvalid: 'Please enter a valid email address',
    passwordRequired: 'Password is required',
    passwordTooShort: 'Password must be at least 8 characters long',
    passwordsNoMatch: "Passwords don't match",
    termsRequired: 'You must accept the terms and conditions',
  },
} as const;
