import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import Layout from '@/components/layout/Layout';
import { siteMetadata } from '@/config/site.config';
import { cn } from '@/lib/utils/cn';
import { ThemeProvider } from '@/providers/theme-provider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Use config instead of hardcoded values
export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
  manifest: '/manifest.json',

  // Open Graph for social sharing
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://vantagelane.com',
    siteName: 'Vantage Lane',
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Vantage Lane - Premium Chauffeur Services',
      },
    ],
  },

  // Twitter Cards
  twitter: {
    card: 'summary_large_image',
    site: '@VantageLane',
    creator: '@VantageLane',
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: ['/images/twitter-image.png'],
  },

  // Apple Web App
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Vantage Lane',
  },

  // Format detection
  formatDetection: {
    telephone: false,
  },

  // Icons optimization
  icons: {
    icon: [
      { url: '/icons/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/icon-180x180.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/icons/icon-192x192.png',
  },

  // Additional meta tags
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Vantage Lane',
    'application-name': 'Vantage Lane',
    'msapplication-TileColor': '#CBB26A',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#CBB26A',
    'color-scheme': 'dark light',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className='dark' suppressHydrationWarning>
      <head>
        {/* PWA Icons */}
        <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
        <link rel='icon' type='image/x-icon' href='/favicon.ico' />
        <link rel='icon' type='image/png' sizes='32x32' href='/icons/icon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/icons/icon-16x16.png' />

        {/* PWA Manifest */}
        <link rel='manifest' href='/manifest.json' />

        {/* Theme Colors */}
        <meta name='theme-color' content='#CBB26A' />
        <meta name='theme-color' media='(prefers-color-scheme: light)' content='#CBB26A' />
        <meta name='theme-color' media='(prefers-color-scheme: dark)' content='#CBB26A' />

        {/* Apple PWA */}
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='black-translucent' />
        <meta name='apple-mobile-web-app-title' content='Vantage Lane' />

        {/* Microsoft */}
        <meta name='application-name' content='Vantage Lane' />
        <meta name='msapplication-TileColor' content='#CBB26A' />
        <meta name='msapplication-config' content='/browserconfig.xml' />

        {/* Additional PWA Meta */}
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='format-detection' content='telephone=no' />
      </head>
      <body
        className={cn(
          inter.className,
          'min-h-screen antialiased transition-colors duration-300',
          'selection:bg-brand-primary/20 selection:text-brand-primary'
        )}
        suppressHydrationWarning
      >
        <ThemeProvider attribute='class' defaultTheme='dark' disableTransitionOnChange={true}>
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  );
}
