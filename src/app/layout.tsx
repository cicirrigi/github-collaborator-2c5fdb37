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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className='dark' suppressHydrationWarning>
      <body
        className={cn(
          inter.className,
          'min-h-screen antialiased transition-colors duration-300',
          'selection:bg-brand-primary/20 selection:text-brand-primary'
        )}
        suppressHydrationWarning
      >
        <ThemeProvider attribute='class' defaultTheme='dark' disableTransitionOnChange={false}>
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  );
}
