/**
 * 🔒 CLIENT-SIDE Environment Variables
 * ⚠️ SECURITY: Only NEXT_PUBLIC_ variables are safe for client-side usage
 * Never expose server secrets here!
 */

// ✅ CLIENT-SAFE: Public environment variables
export const clientEnv = {
  // Supabase (client-safe)
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co',
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key',
  
  // Stripe (client-safe)  
  STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_mock',
  
  // Analytics (client-safe)
  VERCEL_ANALYTICS_ID: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID || '',
  SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN || '',
} as const

// 🚫 SERVER-ONLY: Use serverEnv for server-side code only
// This should only be imported in API routes, server actions, or server components
export const serverEnv = {
  // Supabase (server-only)
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY || 'mock-service-key',
  
  // Stripe (server-only)
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || 'sk_test_mock', 
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_mock',
  
  // Email (server-only)
  RESEND_API_KEY: process.env.RESEND_API_KEY || 'mock-resend-key',
  
  // Maps (server-only)
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyMock',
  
  // AI (server-only)
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  
  // Monitoring (server-only)
  SENTRY_DSN: process.env.SENTRY_DSN || '',
} as const

// ⚠️ DEPRECATED: Use clientEnv or serverEnv instead
// @deprecated Use clientEnv for client code, serverEnv for server code
export const env = clientEnv
