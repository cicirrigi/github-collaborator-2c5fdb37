'use client';

import '@/styles/infinite-moving-cards.css';

import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';

export function InfiniteMovingCardsDemo() {
  return (
    <div className='dark:bg-grid-white/[0.05] relative flex h-[40rem] flex-col items-center justify-center overflow-hidden rounded-md bg-white antialiased dark:bg-black'>
      <InfiniteMovingCards items={clientTestimonials} direction='right' speed='slow' />
    </div>
  );
}

const clientTestimonials = [
  {
    quote:
      'Exceptional service from start to finish. The BMW 7 Series was pristine, and our chauffeur was professional and punctual. Made our wedding day truly special.',
    name: 'Sarah & James Mitchell',
    title: 'Wedding Service - Mayfair',
  },
  {
    quote:
      'I use Vantage Lane for all my business meetings in London. Reliable, luxurious, and always on time. The Mercedes S-Class is perfect for client impressions.',
    name: 'Robert Thornfield',
    title: 'Corporate Executive',
  },
  {
    quote:
      'Airport transfer was seamless. Driver tracked our flight, helped with luggage, and the Range Rover was immaculate. Will definitely book again.',
    name: 'Amanda Chen',
    title: 'International Business Travel',
  },
  {
    quote:
      'For our anniversary dinner, the service was flawless. Beautiful vehicle, discreet chauffeur, and arrived exactly on time. Highly recommended.',
    name: 'David & Emma Blackwood',
    title: 'Special Occasion Service',
  },
  {
    quote:
      'Professional chauffeur service for our corporate event. Multiple vehicles, all coordinated perfectly. The attention to detail was impressive.',
    name: 'Jessica Reynolds',
    title: 'Event Coordinator - City of London',
  },
  {
    quote:
      'Booked last minute for a client meeting. Despite short notice, they delivered a pristine BMW 5 Series with an excellent chauffeur. Saved the day!',
    name: 'Michael Harrison',
    title: 'Investment Banking',
  },
];
