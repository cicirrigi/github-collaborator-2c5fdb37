import HeroSection from './HeroSection';
import BaseSection from './BaseSection';
import type { Metadata } from 'next';
import { ContactMeta } from './Contact.meta';
import { ContactConfig } from './Contact.config';

export const metadata: Metadata = ContactMeta;

export default function ContactPage() {
  return (
    <>
      {ContactConfig.hero && <HeroSection />}
      <BaseSection />
    </>
  );
}
