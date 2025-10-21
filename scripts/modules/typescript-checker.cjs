/**
 * 📘 TypeScript Checker Module - AI Guardian Ultimate v5.0
 * Comprehensive TypeScript validation and build testing
 */

const { execSync } = require('child_process');

class TypeScriptChecker {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.results = {
      typecheck: { passed: false, errors: [] },
      build: { passed: false, output: '' },
      strictness: { score: 0, issues: [] },
    };
  }

  async runTypeScriptCheck() {
    console.log('📘 TypeScript: Running type validation...');

    try {
      const output = execSync('npm run typecheck', {
        encoding: 'utf8',
        cwd: this.projectRoot,
        stdio: 'pipe',
      });

      this.results.typecheck.passed = true;
      console.log('✅ TypeScript compilation successful');
    } catch (error) {
      this.parseTypeScriptErrors(error.stdout || error.message);
      console.log(
        `❌ TypeScript compilation failed: ${this.results.typecheck.errors.length} errors`
      );
    }

    return this.results.typecheck;
  }

  async runBuildTest() {
    console.log('🏗️ Build: Testing production build...');

    try {
      const output = execSync('npm run build', {
        encoding: 'utf8',
        cwd: this.projectRoot,
        stdio: 'pipe',
      });

      this.results.build.passed = true;
      this.results.build.output = 'Build completed successfully';
      console.log('✅ Production build successful');
    } catch (error) {
      this.results.build.passed = false;
      this.results.build.output = error.message;
      console.log('❌ Production build failed');
    }

    return this.results.build;
  }

  parseTypeScriptErrors(output) {
    // Parse TypeScript compiler output
    const errorLines = output
      .split('\n')
      .filter(line => line.includes('error TS') || line.includes(': error'));

    for (const line of errorLines) {
      const match = line.match(/(.+)\((\d+),(\d+)\):\s*error\s*(TS\d+):\s*(.+)/);
      if (match) {
        this.results.typecheck.errors.push({
          file: match[1],
          line: parseInt(match[2]),
          column: parseInt(match[3]),
          code: match[4],
          message: match[5],
        });
      } else {
        // Fallback for other error formats
        this.results.typecheck.errors.push({
          message: line.trim(),
        });
      }
    }
  }

  async checkTypeScriptStrictness() {
    console.log('🔍 TypeScript: Analyzing strictness configuration...');

    try {
      const fs = require('fs');
      const path = require('path');
      const tsconfigPath = path.join(this.projectRoot, 'tsconfig.json');

      if (!fs.existsSync(tsconfigPath)) {
        this.results.strictness.issues.push('tsconfig.json not found');
        return this.results.strictness;
      }

      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
      const compilerOptions = tsconfig.compilerOptions || {};

      // Check strict mode settings
      const strictChecks = {
        strict: compilerOptions.strict === true,
        noImplicitAny: compilerOptions.noImplicitAny !== false,
        strictNullChecks: compilerOptions.strictNullChecks !== false,
        noImplicitReturns: compilerOptions.noImplicitReturns === true,
        noFallthroughCasesInSwitch: compilerOptions.noFallthroughCasesInSwitch === true,
      };

      let score = 0;
      for (const [check, passed] of Object.entries(strictChecks)) {
        if (passed) {
          score += 20;
        } else {
          this.results.strictness.issues.push(`${check} is not enabled`);
        }
      }

      this.results.strictness.score = score;
      console.log(`📊 TypeScript strictness score: ${score}/100`);
    } catch (error) {
      this.results.strictness.issues.push(`Error reading tsconfig.json: ${error.message}`);
    }

    return this.results.strictness;
  }

  generateTypeScriptReport() {
    const report = {
      section: 'TypeScript Analysis',
      status: this.results.typecheck.passed && this.results.build.passed ? 'PASSED' : 'FAILED',
      summary: {
        typecheckPassed: this.results.typecheck.passed,
        buildPassed: this.results.build.passed,
        typeErrors: this.results.typecheck.errors.length,
        strictnessScore: this.results.strictness.score,
      },
      details: {
        errors: this.results.typecheck.errors.slice(0, 5),
        strictness: this.results.strictness.issues,
      },
      recommendations: this.generateRecommendations(),
    };

    return report;
  }

  generateRecommendations() {
    const recommendations = [];

    if (!this.results.typecheck.passed) {
      recommendations.push('🚨 Fix TypeScript compilation errors before proceeding');
    }

    if (!this.results.build.passed) {
      recommendations.push(
        '🏗️ Resolve build failures - check for missing dependencies or config issues'
      );
    }

    if (this.results.strictness.score < 80) {
      recommendations.push('🔒 Enable stricter TypeScript settings for better type safety');
    }

    return recommendations;
  }
}

module.exports = TypeScriptChecker;
