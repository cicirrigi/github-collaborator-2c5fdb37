import { envsafe, str } from 'envsafe';

/**
 * Safe environment variables with build-time fallbacks
 *
 * This prevents build failures when environment variables are missing
 * while still enforcing validation in runtime environments.
 */

const isBuild = process.env.NODE_ENV === 'production' && !process.env.VERCEL;

// 🔒 CLIENT-SAFE Environment Validation
export const safeClientEnv = envsafe({
  // Supabase (client-safe - NEXT_PUBLIC_)
  NEXT_PUBLIC_SUPABASE_URL: isBuild ? str({ devDefault: 'https://mock.supabase.co' }) : str(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: isBuild
    ? str({ devDefault: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock' })
    : str(),

  // Analytics (client-safe)
  NEXT_PUBLIC_VERCEL_ANALYTICS_ID: str({ default: '' }),
  NEXT_PUBLIC_SENTRY_DSN: str({ default: '' }),
})

// 🚫 SERVER-ONLY Environment Validation
export const safeServerEnv = envsafe({
  // Supabase (server-only)
  SUPABASE_SERVICE_KEY: isBuild
    ? str({ devDefault: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-service' })
    : str(),

  // Stripe (Critical - always required in runtime)
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: isBuild ? str({ devDefault: 'pk_test_mock_key' }) : str(),
  STRIPE_SECRET_KEY: isBuild ? str({ devDefault: 'sk_test_mock_key' }) : str(),
  STRIPE_WEBHOOK_SECRET: isBuild ? str({ devDefault: 'whsec_mock_secret' }) : str(),

  // Email (Critical)
  RESEND_API_KEY: isBuild ? str({ devDefault: 're_mock_api_key' }) : str(),

  // Google Maps (Critical)
  GOOGLE_MAPS_API_KEY: isBuild ? str({ devDefault: 'AIzaSyMockKey' }) : str(),

  // Optional services (safe defaults)
  OPENAI_API_KEY: str({
    default: '',
  }),
  NEXT_PUBLIC_VERCEL_ANALYTICS_ID: str({
    default: '',
  }),
  SENTRY_DSN: str({
    default: '',
  }),
  UPSTASH_REDIS_REST_URL: str({
    default: '',
  }),
  UPSTASH_REDIS_REST_TOKEN: str({
    default: '',
  }),
});

/**
 * Use this for critical application logic that requires validated env vars
 * Examples: Database connections, API authentication, payment processing
 */
// ⚠️ DEPRECATED: Legacy export for backward compatibility
// @deprecated Use safeClientEnv for client code, safeServerEnv for server code
export default safeClientEnv;
