#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class CodeAuditor {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.srcDir = path.join(__dirname, '../src');
    this.docsDir = path.join(__dirname, '../docs');
  }

  // 📏 Check file size limits
  checkFileSizes() {
    const maxLines = 250;
    const files = this.getAllTsFiles();

    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n').length;

      if (lines > maxLines) {
        this.errors.push(`File too large: ${file} (${lines} lines > ${maxLines})`);
      }
    });
  }

  // 🚫 Check for forbidden patterns
  checkForbiddenPatterns() {
    const patterns = [
      {
        pattern: /console\.(log|error|warn|info)/g,
        type: 'error',
        message: 'Console statements found',
      },
      { pattern: /:\s*any\b/g, type: 'error', message: 'Any type usage found' },
      { pattern: /TODO|FIXME|HACK/gi, type: 'warning', message: 'TODO/FIXME comments found' },
      { pattern: /#[0-9a-fA-F]{6}/g, type: 'warning', message: 'Hardcoded colors found' },
      { pattern: /style\s*=\s*\{\{/g, type: 'warning', message: 'Inline styles found' },
    ];

    const files = this.getAllTsFiles();

    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');

      patterns.forEach(({ pattern, type, message }) => {
        const matches = content.match(pattern);
        if (matches) {
          const issue = `${message} in ${file}: ${matches.length} occurrences`;
          if (type === 'error') {
            this.errors.push(issue);
          } else {
            this.warnings.push(issue);
          }
        }
      });
    });
  }

  // 📁 Check folder structure compliance
  checkFolderStructure() {
    const requiredFolders = [
      'src/app',
      'src/components/ui',
      'src/components/features',
      'src/lib',
      'src/hooks',
      'src/types',
      'src/design-system/tokens',
      'docs',
    ];

    requiredFolders.forEach(folder => {
      if (!fs.existsSync(path.join(__dirname, '../', folder))) {
        this.errors.push(`Required folder missing: ${folder}`);
      }
    });
  }

  // 🔒 Check for security issues
  checkSecurity() {
    const securityPatterns = [
      { pattern: /password\s*=\s*['"][^'"]*['"]/gi, message: 'Potential hardcoded password' },
      { pattern: /api[_-]?key\s*=\s*['"][^'"]*['"]/gi, message: 'Potential hardcoded API key' },
      { pattern: /secret\s*=\s*['"][^'"]*['"]/gi, message: 'Potential hardcoded secret' },
      { pattern: /token\s*=\s*['"][^'"]*['"]/gi, message: 'Potential hardcoded token' },
    ];

    const files = this.getAllTsFiles();

    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');

      securityPatterns.forEach(({ pattern, message }) => {
        if (pattern.test(content)) {
          this.errors.push(`Security issue: ${message} in ${file}`);
        }
      });
    });
  }

  // 📦 Check imports compliance
  checkImports() {
    const files = this.getAllTsFiles();

    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        // Check for deep relative imports
        if (line.includes('import') && line.includes('../../../')) {
          this.warnings.push(`Deep relative import in ${file}:${index + 1}. Use @/ alias instead.`);
        }
      });
    });
  }

  // 📄 Get all TypeScript files
  getAllTsFiles() {
    const files = [];

    const walk = dir => {
      if (!fs.existsSync(dir)) return;

      const items = fs.readdirSync(dir);

      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          walk(fullPath);
        } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
          files.push(fullPath);
        }
      });
    };

    walk(this.srcDir);
    return files;
  }

  // 🏃‍♂️ Run all audits
  async runAudit() {
    console.log('🔍 Running Code Audit...\n');

    this.checkFileSizes();
    this.checkForbiddenPatterns();
    this.checkFolderStructure();
    this.checkSecurity();
    this.checkImports();

    this.reportResults();

    return this.errors.length === 0;
  }

  // 📊 Report results
  reportResults() {
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ Code audit passed! No issues found.');
      this.writeReport('passed');
      return;
    }

    if (this.errors.length > 0) {
      console.log('❌ ERRORS FOUND:');
      this.errors.forEach(error => console.log(`  - ${error}`));
      console.log('');
    }

    if (this.warnings.length > 0) {
      console.log('⚠️  WARNINGS FOUND:');
      this.warnings.forEach(warning => console.log(`  - ${warning}`));
      console.log('');
    }

    console.log(`📊 Summary: ${this.errors.length} errors, ${this.warnings.length} warnings`);

    if (this.errors.length > 0) {
      console.log('❌ Audit failed due to errors.');
      this.writeReport('failed');
      // Don't exit when used as module, let caller handle it
    } else {
      console.log('⚠️  Audit passed with warnings.');
      this.writeReport('passed-with-warnings');
    }
  }

  // 📝 Write quality report
  writeReport(status) {
    const reportPath = path.join(this.docsDir, 'QUALITY-REPORT.md');
    const date = new Date().toISOString();
    const timestamp = new Date().toLocaleString('ro-RO');

    const statusEmoji = {
      passed: '✅',
      'passed-with-warnings': '⚠️',
      failed: '❌',
    };

    const statusText = {
      passed: 'PASSED',
      'passed-with-warnings': 'PASSED (with warnings)',
      failed: 'FAILED',
    };

    let errorsList = '';
    if (this.errors.length > 0) {
      errorsList = '\n## ❌ Errors Found:\n';
      this.errors.forEach(error => {
        errorsList += `- ${error}\n`;
      });
    }

    let warningsList = '';
    if (this.warnings.length > 0) {
      warningsList = '\n## ⚠️ Warnings Found:\n';
      this.warnings.forEach(warning => {
        warningsList += `- ${warning}\n`;
      });
    }

    const report = `# 📊 QUALITY REPORT

**Last Updated:** ${timestamp}  
**Status:** ${statusEmoji[status]} **${statusText[status]}**  
**Errors:** ${this.errors.length}  
**Warnings:** ${this.warnings.length}  

---

## 📈 Summary

${
  status === 'passed'
    ? '🎉 **All quality checks passed successfully!** Code is ready for production.'
    : status === 'passed-with-warnings'
      ? '⚠️  **Quality checks passed but with warnings.** Consider addressing warnings for better code quality.'
      : '❌ **Quality checks failed.** Fix errors before proceeding.'
}

## 🔍 Last Audit Details

- **Files Checked:** ${this.getAllTsFiles().length} TypeScript files
- **Patterns Checked:** Console logs, any types, hardcoded values, security issues
- **Structure Verified:** ✅ Folder compliance checked
- **Security Scan:** ✅ Completed

${errorsList}${warningsList}

---

## 🛠️ Quick Actions

${
  status !== 'passed'
    ? `
### To fix issues:
1. Review the errors/warnings above
2. Run \`pnpm lint:fix\` to auto-fix lint issues
3. Run \`pnpm typecheck\` to check TypeScript errors
4. Run \`pnpm audit:custom\` to re-run this audit
5. Run \`pnpm quality-gate\` for full verification
`
    : `
### Maintenance:
- Run \`pnpm quality-gate\` before commits
- Check \`FREEZE-LIST.md\` before modifying protected files
- Follow \`CHECKLIST.md\` for new features
`
}

---

*Generated by: Vantage Lane 2.0 Quality Audit System*  
*ISO Date: ${date}*
`;

    try {
      fs.writeFileSync(reportPath, report, 'utf8');
      console.log(`📝 Updated quality report: ${reportPath}`);
    } catch (error) {
      console.warn('⚠️  Failed to write quality report:', error.message);
    }
  }
}

// Run audit if called directly
if (require.main === module) {
  const auditor = new CodeAuditor();
  auditor
    .runAudit()
    .then(passed => {
      process.exit(passed ? 0 : 1);
    })
    .catch(error => {
      console.error('Audit failed:', error);
      process.exit(1);
    });
}

module.exports = CodeAuditor;
