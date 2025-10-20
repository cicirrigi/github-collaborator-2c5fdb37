#!/usr/bin/env node
/* eslint-env node, es2022 */
/* eslint-disable */
/**
 * 🛡️ AI Guardian Ultimate v5.0 - Vantage Lane Enterprise QA
 * 
 * Unified modular quality assurance system combining:
 * - ai-guardian-enterprise.js (938 lines) → modular approach
 * - quality-gate-ultimate.js (519 lines) → external tools integration
 * - New: docs alignment, Vantage Lane specific checks
 * 
 * Total: ~450 lines + modular architecture
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Import modules
const ESLintChecker = require('./modules/eslint-checker')
const TypeScriptChecker = require('./modules/typescript-checker') 
const DeadCodeChecker = require('./modules/dead-code-checker')
const { 
  criticalPatterns, 
  warningPatterns, 
  vantageLanePatterns,
  fileSizeLimits,
  excludeDirectories,
  excludeFiles 
} = require('./config/patterns')

class AIGuardianUltimate {
  constructor() {
    this.errors = []
    this.warnings = []
    this.fixes = []
    this.info = []
    
    // Paths
    this.projectRoot = path.join(__dirname, '..')
    this.srcDir = path.join(this.projectRoot, 'src')
    this.docsDir = path.join(this.projectRoot, 'docs')
    
    // Performance optimizations
    this.fileCache = new Map()
    this.projectCoverage = {}
    this.startTime = performance.now()
    
    // Module instances
    this.eslintChecker = new ESLintChecker(this.projectRoot)
    this.tsChecker = new TypeScriptChecker(this.projectRoot)  
    this.deadCodeChecker = new DeadCodeChecker(this.projectRoot)
  }

  // 🚀 MAIN AUDIT RUNNER
  async runAudit() {
    console.log('\n🛡️ AI Guardian Ultimate v5.0 - Vantage Lane Enterprise QA')
    console.log('=' .repeat(65))
    
    console.log('⚙️ Running 6 parallel quality checks...\n')
    
    // Run all checks in parallel for maximum performance
    const checkPromises = [
      this.runExternalChecks(),
      this.runStructureChecks(), 
      this.runDocsAlignment(),
      this.runVantageLaneChecks(),
      this.runPatternChecks(),
      this.runFileSizeChecks()
    ]
    
    await Promise.allSettled(checkPromises)
    
    const duration = ((performance.now() - this.startTime) / 1000).toFixed(2)
    await this.generateUnifiedReport(duration)
    
    // Exit with appropriate code for CI/CD
    const totalIssues = this.errors.length + this.warnings.length
    const qualityScore = this.calculateQualityScore()
    
    console.log(`\n📊 Quality Score: ${qualityScore}/100`)
    console.log(`⏱️ Audit completed in ${duration}s`)
    
    if (qualityScore < 80) {
      console.log('\n❌ Quality Gate FAILED - Minimum 80 required for deployment')
      process.exit(1)
    } else {
      console.log('\n✅ Quality Gate PASSED - Ready for deployment')
      process.exit(0)
    }
  }

  // 🔍 EXTERNAL TOOLS INTEGRATION  
  async runExternalChecks() {
    console.log('🔍 External Tools: ESLint, TypeScript, Build, Dead Code...')
    
    try {
      // Run ESLint with full output capture
      const eslintResult = await this.eslintChecker.runESLintCheck()
      if (!eslintResult.passed) {
        this.errors.push(`ESLint validation failed: ${eslintResult.criticalErrors} errors, ${eslintResult.warnings} warnings`)
      }
      
      // Run TypeScript checks
      const tsResult = await this.tsChecker.runTypeScriptCheck()
      if (!tsResult.passed) {
        this.errors.push(`TypeScript compilation failed: ${tsResult.errors.length} errors`)
      }
      
      // Test production build
      const buildResult = await this.tsChecker.runBuildTest()
      if (!buildResult.passed) {
        this.errors.push('Production build failed')
      }
      
      // Dead code analysis
      const deadCodeResults = await this.deadCodeChecker.runAllChecks()
      if (!deadCodeResults.deadExports.passed) {
        this.warnings.push(`${deadCodeResults.deadExports.count} unused exports detected`)
      }
      
    } catch (error) {
      this.errors.push(`External checks failed: ${error.message}`)
    }
  }

  // 🏗️ PROJECT STRUCTURE VALIDATION
  async runStructureChecks() {
    console.log('🏗️ Structure: Scanning project organization...')
    
    const allFiles = this.getAllProjectFiles()
    
    // Check if critical folders exist
    const requiredFolders = [
      'src/components/ui',
      'src/lib', 
      'src/app',
      'docs'
    ]
    
    for (const folder of requiredFolders) {
      const fullPath = path.join(this.projectRoot, folder)
      if (!fs.existsSync(fullPath)) {
        this.errors.push(`Missing required folder: ${folder}`)
      }
    }
    
    // Track project coverage
    this.projectCoverage = {
      totalFiles: allFiles.length,
      scannedFiles: allFiles.length,
      coverage: '100%'
    }
  }

  // 📚 DOCUMENTATION ALIGNMENT 
  async runDocsAlignment() {
    console.log('📚 Docs: Checking alignment with project reality...')
    
    try {
      // Check if major docs exist and are up-to-date
      const criticalDocs = [
        'STRUCTURE_GUIDE.md',
        'DEVELOPMENT_GUIDELINES.md', 
        'DEPENDENCIES.md',
        'README.md'
      ]
      
      const srcModified = fs.statSync(this.srcDir).mtimeMs
      
      for (const doc of criticalDocs) {
        const docPath = path.join(this.docsDir, doc)
        
        if (!fs.existsSync(docPath)) {
          this.errors.push(`Missing critical documentation: ${doc}`)
          continue
        }
        
        const docModified = fs.statSync(docPath).mtimeMs
        const daysDiff = (srcModified - docModified) / (1000 * 60 * 60 * 24)
        
        if (daysDiff > 7) {
          this.warnings.push(`${doc} may be outdated (last modified ${Math.floor(daysDiff)} days ago)`)
        }
      }
      
    } catch (error) {
      this.warnings.push(`Documentation check failed: ${error.message}`)
    }
  }

  // 🏆 VANTAGE LANE SPECIFIC CHECKS
  async runVantageLaneChecks() {
    console.log('🏆 Vantage Lane: Brand consistency & design system compliance...')
    
    try {
      // Check for design token consistency
      const tokensPath = path.join(this.srcDir, 'design-system/tokens/colors.ts')
      if (!fs.existsSync(tokensPath)) {
        this.errors.push('Missing design tokens: design-system/tokens/colors.ts')
      }
      
      // Check for config centralization  
      const configs = ['theme.config.ts', 'site.config.ts']
      for (const config of configs) {
        const configPath = path.join(this.srcDir, 'config', config)
        if (!fs.existsSync(configPath)) {
          this.warnings.push(`Missing config file: config/${config}`)
        }
      }
      
      // Component pattern consistency (LuxuryCard standard)
      const luxuryCardPath = path.join(this.srcDir, 'components/ui/LuxuryCard')
      if (fs.existsSync(luxuryCardPath)) {
        const requiredFiles = ['LuxuryCard.tsx', 'LuxuryCard.types.ts', 'index.ts', 'README.md']
        for (const file of requiredFiles) {
          if (!fs.existsSync(path.join(luxuryCardPath, file))) {
            this.warnings.push(`LuxuryCard missing standard file: ${file}`)
          }
        }
      }
      
    } catch (error) {
      this.warnings.push(`Vantage Lane checks failed: ${error.message}`)
    }
  }

  // 🎯 PATTERN VALIDATION
  async runPatternChecks() {
    console.log('🎯 Patterns: Scanning for anti-patterns and violations...')
    
    const allFiles = this.getAllTsFiles()
    
    for (const file of allFiles) {
      if (this.isScriptFile(file) || this.isDocsFile(file)) continue
      
      const content = this.getFileContent(file)
      const relativePath = path.relative(this.projectRoot, file)
      
      // Check critical patterns (errors)
      for (const pattern of criticalPatterns) {
        if (pattern.p.test(content)) {
          this.errors.push(`${relativePath}: ${pattern.msg}`)
        }
      }
      
      // Check warning patterns
      for (const pattern of [...warningPatterns, ...vantageLanePatterns]) {
        if (pattern.p.test(content)) {
          this.warnings.push(`${relativePath}: ${pattern.msg}`)
        }
      }
    }
  }

  // 📏 FILE SIZE VALIDATION
  async runFileSizeChecks() {
    console.log('📏 Size: Checking file size compliance...')
    
    const allFiles = this.getAllProjectFiles()
    
    for (const file of allFiles) {
      const ext = path.extname(file)
      const limit = fileSizeLimits[ext]
      
      if (!limit) continue
      if (this.isScriptFile(file)) continue // Scripts have exception
      
      const content = this.getFileContent(file)
      const lines = content.split('\n').length
      
      if (lines > limit) {
        const relativePath = path.relative(this.projectRoot, file)
        this.warnings.push(`File too large: ${relativePath} (${lines} lines > ${limit})`)
      }
    }
  }

  // 📁 UTILITY METHODS
  getAllProjectFiles() {
    const files = []
    
    const walk = (dir) => {
      if (!fs.existsSync(dir)) return
      
      for (const item of fs.readdirSync(dir)) {
        if (excludeDirectories.includes(item)) continue
        
        const full = path.join(dir, item)
        const stat = fs.statSync(full)
        
        if (stat.isDirectory()) {
          walk(full)
        } else if (stat.isFile()) {
          if (!excludeFiles.some(pattern => full.includes(pattern))) {
            files.push(full)
          }
        }
      }
    }
    
    walk(this.projectRoot)
    return files
  }
  
  getAllTsFiles() {
    return this.getAllProjectFiles().filter(file => 
      file.endsWith('.ts') || file.endsWith('.tsx')
    )
  }

  getFileContent(file) {
    if (!this.fileCache.has(file)) {
      try {
        const content = fs.readFileSync(file, 'utf8')
        this.fileCache.set(file, content)
      } catch (error) {
        return ''
      }
    }
    return this.fileCache.get(file)
  }

  isScriptFile(file) {
    return file.includes('/scripts/') && file.endsWith('.js')
  }

  isDocsFile(file) {
    return file.includes('/docs/') && file.endsWith('.md')
  }

  // 📊 QUALITY SCORE CALCULATION
  calculateQualityScore() {
    let score = 100
    score -= this.errors.length * 5      // Critical issues: -5 points each
    score -= this.warnings.length * 1    // Warnings: -1 point each
    return Math.max(score, 0)
  }

  // 📄 UNIFIED REPORT GENERATION
  async generateUnifiedReport(duration) {
    const reportPath = path.join(this.docsDir, 'QUALITY-REPORT.md')
    const qualityScore = this.calculateQualityScore()
    
    const report = `# 🛡️ AI Guardian Ultimate v5.0 - Quality Report

Generated: ${new Date().toISOString()}  
Duration: ${duration}s  
Quality Score: **${qualityScore}/100**

## 📊 Executive Summary

- **Critical Issues**: ${this.errors.length}
- **Warnings**: ${this.warnings.length}  
- **Files Scanned**: ${this.projectCoverage.totalFiles || 0}
- **Status**: ${qualityScore >= 80 ? '✅ PASSED' : '❌ FAILED'}

## 🔍 Issues Breakdown

### ❌ Critical Issues (${this.errors.length})
${this.errors.length ? this.errors.map(err => `- ${err}`).join('\n') : 'None detected ✅'}

### ⚠️ Warnings (${this.warnings.length})  
${this.warnings.length ? this.warnings.slice(0, 20).map(warn => `- ${warn}`).join('\n') : 'None detected ✅'}

## 🎯 Quality Gate Status

| Check | Status | Details |
|-------|---------|---------|
| ESLint | ${this.errors.some(e => e.includes('ESLint')) ? '❌' : '✅'} | Code linting validation |
| TypeScript | ${this.errors.some(e => e.includes('TypeScript')) ? '❌' : '✅'} | Type checking |
| Build | ${this.errors.some(e => e.includes('build')) ? '❌' : '✅'} | Production build test |
| Structure | ${this.errors.some(e => e.includes('folder')) ? '❌' : '✅'} | Project organization |
| Documentation | ${this.errors.some(e => e.includes('documentation')) ? '❌' : '✅'} | Docs alignment |
| Patterns | ${this.errors.some(e => e.includes(':')) ? '❌' : '✅'} | Anti-pattern detection |

## 📋 Recommendations

${qualityScore < 80 ? '🚨 **Quality gate failed** - Fix critical issues before deployment' : '✅ **Quality gate passed** - Ready for deployment'}

${this.errors.length > 0 ? '- 🔥 **Priority**: Fix all critical issues first' : ''}
${this.warnings.length > 10 ? '- ⚠️ Consider addressing warnings for improved code quality' : ''}
${this.warnings.some(w => w.includes('outdated')) ? '- 📚 Update outdated documentation' : ''}

---
*Generated by AI Guardian Ultimate v5.0*`

    fs.writeFileSync(reportPath, report)
    console.log(`\n📄 Quality report generated: ${reportPath}`)
  }
}

// 🚀 MAIN EXECUTION
if (require.main === module) {
  const guardian = new AIGuardianUltimate()
  guardian.runAudit().catch(error => {
    console.error('❌ AI Guardian Ultimate failed:', error.message)
    process.exit(1)
  })
}

module.exports = AIGuardianUltimate
