import { HeroSection } from '@/components/sections/HeroSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { TestimonialsNew } from '@/components/sections/TestimonialsNew';
import { FleetSection3D as FleetSection } from '@/components/sections/FleetSection';
import { NewsletterSection } from '@/components/sections/NewsletterSection';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { getPageMetadata } from '@/lib/seo';

// 🎯 SEO Metadata pentru Homepage - CRITIC pentru SEO!
export const metadata = getPageMetadata('/');

/**
 * 🏠 Homepage - Orchestrated modular page
 *
 * Features:
 * - Modular section architecture
 * - Config-driven content
 * - Reusable components
 * - Clean orchestrator pattern
 * - Easy to maintain & extend
 */
export default function HomePage() {
  return (
    <>
      {/* Hero Section - Config driven */}
      <HeroSection />

      {/* Elegant Separator */}
      <SectionDivider />

      {/* Services/Benefits Section - Config driven */}
      <ServicesSection />

      {/* Elegant Separator */}
      <SectionDivider />

      {/* Premium Fleet Showcase - 3D Flip Cards */}
      <FleetSection maxVehicles={6} />

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
