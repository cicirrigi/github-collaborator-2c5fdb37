import { Section } from '@/components/layout';
import { CTASection, HeroSection, ServicesSection } from '@/components/sections';
import { PinContainerDemo, Text } from '@/components/ui';

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

      {/* Premium Fleet Showcase */}
      <Section spacing='lg' align='center'>
        <div className='text-center mb-12'>
          <Text variant='h2' className='mb-4'>
            Our Premium Fleet
          </Text>
          <Text variant='lead'>Experience luxury with our BMW executive collection</Text>
        </div>
        <PinContainerDemo />
      </Section>

      {/* CTA Section - Config driven */}
      <CTASection />
    </>
  );
}
