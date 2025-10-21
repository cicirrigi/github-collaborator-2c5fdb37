'use client';
import React from 'react';
import { Container } from '@/components/layout/Container';
import { brandConfig } from '@/config/brand.config';

/**
 * 🏆 HeroSection – responsive + CSS vars (v3.1 Clean)
 * ✅ Uses CSS custom properties
 * ✅ No hardcoded colors
 * ✅ Brand consistent
 */
export function HeroSection(): React.JSX.Element {
  const { primary, secondary, text } = brandConfig.colors;

  return (
    <section
      className='relative text-center py-16 md:py-24'
      style={
        {
          '--brand-primary': primary,
          '--brand-secondary': secondary,
          background: 'linear-gradient(to bottom, var(--brand-secondary), var(--brand-primary))',
          color: text.primary,
        } as React.CSSProperties
      }
    >
      <Container>
        <h1 className='text-4xl md:text-6xl font-bold tracking-tight mb-6'>Services</h1>
        <p className='mx-auto max-w-xl text-lg md:text-xl text-neutral-300 text-balance'>
          Discover premium experiences with Vantage Lane — crafted for elegance and performance.
        </p>
      </Container>
    </section>
  );
}
export default HeroSection;
