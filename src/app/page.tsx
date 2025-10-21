import { CarFront, Clock, CreditCard, Search, UserCheck } from 'lucide-react';
import Link from 'next/link';

import { Section } from '@/components/layout';
import {
  Button,
  LuxuryCard,
  Text,
  PinContainerDemo,
  // FloatingDockDemo,
  BookingTabsDemo,
  LocationPickerDemo,
  TravelPlannerDemo,
} from '@/components/ui';
import { homeContent } from '@/config/content.config';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Section spacing='xl' background='gradient' align='center'>
        <div className='mx-auto max-w-4xl text-center'>
          <Text variant='h1' className='mb-6 text-white'>
            {homeContent.hero.title}
            <span className='block text-brand-primary'>{homeContent.hero.subtitle}</span>
          </Text>
          <Text variant='lead' className='mb-8 text-neutral-300'>
            {homeContent.hero.description}
          </Text>
          <Button size='lg'>{homeContent.hero.cta}</Button>
        </div>
      </Section>

      {/* Benefits Section cu LuxuryCard */}
      <Section spacing='lg' contained>
        <div className='mb-12 text-center'>
          <Text variant='h2' className='mb-4'>
            Why Choose Our Service
          </Text>
          <Text variant='lead'>
            We&apos;re London&apos;s premium taxi service chauffeur platform where choice meets
            transparency.
          </Text>
        </div>

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5'>
          <LuxuryCard
            variant='shimmer'
            size='md'
            hover='shimmer'
            as={Link}
            href='/book-instantly'
            icon={<Search className='h-full w-full' strokeWidth={1.2} />}
            title='Book Instantly'
            description='Competitive rates with full transparency, premium vehicles, and instant confirmation - all in seconds.'
          />

          <LuxuryCard
            variant='shimmer'
            size='md'
            hover='shimmer'
            as={Link}
            href='/chauffeurs'
            icon={<UserCheck className='h-full w-full' strokeWidth={1.2} />}
            title='Professional Chauffeurs'
            description='Licensed, vetted, and experienced drivers providing exceptional service and local knowledge.'
          />

          <LuxuryCard
            variant='shimmer'
            size='md'
            hover='shimmer'
            as={Link}
            href='/fleet-details'
            icon={<CarFront className='h-full w-full' strokeWidth={1.2} />}
            title='The Finest Fleet'
            description='Prestige vehicles, curated with care from fully licensed operators.'
          />

          <LuxuryCard
            variant='shimmer'
            size='md'
            hover='shimmer'
            as={Link}
            href='/payments'
            icon={<CreditCard className='h-full w-full' strokeWidth={1.2} />}
            title='Secure Payments'
            description='Safe and convenient payment options with transparent pricing and instant confirmation.'
          />

          <LuxuryCard
            variant='shimmer'
            size='md'
            hover='shimmer'
            as={Link}
            href='/support'
            icon={<Clock className='h-full w-full' strokeWidth={1.2} />}
            title='Available 24/7'
            description='Round-the-clock service for airport transfers, business meetings, and special occasions.'
          />
        </div>
      </Section>

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

      {/* Booking Navigation Demo Section */}
      <Section spacing='lg' align='center'>
        <div className='text-center mb-12'>
          <Text variant='h2' className='mb-4'>
            Modern Booking Interface
          </Text>
          <Text variant='lead'>Elegant pill-shaped navigation for seamless booking experience</Text>
        </div>
        <BookingTabsDemo />
      </Section>

      {/* Location Picker Demo Section */}
      <Section spacing='lg' align='center'>
        <div className='text-center mb-12'>
          <Text variant='h2' className='mb-4'>
            Smart Location Selection
          </Text>
          <Text variant='lead'>Google Places integration with elegant pill-shaped inputs</Text>
        </div>
        <LocationPickerDemo />
      </Section>

      {/* Travel Planner Demo Section */}
      <Section spacing='xl' align='center'>
        <TravelPlannerDemo />
      </Section>

      {/* CTA Section */}
      <Section spacing='lg' background='neutral' align='center'>
        <div className='text-center'>
          <Text variant='h2' className='mb-4'>
            {homeContent.cta.title}
          </Text>
          <Text variant='lead' className='mb-8'>
            {homeContent.cta.subtitle}
          </Text>
          <Button size='lg'>{homeContent.cta.button}</Button>
        </div>
      </Section>
    </>
  );
}
