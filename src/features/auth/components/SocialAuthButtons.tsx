/**
 * 🔗 SocialAuthButtons Component - Vantage Lane 2.0
 *
 * Social auth providers (Google, Apple, LinkedIn)
 * Orchestrat și scalabil
 */

'use client';

import { FcGoogle } from 'react-icons/fc';
import { FaApple, FaLinkedin } from 'react-icons/fa';

import type { SocialAuthButtonsProps, SocialProvider } from '../types/auth.types';
import { authTokens as tokens } from '../tokens/authTokens';

const providerConfig = {
  google: {
    icon: FcGoogle,
    label: 'Continue with Google',
  },
  apple: {
    icon: FaApple,
    label: 'Continue with Apple',
  },
  linkedin: {
    icon: FaLinkedin,
    label: 'Continue with LinkedIn',
  },
} as const;

export function SocialAuthButtons({
  onProviderClick,
  isLoading = false,
  disabled = false,
}: SocialAuthButtonsProps) {
  // Explicit provider list for better control and consistency
  const providers: SocialProvider[] = ['google', 'apple'];

  return (
    <>
      {/* Divider */}
      <div className={tokens.divider.container}>
        <div className={tokens.divider.line} />
        <span className={tokens.divider.text}>or continue with</span>
        <div className={tokens.divider.line} />
      </div>

      {/* Social Buttons */}
      <div className={tokens.social.container}>
        {providers.map(provider => {
          const config = providerConfig[provider];
          const Icon = config.icon;

          return (
            <button
              key={provider}
              type='button'
              onClick={() => !isLoading && onProviderClick(provider)}
              disabled={disabled || isLoading}
              aria-busy={isLoading}
              aria-label={`Sign in with ${provider}`}
              className={tokens.button.social.base}
            >
              <Icon className={tokens.sizes.icon} />
              {config.label}
            </button>
          );
        })}
      </div>
    </>
  );
}
