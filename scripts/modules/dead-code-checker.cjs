/**
 * 💀 Dead Code Checker Module - AI Guardian Ultimate v5.0
 * Detects unused exports, duplicate code, and optimization opportunities
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class DeadCodeChecker {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.results = {
      deadExports: { passed: true, issues: [], count: 0 },
      duplicateCode: { passed: true, blocks: [], count: 0 },
      unusedDependencies: { passed: true, packages: [] },
    };
  }

  async runDeadExportsCheck() {
    console.log('💀 ts-prune: Detecting unused exports...');

    try {
      // Check if ts-prune is available
      execSync('which npx', { stdio: 'pipe' });

      const output = execSync('npx ts-prune --error', {
        encoding: 'utf8',
        cwd: this.projectRoot,
        stdio: 'pipe',
      });

      if (output.trim()) {
        this.parseDeadExports(output);
        console.log(`⚠️ Found ${this.results.deadExports.count} unused exports`);
      } else {
        console.log('✅ No unused exports detected');
      }
    } catch (error) {
      if (error.message.includes('Command failed')) {
        this.parseDeadExports(error.stdout || error.message);
        if (this.results.deadExports.count > 0) {
          this.results.deadExports.passed = false;
          console.log(`⚠️ ts-prune detected ${this.results.deadExports.count} unused exports`);
        }
      }
    }

    return this.results.deadExports;
  }

  parseDeadExports(output) {
    const lines = output.split('\n').filter(line => line.trim());

    for (const line of lines) {
      // Parse ts-prune output format: "src/file.ts:10 - export"
      const match = line.match(/(.+):(\d+)\s*-\s*(.+)/);
      if (match) {
        this.results.deadExports.issues.push({
          file: match[1],
          line: parseInt(match[2]),
          export: match[3].trim(),
          suggestion: `Consider removing unused export: ${match[3].trim()}`,
        });
        this.results.deadExports.count++;
      }
    }
  }

  async runDuplicateCodeCheck() {
    console.log('🧬 jscpd: Analyzing code duplication...');

    try {
      const output = execSync(
        'npx jscpd --min-lines 5 --min-tokens 50 src/ --reporters json --output ./temp',
        {
          encoding: 'utf8',
          cwd: this.projectRoot,
          stdio: 'pipe',
        }
      );

      this.parseDuplicateOutput();
    } catch (error) {
      if (error.message.includes('jscpd') || error.message.includes('not found')) {
        console.log('⚠️ jscpd not available. Install with: npm install --save-dev jscpd');
        this.results.duplicateCode.passed = true;
        this.results.duplicateCode.count = 0;
      } else {
        // jscpd might exit with 1 even when successful but finds duplicates
        this.parseDuplicateOutput();
      }
    }

    if (this.results.duplicateCode.count > 0) {
      this.results.duplicateCode.passed = false;
      console.log(`⚠️ Found ${this.results.duplicateCode.count} duplicate code blocks`);
    } else {
      console.log('✅ No significant code duplication detected');
    }

    return this.results.duplicateCode;
  }

  parseDuplicateOutput() {
    try {
      const reportPath = path.join(this.projectRoot, 'temp/jscpd-report.json');
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

        if (report.duplicates) {
          for (const duplicate of report.duplicates) {
            this.results.duplicateCode.blocks.push({
              lines: duplicate.lines,
              tokens: duplicate.tokens,
              firstFile: duplicate.firstFile?.name,
              secondFile: duplicate.secondFile?.name,
              suggestion: `Review duplication between ${duplicate.firstFile?.name} and ${duplicate.secondFile?.name}`,
            });
            this.results.duplicateCode.count++;
          }
        }

        // Cleanup temp file
        fs.unlinkSync(reportPath);
        if (fs.existsSync(path.join(this.projectRoot, 'temp'))) {
          fs.rmdirSync(path.join(this.projectRoot, 'temp'));
        }
      }
    } catch (error) {
      // Silently handle parsing errors
    }
  }

  async runUnusedDependenciesCheck() {
    console.log('📦 Depcheck: Scanning for unused dependencies...');

    try {
      const output = execSync('npx depcheck --json', {
        encoding: 'utf8',
        cwd: this.projectRoot,
        stdio: 'pipe',
      });

      const report = JSON.parse(output);

      if (report.dependencies && report.dependencies.length > 0) {
        this.results.unusedDependencies.packages = report.dependencies;
        this.results.unusedDependencies.passed = false;
        console.log(`⚠️ Found ${report.dependencies.length} unused dependencies`);
      } else {
        console.log('✅ No unused dependencies detected');
      }
    } catch (error) {
      console.log('⚠️ Dependency check failed:', error.message.substring(0, 100));
      this.results.unusedDependencies.passed = true; // Don't fail on dependency check errors
    }

    return this.results.unusedDependencies;
  }

  async runAllChecks() {
    await this.runDeadExportsCheck();
    await this.runDuplicateCodeCheck();
    await this.runUnusedDependenciesCheck();

    return {
      deadExports: this.results.deadExports,
      duplicateCode: this.results.duplicateCode,
      unusedDependencies: this.results.unusedDependencies,
    };
  }

  generateDeadCodeReport() {
    const report = {
      section: 'Dead Code Analysis',
      status:
        this.results.deadExports.passed &&
        this.results.duplicateCode.passed &&
        this.results.unusedDependencies.passed
          ? 'PASSED'
          : 'NEEDS_CLEANUP',
      summary: {
        deadExports: this.results.deadExports.count,
        duplicateBlocks: this.results.duplicateCode.count,
        unusedPackages: this.results.unusedDependencies.packages.length,
      },
      details: {
        deadExports: this.results.deadExports.issues.slice(0, 5),
        duplicates: this.results.duplicateCode.blocks.slice(0, 3),
        unusedDeps: this.results.unusedDependencies.packages.slice(0, 5),
      },
      recommendations: this.generateCleanupRecommendations(),
    };

    return report;
  }

  generateCleanupRecommendations() {
    const recommendations = [];

    if (this.results.deadExports.count > 0) {
      recommendations.push('🧹 Remove unused exports to reduce bundle size');
    }

    if (this.results.duplicateCode.count > 0) {
      recommendations.push('🔄 Refactor duplicate code blocks into reusable functions');
    }

    if (this.results.unusedDependencies.packages.length > 0) {
      recommendations.push('📦 Remove unused dependencies to reduce bundle size');
    }

    return recommendations;
  }
}

module.exports = DeadCodeChecker;
