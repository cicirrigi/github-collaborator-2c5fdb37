/**
 * 🧩 ESLint Checker Module - AI Guardian Ultimate v5.0
 * Comprehensive linting with detailed output capture
 */

const { execSync } = require('child_process')

class ESLintChecker {
  constructor(projectRoot) {
    this.projectRoot = projectRoot
    this.results = {
      passed: false,
      issues: [],
      fixableIssues: 0,
      criticalErrors: 0,
      warnings: 0,
      output: ''
    }
  }

  async runESLintCheck() {
    console.log('🧩 ESLint: Running comprehensive validation...')
    
    try {
      // Run ESLint with detailed output
      const output = execSync(
        'npm run lint -- --max-warnings=0 --ext .ts,.tsx,.js,.jsx src --format=json', 
        {
          encoding: 'utf8',
          cwd: this.projectRoot,
          stdio: 'pipe'  // Capture for parsing
        }
      )
      
      this.results.passed = true
      this.results.output = 'ESLint passed - no issues detected'
      console.log('✅ ESLint validation passed')
      
    } catch (error) {
      this.parseESLintOutput(error.stdout || error.message)
      console.log(`❌ ESLint found ${this.results.criticalErrors} errors, ${this.results.warnings} warnings`)
    }

    return this.results
  }

  parseESLintOutput(output) {
    try {
      // Try to parse JSON output
      const eslintResults = JSON.parse(output)
      
      for (const fileResult of eslintResults) {
        for (const message of fileResult.messages) {
          this.results.issues.push({
            file: fileResult.filePath,
            line: message.line,
            column: message.column,
            severity: message.severity === 2 ? 'error' : 'warning',
            message: message.message,
            rule: message.ruleId,
            fixable: message.fix ? true : false
          })

          if (message.severity === 2) {
            this.results.criticalErrors++
          } else {
            this.results.warnings++
          }

          if (message.fix) {
            this.results.fixableIssues++
          }
        }
      }
    } catch (e) {
      // Fallback to text parsing if JSON fails
      this.results.output = output
      this.results.criticalErrors = (output.match(/error/gi) || []).length
      this.results.warnings = (output.match(/warning/gi) || []).length
    }
  }

  async runPrettierCheck() {
    console.log('💅 Prettier: Checking code formatting...')
    
    try {
      execSync('npm run format:check', {
        stdio: 'pipe',
        cwd: this.projectRoot
      })
      
      console.log('✅ Prettier formatting is consistent')
      return { passed: true, issues: [] }
      
    } catch (error) {
      console.log('⚠️ Prettier formatting issues detected')
      return { 
        passed: false, 
        issues: ['Code formatting inconsistencies detected - run "npm run format"']
      }
    }
  }

  generateESLintReport() {
    const report = {
      section: 'ESLint Analysis',
      status: this.results.passed ? 'PASSED' : 'FAILED',
      summary: {
        totalIssues: this.results.issues.length,
        criticalErrors: this.results.criticalErrors,
        warnings: this.results.warnings,
        fixableIssues: this.results.fixableIssues
      },
      details: this.results.issues.slice(0, 10), // Top 10 issues
      recommendations: this.generateRecommendations()
    }

    return report
  }

  generateRecommendations() {
    const recommendations = []
    
    if (this.results.criticalErrors > 0) {
      recommendations.push('🚨 Fix critical ESLint errors before deployment')
    }
    
    if (this.results.fixableIssues > 5) {
      recommendations.push('🔧 Run "npm run lint:fix" to auto-fix issues')
    }
    
    if (this.results.warnings > 20) {
      recommendations.push('⚠️ Consider addressing ESLint warnings for better code quality')
    }

    return recommendations
  }
}

module.exports = ESLintChecker
