import HeroSection from './HeroSection';
import BaseSection from './BaseSection';
import { ContactConfig } from './Contact.config';
import { getPageMetadata } from '@/lib/seo';

// 🎯 Migrat la sistemul SEO centralizat
export const metadata = getPageMetadata('/contact');

export default function ContactPage() {
  return (
    <>
      {ContactConfig.hero && <HeroSection />}
      <BaseSection />
    </>
  );
}
