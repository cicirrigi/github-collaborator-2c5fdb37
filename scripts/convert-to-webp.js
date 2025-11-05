#!/usr/bin/env node

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const sourceDir = '/Users/cristianmacbookpro/Downloads/Poze masini fundal transparent';
const outputDir = path.join(__dirname, '../public/images/vehicles-webp');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function convertToWebP() {
  try {
    const files = fs.readdirSync(sourceDir);
    const pngFiles = files.filter(file => file.toLowerCase().endsWith('.png'));

    // console.log(`🚀 Converting ${pngFiles.length} PNG images to WebP...`);

    for (let i = 0; i < pngFiles.length; i++) {
      const file = pngFiles[i];
      const inputPath = path.join(sourceDir, file);
      const outputFileName = file.replace(/\.png$/i, '.webp');
      const outputPath = path.join(outputDir, outputFileName);

      // console.log(`📸 Converting ${i + 1}/${pngFiles.length}: ${file}`);

      await sharp(inputPath)
        .webp({
          quality: 85,
          alphaQuality: 95, // High quality for transparency
          effort: 4, // Good compression efficiency
          lossless: false, // Allow lossy compression for smaller files
        })
        .toFile(outputPath);

      const inputStats = fs.statSync(inputPath);
      const outputStats = fs.statSync(outputPath);
      const _savings = (((inputStats.size - outputStats.size) / inputStats.size) * 100).toFixed(1);

      // console.log(`✅ ${file} → ${outputFileName} (${savings}% smaller)`);
    }

    // console.log(`🎉 Successfully converted ${pngFiles.length} images to WebP format!`);
    // console.log(`📁 Output directory: ${outputDir}`);
  } catch (_error) {
    // console.error('❌ Error converting images:', error.message);
    process.exit(1);
  }
}

convertToWebP();
