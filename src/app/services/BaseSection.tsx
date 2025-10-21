'use client';
import React from 'react';
import { Container } from '@/components/layout/Container';

/**
 * 🧱 BaseSection – reusable content area
 */
export function BaseSection() {
  return (
    <section className='py-16 bg-neutral-50 dark:bg-neutral-900'>
      <Container>
        <div className='prose dark:prose-invert mx-auto text-center'>
          <h2 className='text-3xl font-bold mb-6'>Welcome to Services</h2>
          <p className='text-lg text-neutral-600 dark:text-neutral-300'>
            This section was generated automatically with Vantage Lane Page Generator v3.1.0. You
            can now add components or content here.
          </p>

          {/* Example content structure */}
          <div className='grid md:grid-cols-2 gap-8 mt-12 text-left'>
            <div className='not-prose'>
              <h3 className='text-xl font-semibold mb-4'>Feature One</h3>
              <p className='text-neutral-600 dark:text-neutral-300'>
                Add your content here. This section is fully customizable.
              </p>
            </div>
            <div className='not-prose'>
              <h3 className='text-xl font-semibold mb-4'>Feature Two</h3>
              <p className='text-neutral-600 dark:text-neutral-300'>
                Perfect for showcasing key features or information.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
export default BaseSection;
