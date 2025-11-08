import { CTASection, HeroSection, ServicesSection, TestimonialsNew } from '@/components/sections';
import { FleetSection3D } from '@/components/sections/FleetSection/FleetSection3D';
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

      {/* Services/Benefits Section - Config driven */}
      <ServicesSection />

      {/* Premium Fleet Showcase - 3D Flip Cards */}
      <FleetSection3D maxVehicles={6} />

      {/* Client Testimonials - New Carousel Layout */}
      <TestimonialsNew variant='carousel' />

      {/* CTA Section - Config driven */}
      <CTASection />
    </>
  );
}
