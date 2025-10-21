#!/usr/bin/env node
/**
 * 🛡️ AI Guardian – Page Compliance Mode v1.0
 * ------------------------------------------
 * Scanează automat paginile create cu create-page.js și:
 *  - Detectează hardcodări (#fff, #000 etc.)
 *  - Detectează valori px/rem/em directe
 *  - Confirmă că există importuri de tokeni și brandConfig
 *  - Verifică pattern-ul complet (.config.ts, .meta.ts, .test.tsx)
 *  - Validează conformitatea cu routes.config.ts
 *
 * Usage:
 *   npm run guard:pages
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '../../src/app');
const ROUTES_CONFIG = path.join(__dirname, '../../src/config/routes.config.ts');
const FILE_EXTENSIONS = ['.tsx', '.ts'];
const IGNORE = ['node_modules', 'dist', '.next', 'api'];

class PagePatternChecker {
  constructor() {
    this.results = {
      hardcodedColors: [],
      directUnits: [],
      missingImports: [],
      incompletePatterns: [],
      missingRoutes: [],
      deprecatedPatterns: [],
      totalPages: 0,
      compliantPages: 0,
    };
  }

  walk(dir) {
    try {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (IGNORE.includes(entry.name)) continue;

        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          // Check if this is a page directory
          if (this.isPageDirectory(fullPath)) {
            this.checkPageDirectory(fullPath, entry.name);
          } else {
            this.walk(fullPath);
          }
        }
      }
    } catch (error) {
      console.warn(`⚠️ Could not scan directory: ${dir}`);
    }
  }

  isPageDirectory(dir) {
    try {
      const files = fs.readdirSync(dir);
      return files.includes('page.tsx');
    } catch {
      return false;
    }
  }

  checkPageDirectory(pageDir, pageName) {
    this.results.totalPages++;
    console.log(`🔍 Checking page: ${pageName}`);

    const requiredFiles = ['page.tsx', 'HeroSection.tsx', 'BaseSection.tsx'];
    const recommendedFiles = [
      `${this.toPascalCase(pageName)}.config.ts`,
      `${this.toPascalCase(pageName)}.meta.ts`,
      `${this.toPascalCase(pageName)}.test.tsx`,
    ];

    let issues = 0;

    // Check required files
    for (const file of requiredFiles) {
      const filePath = path.join(pageDir, file);
      if (fs.existsSync(filePath)) {
        this.checkFile(filePath);
      } else {
        this.results.incompletePatterns.push(`${pageName}/${file} - Required file missing`);
        issues++;
      }
    }

    // Check recommended files
    for (const file of recommendedFiles) {
      const filePath = path.join(pageDir, file);
      if (!fs.existsSync(filePath)) {
        this.results.incompletePatterns.push(`${pageName}/${file} - Recommended file missing`);
        issues++;
      } else {
        this.checkConfigFile(filePath);
      }
    }

    // Check for deprecated patterns
    this.checkDeprecatedPatterns(pageDir, pageName);

    // Check route registration
    this.checkRouteRegistration(pageName);

    if (issues === 0) {
      this.results.compliantPages++;
    }
  }

  checkFile(file) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const relativePath = this.getRelativePath(file);

      // Check for hardcoded colors
      const colorMatches = content.match(/#([0-9A-Fa-f]{3,6})\b/g);
      if (colorMatches) {
        this.results.hardcodedColors.push(`${relativePath} - Found: ${colorMatches.join(', ')}`);
      }

      // Check for direct units (but allow some exceptions)
      const unitMatches = content.match(/\b\d+(px|rem|em)\b/g);
      if (unitMatches) {
        // Filter out common exceptions like "0px", line-height values, etc.
        const problematicUnits = unitMatches.filter(
          unit =>
            !unit.startsWith('0') &&
            !content.includes(`line-height: ${unit}`) &&
            !content.includes(`--tw-`) // Tailwind variables
        );

        if (problematicUnits.length > 0) {
          this.results.directUnits.push(`${relativePath} - Found: ${problematicUnits.join(', ')}`);
        }
      }

      // Check for missing token imports in hero/base sections
      const needsTokens = file.includes('HeroSection') || file.includes('BaseSection');
      if (needsTokens && !this.hasTokenImports(content)) {
        this.results.missingImports.push(`${relativePath} - Missing design token imports`);
      }

      // Check for inline styles without token usage
      if (content.includes('style={{') && !this.hasTokenUsage(content)) {
        this.results.missingImports.push(`${relativePath} - Inline styles without tokens`);
      }
    } catch (error) {
      console.warn(`⚠️ Could not read file: ${file}`);
    }
  }

  checkConfigFile(file) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const relativePath = this.getRelativePath(file);

      if (file.endsWith('.config.ts')) {
        // Check for required config properties
        const requiredProps = ['title', 'layout', 'hero'];
        for (const prop of requiredProps) {
          if (!content.includes(`${prop}:`)) {
            this.results.incompletePatterns.push(
              `${relativePath} - Missing required property: ${prop}`
            );
          }
        }
      }

      if (file.endsWith('.meta.ts')) {
        // Check for required meta properties
        const requiredMeta = ['title', 'description', 'openGraph'];
        for (const prop of requiredMeta) {
          if (!content.includes(`${prop}:`)) {
            this.results.incompletePatterns.push(
              `${relativePath} - Missing required meta: ${prop}`
            );
          }
        }
      }
    } catch (error) {
      console.warn(`⚠️ Could not read config file: ${file}`);
    }
  }

  checkDeprecatedPatterns(pageDir, pageName) {
    const files = fs.readdirSync(pageDir);

    // Check for old naming patterns
    const deprecatedFiles = files.filter(
      file =>
        file.includes('_') || // underscore naming
        (file.endsWith('.tsx') &&
          file !== 'page.tsx' &&
          file !== 'HeroSection.tsx' &&
          file !== 'BaseSection.tsx') ||
        file.includes('.component.') || // old component pattern
        file.includes('.page.') // old page pattern
    );

    for (const file of deprecatedFiles) {
      this.results.deprecatedPatterns.push(`${pageName}/${file} - Deprecated naming pattern`);
    }
  }

  checkRouteRegistration(pageName) {
    if (!fs.existsSync(ROUTES_CONFIG)) {
      this.results.missingRoutes.push(`routes.config.ts not found`);
      return;
    }

    try {
      const routesContent = fs.readFileSync(ROUTES_CONFIG, 'utf8');
      const pageSlug = pageName.toLowerCase();

      if (!routesContent.includes(`'${pageSlug}'`) && !routesContent.includes(`"${pageSlug}"`)) {
        this.results.missingRoutes.push(`${pageName} - Not registered in routes.config.ts`);
      }
    } catch (error) {
      this.results.missingRoutes.push(`Could not check routes.config.ts`);
    }
  }

  hasTokenImports(content) {
    return (
      content.includes('designTokens') ||
      content.includes('@/design-system/tokens') ||
      content.includes('@/config/brand.config') ||
      content.includes('brandConfig') ||
      (content.includes('colors') && content.includes('from'))
    );
  }

  hasTokenUsage(content) {
    return (
      content.includes('designTokens.') ||
      content.includes('brandConfig.') ||
      content.includes('colors.') ||
      content.includes('tokens.')
    );
  }

  toPascalCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getRelativePath(file) {
    return path.relative(process.cwd(), file);
  }

  generateReport() {
    console.log('\n🛡️ AI GUARDIAN – PAGE COMPLIANCE REPORT v1.0');
    console.log('=============================================');

    console.log(`\n📊 PAGES SCANNED: ${this.results.totalPages}`);
    console.log(`✅ COMPLIANT PAGES: ${this.results.compliantPages}`);
    console.log(`⚠️ PAGES WITH ISSUES: ${this.results.totalPages - this.results.compliantPages}`);

    if (this.results.hardcodedColors.length) {
      console.log(`\n🚨 HARDCODED COLORS (${this.results.hardcodedColors.length}):`);
      this.results.hardcodedColors.forEach(issue => console.log(`   - ${issue}`));
    } else {
      console.log('\n✅ No hardcoded colors found.');
    }

    if (this.results.directUnits.length) {
      console.log(`\n⚠️ DIRECT SPACING UNITS (${this.results.directUnits.length}):`);
      this.results.directUnits.forEach(issue => console.log(`   - ${issue}`));
    } else {
      console.log('✅ No problematic spacing units found.');
    }

    if (this.results.missingImports.length) {
      console.log(`\n⚠️ MISSING TOKEN IMPORTS (${this.results.missingImports.length}):`);
      this.results.missingImports.forEach(issue => console.log(`   - ${issue}`));
    } else {
      console.log('✅ All required token imports found.');
    }

    if (this.results.incompletePatterns.length) {
      console.log(`\n📋 INCOMPLETE PATTERNS (${this.results.incompletePatterns.length}):`);
      this.results.incompletePatterns.forEach(issue => console.log(`   - ${issue}`));
    } else {
      console.log('✅ All page patterns complete.');
    }

    if (this.results.missingRoutes.length) {
      console.log(`\n🗺️ ROUTE ISSUES (${this.results.missingRoutes.length}):`);
      this.results.missingRoutes.forEach(issue => console.log(`   - ${issue}`));
    } else {
      console.log('✅ All routes properly registered.');
    }

    if (this.results.deprecatedPatterns.length) {
      console.log(`\n🔄 DEPRECATED PATTERNS (${this.results.deprecatedPatterns.length}):`);
      this.results.deprecatedPatterns.forEach(issue => console.log(`   - ${issue}`));
    } else {
      console.log('✅ No deprecated patterns found.');
    }

    const totalIssues =
      this.results.hardcodedColors.length +
      this.results.directUnits.length +
      this.results.missingImports.length +
      this.results.incompletePatterns.length +
      this.results.missingRoutes.length +
      this.results.deprecatedPatterns.length;

    const complianceScore =
      this.results.totalPages > 0
        ? Math.round((this.results.compliantPages / this.results.totalPages) * 100)
        : 100;

    console.log(`\n📈 COMPLIANCE SCORE: ${complianceScore}%`);
    console.log(`📊 TOTAL ISSUES: ${totalIssues}`);

    if (totalIssues === 0) {
      console.log('\n🎉 ALL PAGES ARE FULLY COMPLIANT! ✨');
    } else {
      console.log(`\n🔧 RECOMMENDATION: Fix ${totalIssues} issues before deploying.`);
      console.log('\n💡 TIPS:');
      console.log("   - Use design tokens: import { colors } from '@/design-system/tokens/colors'");
      console.log('   - Use Tailwind classes instead of inline styles');
      console.log('   - Ensure all pages have .config.ts and .meta.ts files');
      console.log('   - Register new pages in routes.config.ts');
    }

    return totalIssues === 0;
  }
}

// Main execution
function main() {
  const checker = new PagePatternChecker();

  console.log('🔍 Scanning pages for compliance issues...\n');

  checker.walk(SRC_DIR);
  const success = checker.generateReport();

  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  main();
}

module.exports = PagePatternChecker;
