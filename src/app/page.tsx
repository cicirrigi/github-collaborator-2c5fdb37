'use client';

export const dynamic = 'force-dynamic';

import { FleetSection3D as FleetSection } from '@/components/sections/FleetSection';
import { HeroSection } from '@/components/sections/HeroSection';
import { NarrativeSection } from '@/components/sections/NarrativeSection';
import { NewsletterSection } from '@/components/sections/NewsletterSection';
import { PricingSection } from '@/components/sections/PricingSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { TestimonialsNew } from '@/components/sections/TestimonialsNew';
import { VantageAssuranceSection } from '@/components/sections/VantageAssuranceSection';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { BookingWizard } from '@/features/booking/wizard/BookingWizard';

/**
 * 🏠 Homepage - Orchestrated modular page
 *
 * Features:
 * - Modular section architecture
 * - Config-driven content
 * - Reusable components
 * - Clean orchestrator pattern
 * - Easy to maintain & extend
 * - Integrated booking wizard
 */
export default function HomePage() {
  return (
    <>
      {/* Hero Section - Config driven */}
      <HeroSection />

      {/* Elegant Separator */}
      <SectionDivider />

      {/* Booking Wizard - Step 1 Integration */}
      <section className='relative py-16'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <h2 className='text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent'>
              Book Your Journey
            </h2>
            <p className='text-xl text-amber-200/80 max-w-3xl mx-auto'>
              Experience our luxury booking system - same interface, same excellence as our team
              uses
            </p>
          </div>
          <BookingWizard />
        </div>
      </section>

      {/* Elegant Separator */}
      <SectionDivider />

      {/* Services/Benefits Section - Config driven */}
      <ServicesSection />

      {/* Elegant Separator */}
      <SectionDivider />

      {/* Brand Narrative - Philosophy & Experience */}
      <NarrativeSection />

      {/* Elegant Separator */}
      <SectionDivider />

      {/* Premium Fleet Showcase - 3D Flip Cards */}
      <FleetSection maxVehicles={6} />

      {/* Elegant Separator */}
      <SectionDivider />

      {/* Pricing Section - Transparent Rates */}
      <PricingSection />

      {/* Elegant Separator */}
      <SectionDivider />

      {/* Vantage Assurance - Trust & Prestige */}
      <VantageAssuranceSection />

      {/* Elegant Separator */}
      <SectionDivider />

      {/* Client Testimonials - New Carousel Layout */}
      <TestimonialsNew variant='carousel' />

      {/* Elegant Separator */}
      <SectionDivider />

      {/* Newsletter Subscription */}
      <NewsletterSection />
    </>
  );
}
