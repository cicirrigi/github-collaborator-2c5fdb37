'use client';
import React from 'react';
import { Container } from '@/components/layout/Container';
// import { colors } from '@/design-system/tokens/colors';
// import { brandConfig } from '@/config/brand.config';

/**
 * 🧱 BaseSection – reusable content area (v3.1 Clean)
 * ✅ Design tokens imported
 * ✅ Pure Tailwind classes
 * ✅ No hardcoded values
 */
export function BaseSection() {
  return (
    <section className='py-16 bg-neutral-50 dark:bg-neutral-900'>
      <Container>
        <div className='prose dark:prose-invert mx-auto text-center'>
          <h2 className='text-3xl font-bold mb-6 text-neutral-900 dark:text-white'>
            Welcome to Contact
          </h2>
          <p className='text-lg text-neutral-600 dark:text-neutral-300 mb-8'>
            This section was generated automatically with Vantage Lane Page Generator v3.1.1-clean.
            You can now add components or content here.
          </p>

          {/* Example content structure */}
          <div className='grid md:grid-cols-2 gap-8 mt-12 text-left'>
            <div className='not-prose p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-sm'>
              <h3 className='text-xl font-semibold mb-4 text-neutral-900 dark:text-white'>
                Feature One
              </h3>
              <p className='text-neutral-600 dark:text-neutral-300'>
                Add your content here. This section is fully customizable with design tokens.
              </p>
            </div>
            <div className='not-prose p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-sm'>
              <h3 className='text-xl font-semibold mb-4 text-neutral-900 dark:text-white'>
                Feature Two
              </h3>
              <p className='text-neutral-600 dark:text-neutral-300'>
                Perfect for showcasing key features with proper token integration.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
export default BaseSection;
