import { CTASection, HeroSection, ServicesSection } from '@/components/sections';
import { FleetSection3D } from '@/components/sections/FleetSection/FleetSection3D';

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

      {/* CTA Section - Config driven */}
      <CTASection />
    </>
  );
}
