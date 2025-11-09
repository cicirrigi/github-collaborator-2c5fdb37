/**
 * 🖼️ NarrativeImage Component
 * Visual side: Interactive grid with split image
 */

'use client';

import { motion } from 'framer-motion';
import type React from 'react';

import VantageImageGrid from '@/components/ui/VantageImageGrid';
import type { NarrativeVisual } from '../NarrativeSection.types';
import { narrativeTokens } from '../NarrativeSection.tokens';

const tokens = narrativeTokens;

interface NarrativeImageProps {
  /** Visual configuration */
  visual: NarrativeVisual;
}

export function NarrativeImage({ visual }: NarrativeImageProps): React.JSX.Element {
  // URL encode the image path (spaces → %20)
  const encodedImageUrl = visual.src.replace(/ /g, '%20');

  return (
    <motion.div
      className={tokens.layout.imageColumn}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      viewport={{ once: true }}
    >
      <div className='flex items-center justify-center pt-12'>
        <VantageImageGrid imageUrl={encodedImageUrl} gridCols={4} gridRows={4} />
      </div>
    </motion.div>
  );
}
