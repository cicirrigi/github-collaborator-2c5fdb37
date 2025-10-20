'use client';
import React from 'react';
import { Container } from '@/components/layout/Container';

/**
 * 🏆 HeroSection – responsive + pure Tailwind (v3.1 Clean)
 * ✅ No hardcoded colors
 * ✅ Pure Tailwind classes
 * ✅ CSS custom properties ready
 */
export function HeroSection() {
  return (
    <section className="relative text-center py-16 md:py-24 bg-gradient-to-b from-neutral-900 to-neutral-800 text-white">
      <Container>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white">
          Contact
        </h1>
        <p className="mx-auto max-w-xl text-lg md:text-xl text-neutral-300 text-balance">
          Discover premium experiences with Vantage Lane — crafted for elegance and performance.
        </p>
      </Container>
    </section>
  );
}
export default HeroSection;
