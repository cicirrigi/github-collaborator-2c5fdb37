# Images Directory Structure

This directory contains all images for the Vantage Lane website, organized by category for better maintainability.

## 📁 Directory Structure

```
/images/
├── hero/              # Hero images for all pages (19 WebP files)
├── models/            # Car model images (11 PNG + 7 SVG files)
├── payment/           # Payment method logos (9 PNG + 1 SVG files)
├── illustrations/     # General illustrations and photos (9 WebP + 3 JPG/SVG files)
├── animations/        # Animation assets (1 WebP file)
└── unused-images/     # Archive of old PNG/JPG files (30 files, ~23MB)
```

## 🎯 Category Details

### **Hero Images** (`/hero/`)
- All hero images for ServiceHero components
- Account page hero images (Dashboard, Profile, Billing, My Journeys)
- Service page hero images (City-to-City, Airport, Limousine, etc.)
- Main page hero images (Partners, Corporate, Members, Events)
- **Format:** WebP optimized (85-95% size reduction vs original PNG)

### **Models** (`/models/`)
- Car model images for fleet display
- PNG files: BMW 5/7 Series, Mercedes E/S-Class, V-Class, Range Rover
- SVG files: Fallback icons for vehicle types
- **Usage:** Fleet pages, vehicle selection, booking forms

### **Payment** (`/payment/`)
- Payment method logos (Visa, Mastercard, AmEx, Apple Pay, etc.)
- Stripe branding assets
- **Format:** PNG for compatibility with payment systems

### **Illustrations** (`/illustrations/`)
- Landing page hero images
- About page photos and illustrations
- Company logos and branding assets
- General website imagery
- **Format:** Mixed WebP, JPG, SVG

### **Animations** (`/animations/`)
- Animated assets and graphics
- **Format:** WebP for optimal performance

### **Unused Images** (`/unused-images/`)
- Archive of original PNG/JPG files replaced by WebP
- **Size:** ~23MB total (vs ~2MB active images)
- **Status:** Safe to delete or move elsewhere

## ⚡ Performance Impact

**Before Reorganization:**
- Images scattered across multiple directories
- Mixed PNG/JPG formats (1MB+ each)
- Total payload: ~15MB

**After Reorganization:**
- All images in organized `/images/` structure
- WebP format with 85-90% size reduction
- Total payload: ~2MB (87% reduction)

## 🔧 Code References

All image references in the codebase have been updated to use the new structure:

```typescript
// Hero images
backgroundImage="/images/hero/City to city hero.webp"

// Car models  
image="/images/models/BMW-5-Series.png"

// Payment logos
src="/images/payment/Visa.png"

// Illustrations
src="/images/illustrations/landing-hero.jpg"
```

## 📋 Maintenance

- **Adding new images:** Place in appropriate category folder
- **Optimization:** Use WebP format for photos, PNG for logos, SVG for icons
- **Naming:** Use descriptive names with spaces/hyphens
- **Archive:** Move unused files to `/unused-images/` folder

---
*Last updated: 2025-10-04*
*Total space saved: ~21MB (87% reduction)*
