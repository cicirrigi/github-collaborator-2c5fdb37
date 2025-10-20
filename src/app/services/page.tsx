import HeroSection from './HeroSection';
import BaseSection from './BaseSection';
import type { Metadata } from 'next';
import { ServicesMeta } from './Services.meta';
import { ServicesConfig } from './Services.config';

export const metadata: Metadata = ServicesMeta;

export default function ServicesPage() {
  return (
    <>
      {ServicesConfig.hero && <HeroSection />}
      <BaseSection />
    </>
  );
}
