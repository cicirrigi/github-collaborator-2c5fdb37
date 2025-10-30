import { Section } from '@/components/layout';
import {
  PinContainerDemo,
  BookingTabsDemo,
  LocationPickerDemo,
  TravelPlannerDemo,
  Text,
} from '@/components/ui';
import { HeroSection, ServicesSection, CTASection } from '@/components/sections';

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

      {/* Premium Fleet Showcase - Legacy component */}
      <Section spacing='lg' align='center'>
        <div className='text-center mb-12'>
          <Text variant='h2' className='mb-4'>
            Our Premium Fleet
          </Text>
          <Text variant='lead'>Experience luxury with our BMW executive collection</Text>
        </div>
        <PinContainerDemo />
      </Section>

      {/* Booking Navigation Demo Section - Legacy component */}
      <Section spacing='lg' align='center'>
        <div className='text-center mb-12'>
          <Text variant='h2' className='mb-4'>
            Modern Booking Interface
          </Text>
          <Text variant='lead'>Elegant pill-shaped navigation for seamless booking experience</Text>
        </div>
        <BookingTabsDemo />
      </Section>

      {/* Location Picker Demo Section - Legacy component */}
      <Section spacing='lg' align='center'>
        <div className='text-center mb-12'>
          <Text variant='h2' className='mb-4'>
            Smart Location Selection
          </Text>
          <Text variant='lead'>Google Places integration with elegant pill-shaped inputs</Text>
        </div>
        <LocationPickerDemo />
      </Section>

      {/* Travel Planner Demo Section - Legacy component */}
      <Section spacing='xl' align='center'>
        <TravelPlannerDemo />
      </Section>

      {/* CTA Section - Config driven */}
      <CTASection />
    </>
  );
}
