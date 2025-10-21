/**
 * 🧩 UI Pattern Checker - AI Guardian Ultimate v5.0
 * Enforces LuxuryCard-style modular structure for all UI components
 */

const fs = require('fs');
const path = require('path');

class UIPatternChecker {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.uiDir = path.join(projectRoot, 'src/components/ui');
    this.results = {
      compliant: [],
      violations: [],
      suggestions: [],
    };
  }

  async checkUIPatternCompliance() {
    console.log('🧩 UI Patterns: Checking component structure compliance...');

    if (!fs.existsSync(this.uiDir)) {
      return { passed: false, error: 'UI components directory not found' };
    }

    const components = fs
      .readdirSync(this.uiDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const component of components) {
      this.checkComponentStructure(component);
    }

    const totalComponents = components.length;
    const compliantComponents = this.results.compliant.length;
    const complianceRate =
      totalComponents > 0 ? ((compliantComponents / totalComponents) * 100).toFixed(1) : 0;

    console.log(
      `📊 UI Pattern Compliance: ${compliantComponents}/${totalComponents} (${complianceRate}%)`
    );

    return {
      passed: this.results.violations.length === 0,
      complianceRate,
      compliant: this.results.compliant,
      violations: this.results.violations,
      suggestions: this.results.suggestions,
    };
  }

  checkComponentStructure(componentName) {
    const componentDir = path.join(this.uiDir, componentName);
    const requiredFiles = [
      `${componentName}.tsx`, // Main component
      `${componentName}.types.ts`, // TypeScript definitions
      'index.ts', // Barrel export
      'README.md', // Documentation
    ];

    const recommendedFiles = [
      `${componentName}.variants.ts`, // Styling variants
      `${componentName}.stories.tsx`, // Storybook stories
      `${componentName}.test.tsx`, // Jest tests
      `use${componentName}.ts`, // useComponent hook
      `${componentName}.helpers.ts`, // Utility functions
    ];

    const existingFiles = fs.readdirSync(componentDir);
    const missingRequired = requiredFiles.filter(file => !existingFiles.includes(file));
    const missingRecommended = recommendedFiles.filter(file => !existingFiles.includes(file));

    // Check main component file
    const mainFile = path.join(componentDir, `${componentName}.tsx`);
    if (fs.existsSync(mainFile)) {
      this.checkComponentFileStructure(mainFile, componentName);
    }

    // Check types file
    const typesFile = path.join(componentDir, `${componentName}.types.ts`);
    if (fs.existsSync(typesFile)) {
      this.checkTypesFileStructure(typesFile, componentName);
    }

    // Check barrel export
    const indexFile = path.join(componentDir, 'index.ts');
    if (fs.existsSync(indexFile)) {
      this.checkBarrelExport(indexFile, componentName);
    }

    // Check useComponent hook (v3.0 pattern)
    const hookFile = path.join(componentDir, `use${componentName}.ts`);
    if (fs.existsSync(hookFile)) {
      this.checkHookFile(hookFile, componentName);
    }

    // Record results
    if (missingRequired.length === 0) {
      this.results.compliant.push({
        component: componentName,
        files: existingFiles.length,
        missingRecommended,
      });
    } else {
      this.results.violations.push({
        component: componentName,
        missingRequired,
        missingRecommended,
      });
    }

    // Add suggestions for improvements
    if (missingRecommended.length > 0) {
      this.results.suggestions.push({
        component: componentName,
        suggestion: `Consider adding: ${missingRecommended.join(', ')}`,
      });
    }
  }

  checkComponentFileStructure(filePath, componentName) {
    const content = fs.readFileSync(filePath, 'utf8');

    // Check for required patterns
    const patterns = [
      { pattern: /'use client'/, message: 'Missing "use client" directive' },
      {
        pattern: /export interface \w+Props/,
        message: 'Missing Props interface export',
      },
      {
        pattern: /export function \w+/,
        message: 'Missing main component export',
      },
      {
        pattern: /JSX\.Element/,
        message: 'Consider using JSX.Element return type',
      },
      {
        pattern: /className\?:/,
        message: 'Missing className prop for customization',
      },
      {
        pattern: /designTokens|brandConfig/,
        message: 'Should integrate designTokens or brandConfig',
      },
      {
        pattern: /cva\(/,
        message: 'Should use class-variance-authority (cva) for variants',
      },
    ];

    patterns.forEach(({ pattern, message }) => {
      if (!pattern.test(content)) {
        this.results.suggestions.push({
          component: componentName,
          file: `${componentName}.tsx`,
          suggestion: message,
        });
      }
    });
  }

  checkTypesFileStructure(filePath, componentName) {
    const content = fs.readFileSync(filePath, 'utf8');

    // Check for comprehensive typing
    const typePatterns = [
      {
        pattern: new RegExp(`export type ${componentName}Variant`),
        message: 'Consider adding Variant type',
      },
      {
        pattern: new RegExp(`export type ${componentName}Size`),
        message: 'Consider adding Size type',
      },
      { pattern: /readonly/, message: 'Consider using readonly for props' },
    ];

    typePatterns.forEach(({ pattern, message }) => {
      if (!pattern.test(content)) {
        this.results.suggestions.push({
          component: componentName,
          file: `${componentName}.types.ts`,
          suggestion: message,
        });
      }
    });
  }

  checkBarrelExport(filePath, componentName) {
    const content = fs.readFileSync(filePath, 'utf8');

    // Check for proper barrel exports
    if (!content.includes(`export { ${componentName} }`)) {
      this.results.violations.push({
        component: componentName,
        file: 'index.ts',
        issue: 'Missing main component export in barrel file',
      });
    }

    if (!content.includes('export type')) {
      this.results.suggestions.push({
        component: componentName,
        file: 'index.ts',
        suggestion: 'Consider exporting types for better developer experience',
      });
    }
  }

  checkHookFile(filePath, componentName) {
    const content = fs.readFileSync(filePath, 'utf8');

    // Check for proper hook structure (v3.0 pattern)
    const hookPatterns = [
      {
        pattern: new RegExp(`export function use${componentName}`),
        msg: 'Missing main hook export',
      },
      {
        pattern: /useState|useCallback|useMemo/,
        msg: 'Hook should use React hooks',
      },
      { pattern: /\/\*\*.*\*\//, msg: 'Hook should have JSDoc documentation' },
    ];

    hookPatterns.forEach(({ pattern, msg }) => {
      if (!pattern.test(content)) {
        this.results.suggestions.push({
          component: componentName,
          file: `use${componentName}.ts`,
          suggestion: msg,
        });
      }
    });
  }

  checkDesignSystemCompliance() {
    // Check if components use design tokens instead of hardcoded values
    const components = fs
      .readdirSync(this.uiDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory());

    for (const component of components) {
      const componentDir = path.join(this.uiDir, component.name);
      const files = fs
        .readdirSync(componentDir)
        .filter(file => file.endsWith('.tsx') || file.endsWith('.ts'));

      for (const file of files) {
        const filePath = path.join(componentDir, file);
        const content = fs.readFileSync(filePath, 'utf8');

        // Check for hardcoded values that should use design tokens
        if (/#[0-9a-fA-F]{6}/.test(content)) {
          this.results.violations.push({
            component: component.name,
            file,
            issue: 'Hardcoded hex color found - use design tokens instead',
          });
        }

        if (/\b\d+(px|rem|em)\b/.test(content) && !content.includes('design-system')) {
          this.results.suggestions.push({
            component: component.name,
            file,
            suggestion: 'Consider using design system spacing tokens',
          });
        }
      }
    }
  }

  generateUIPatternReport() {
    const report = {
      section: 'UI Pattern Compliance',
      status: this.results.violations.length === 0 ? 'COMPLIANT' : 'NEEDS_IMPROVEMENT',
      summary: {
        totalComponents: this.results.compliant.length + this.results.violations.length,
        compliantComponents: this.results.compliant.length,
        violations: this.results.violations.length,
        suggestions: this.results.suggestions.length,
      },
      details: {
        compliant: this.results.compliant,
        violations: this.results.violations.slice(0, 10),
        suggestions: this.results.suggestions.slice(0, 10),
      },
      recommendations: this.generateUIRecommendations(),
    };

    return report;
  }

  generateUIRecommendations() {
    const recommendations = [];

    if (this.results.violations.length > 0) {
      recommendations.push('🏗️ Fix component structure violations to maintain consistency');
      recommendations.push('📝 Use "npm run create:ui ComponentName" for new components');
    }

    if (this.results.suggestions.length > 5) {
      recommendations.push('🎨 Review suggestions to improve component quality');
    }

    recommendations.push('📚 Follow LuxuryCard pattern for all new UI components');

    return recommendations;
  }
}

module.exports = UIPatternChecker;
