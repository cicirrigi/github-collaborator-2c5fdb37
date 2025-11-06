import HeroSection from './HeroSection';
import BaseSection from './BaseSection';
import { ServicesConfig } from './Services.config';
import { getPageMetadata } from '@/lib/seo';

// 🎯 Migrat la sistemul SEO centralizat
export const metadata = getPageMetadata('/services');

export default function ServicesPage() {
  return (
    <>
      {ServicesConfig.hero && <HeroSection />}
      <BaseSection />
    </>
  );
}
