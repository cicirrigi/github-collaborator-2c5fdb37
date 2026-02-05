import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // 🔧 Temporarily disabled for production build (strict typing)
  typedRoutes: false,
  images: {
    formats: ['image/webp', 'image/avif'],
    qualities: [50, 75, 90, 95],
    unoptimized: process.env.NODE_ENV === 'development', // Dezactivez optimization în dev
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // 🔐 Enterprise Security Headers
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(self "localhost:3002"), payment=(), usb=()',
          },
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel-scripts.com js.stripe.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; img-src 'self' data: blob: *.supabase.co images.unsplash.com; frame-src 'self' *.stripe.com *.stripe.network; connect-src 'self' *.supabase.co *.stripe.com vitals.vercel-insights.com *.sentry.io *.ingest.sentry.io;",
          },
          // 🎯 Performance & Caching
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          // 🔒 Privacy
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
      // 🤖 Special headers for robots.txt and security files
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
      {
        source: '/.well-known/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
          {
            key: 'Content-Type',
            value: 'text/plain; charset=utf-8',
          },
        ],
      },
    ];
  },
};

// Export with Sentry configuration for production builds
export default process.env.NODE_ENV === 'production' &&
process.env.SENTRY_ORG &&
process.env.SENTRY_PROJECT_FRONTEND
  ? withSentryConfig(nextConfig, {
      // Sentry webpack plugin options
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT_FRONTEND,
      silent: true, // Suppresses source map uploading logs during build
      widenClientFileUpload: true, // Upload a larger set of source maps for prettier stack traces
      reactComponentAnnotation: {
        enabled: true, // Annotate React components for better error messages
      },
      sourcemaps: {
        disable: false, // Keep source maps for debugging
        deleteSourcemapsAfterUpload: true, // Clean up after upload
      },
      disableLogger: true, // Automatically tree-shake Sentry logger statements
      automaticVercelMonitors: true, // Enable automatic Vercel cron job monitoring
    })
  : nextConfig;
