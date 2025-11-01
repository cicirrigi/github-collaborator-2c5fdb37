import { CTASection, HeroSection, ServicesSection } from '@/components/sections';
import { FleetSection } from '@/components/sections/FleetSection';

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

      {/* Premium Fleet Showcase - New Refactored */}
      <FleetSection maxVehicles={6} />

      {/* CTA Section - Config driven */}
      <CTASection />
    </>
  );
}
